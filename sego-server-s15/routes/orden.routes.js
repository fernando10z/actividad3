const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const { crearDesdeCarrito, misOrdenes, actualizarEstado, pagar } = require('../controllers/orden.controller');
module.exports = (io)=>{
  const r = express.Router();
  r.post('/', requireAuth(['admin','customer']), crearDesdeCarrito(io));
  r.get('/mias', requireAuth(['admin','customer']), misOrdenes);
  r.put('/:id/estado', requireAuth(['admin']), actualizarEstado);
  r.post('/:id/pagar', requireAuth(['admin','customer']), pagar);
  return r;
}
