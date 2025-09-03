let io;
const clientes = {}; // email -> socketId

function initSocket(server, corsOrigin){
  const { Server } = require('socket.io');
  io = new Server(server, { cors: { origin: (corsOrigin||'http://localhost:3002').split(','), credentials: true } });
  io.on('connection', (socket)=>{
    console.log('🔌 Socket conectado', socket.id);
    socket.on('matricular', (email)=>{
      if(email){ clientes[email] = socket.id; socket.emit('matriculado', email); }
    });
    socket.on('mensajeSimple', (payload)=>{ socket.emit('mensajeSimple', { ok:true, echo: payload }); });

    // --- Confirmación de lectura por parte de Logística ---
    socket.on('logistica:pedido-leido', async ({ ordenId, operador })=>{
      try{
        const Orden = require('../models/orden.schema');
        const o = await Orden.findById(ordenId);
        if(!o) return;
        o.estadoNotificacion = 'leído';
        o.leidaPor = operador || 'logistica@sego.test';
        o.leidaEn = new Date();
        await o.save();
        io.emit('pedido-actualizado', { id: o._id, estadoNotificacion: o.estadoNotificacion, leidaPor: o.leidaPor, leidaEn: o.leidaEn });
      }catch(e){
        console.error('Error marcando pedido leído', e.message);
      }
    });

    socket.on('disconnect', ()=>{
      for(const [email,id] of Object.entries(clientes)){ if(id===socket.id) delete clientes[email]; }
      console.log('🔌 Socket desconectado', socket.id);
    });
  });
  return io;
}

function enviarA(email, evento, data){ if(io && clientes[email]) io.to(clientes[email]).emit(evento, data); }
function broadcast(evento, data){ if(io) io.emit(evento, data); }

module.exports = { initSocket, enviarA, broadcast };
