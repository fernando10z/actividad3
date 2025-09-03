const { enviarA, broadcast } = require('../utils/socket');

async function enviar(req,res){
  const { email, titulo, mensaje } = req.body;
  const payload = { titulo, mensaje, fecha: new Date().toISOString() };
  if(email){ enviarA(email, 'notificacion', payload); } else { broadcast('notificacion', payload); }
  res.json({ ok:true, enviadoA: email || 'todos' });
}

async function mensajeSimple(req,res){
  const { email, texto } = req.body;
  const payload = { texto, fecha: new Date().toISOString() };
  if(email){ enviarA(email, 'mensajeSimple', payload); } else { broadcast('mensajeSimple', payload); }
  res.json({ ok:true });
}

module.exports = { enviar, mensajeSimple };
