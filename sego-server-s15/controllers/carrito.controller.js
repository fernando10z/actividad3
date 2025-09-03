const Carrito = require('../models/carrito.schema');
const Producto = require('../models/producto.schema');

async function miCarrito(req,res){
  const cart = await Carrito.findOne({ usuario:req.user.id }).populate('items.producto','nombre precio slug');
  res.json(cart || { usuario:req.user.id, items:[] });
}

async function agregar(req,res){
  try{
    const { productoId, qty } = req.body;
    const p = await Producto.findById(productoId); if(!p) return res.status(400).json({error:'Producto inválido'});
    let cart = await Carrito.findOne({ usuario:req.user.id });
    if(!cart) cart = await Carrito.create({ usuario:req.user.id, items:[] });
    const f = cart.items.find(i=> i.producto.toString()===productoId);
    if(f) f.qty += (qty||1); else cart.items.push({ producto:productoId, qty:qty||1 });
    cart.actualizadoEn = new Date(); await cart.save();
    const populated = await cart.populate('items.producto','nombre precio slug');
    res.json(populated);
  }catch(e){ res.status(400).json({error:e.message}); }
}

async function quitar(req,res){
  const { productoId } = req.params;
  const cart = await Carrito.findOne({ usuario:req.user.id });
  if(!cart) return res.json({ usuario:req.user.id, items:[] });
  cart.items = cart.items.filter(i=> i.producto.toString()!==productoId);
  cart.actualizadoEn = new Date(); await cart.save();
  const populated = await cart.populate('items.producto','nombre precio slug');
  res.json(populated);
}

module.exports = { miCarrito, agregar, quitar };
