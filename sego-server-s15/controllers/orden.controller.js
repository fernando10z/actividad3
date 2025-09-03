const Orden = require('../models/orden.schema');
const Carrito = require('../models/carrito.schema');
const Producto = require('../models/producto.schema');
const { enviarA, broadcast } = require('../utils/socket');

function generarNroPedido(){
  const n = Date.now().toString(36).toUpperCase();
  return `ORD-${n}`;
}

function crearDesdeCarrito(io){
  return async (req,res)=>{
    const cart = await Carrito.findOne({ usuario:req.user.id }).populate('items.producto');
    if(!cart || cart.items.length===0) return res.status(400).json({error:'Carrito vacío'});
    const items = cart.items.map(i=>({ producto:i.producto._id, nombre:i.producto.nombre, precio:i.producto.precio, qty:i.qty }));
    const subtotal = items.reduce((s,i)=> s+i.precio*i.qty, 0);
    const igv = +(subtotal*0.18).toFixed(2);
    const total = +(subtotal+igv).toFixed(2);
    for(const i of cart.items){
      const prod = await Producto.findById(i.producto._id);
      if(prod.stock < i.qty) return res.status(400).json({error:`Stock insuficiente: ${prod.nombre}`});
      prod.stock -= i.qty; await prod.save();
    }
    const nroPedido = generarNroPedido();
    const orden = await Orden.create({ 
      nroPedido,
      usuario:req.user.id, items, subtotal, igv, total, 
      estado:'pendiente', estadoNotificacion:'no leído', estadoPago:'pendiente'
    });
    // Notificar al cliente
    enviarA(req.user.email || req.user.id, 'nuevaOrden', { id: orden._id, nroPedido, total });
    // Notificar a Logística
    const payload = { id: orden._id, nroPedido, cliente: req.user.email, fecha: orden.creadoEn, montoTotal: total, estadoNotificacion: 'no leído' };
    io.emit('logistica:nuevo-pedido', payload);
    res.status(201).json(orden);
  };
}

async function misOrdenes(req,res){
  const ords = await Orden.find({ usuario:req.user.id }).sort({ creadoEn:-1 });
  res.json(ords);
}

async function actualizarEstado(req,res){
  const { id } = req.params; const { estado } = req.body;
  const o = await Orden.findById(id); if(!o) return res.status(404).json({error:'Orden no encontrada'});
  o.estado = estado; await o.save();
  broadcast('ordenActualizada', { id:o._id, estado:o.estado });
  res.json(o);
}

async function pagar(req,res){
  const { id } = req.params;
  const o = await Orden.findById(id);
  if(!o) return res.status(404).json({error:'Orden no encontrada'});
  if(req.user.rol !== 'admin' && o.usuario.toString() !== req.user.id) return res.status(403).json({error:'No autorizado'});
  o.estado = 'pagado';
  o.estadoPago = 'pagado';
  o.pago = { proveedor:'QR-Simulado', ref: o.nroPedido, pagadoEn: new Date() };
  await o.save();
  enviarA(req.user.email || req.user.id, 'pago-confirmado', { ordenId: o._id, nroPedido: o.nroPedido, mensaje: 'Pago confirmado' });
  broadcast('logistica:pedido-pagado', { id:o._id, nroPedido:o.nroPedido });
  res.json({ ok:true, orden:o });
}

module.exports = { crearDesdeCarrito, misOrdenes, actualizarEstado, pagar };
