import { getToken } from './api.js';
export const socket = io('http://localhost:4002', { transports:['websocket'] });

export function matricularSiLogin(){
  const t = getToken();
  if(!t) return;
  try{
    const payload = JSON.parse(atob(t.split('.')[1]));
    socket.emit('matricular', payload.email);
  }catch{}
}

socket.on('matriculado', (email)=> console.log('Matriculado:', email));
socket.on('notificacion', (n)=> {
  const div = document.querySelector('#notiFeed'); if(div){ 
    const el=document.createElement('div'); el.className='notice'; el.textContent=`${n.titulo||'Notificación'}: ${n.mensaje}`; div.prepend(el);
  } else { alert((n.titulo||'Notificación')+': '+n.mensaje); }
});
socket.on('mensajeSimple', (m)=> console.log('Mensaje simple:', m));
socket.on('nuevaOrden', (o)=> alert(`Orden creada: ${o.nroPedido} — Total: S/ ${o.total}`));
socket.on('ordenActualizada', (o)=> console.log('Orden actualizada', o));
