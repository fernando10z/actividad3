const express = require('express');
const { miCarrito, agregar, quitar } = require('../controllers/carrito.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const r = express.Router();
r.get('/', requireAuth(['admin','customer']), miCarrito);
r.post('/items', requireAuth(['admin','customer']), agregar);
r.delete('/items/:productoId', requireAuth(['admin','customer']), quitar);
module.exports = r;
