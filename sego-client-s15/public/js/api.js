export const apiBase = 'http://localhost:4002/api/v1';
export const getToken = ()=> localStorage.getItem('token') || '';
export const setToken = (t)=> localStorage.setItem('token', t);

export async function fetchJSON(url, opts={}){
  const headers = { 'Content-Type':'application/json' };
  const t = getToken(); if(t) headers['Authorization'] = 'Bearer '+t;
  const res = await fetch(url, { method: opts.method || 'GET', headers, body: opts.body ? JSON.stringify(opts.body): undefined });
  if(!res.ok){ let e={error:'Error'}; try{ e=await res.json() }catch{}; throw new Error(e.error||'Error'); }
  return res.json();
}

export async function addToCart(productoId, qty){ return fetchJSON(`${apiBase}/carrito/items`, { method:'POST', body:{ productoId, qty } }); }
