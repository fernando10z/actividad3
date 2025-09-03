const express = require('express');
const { listar, obtener, crear } = require('../controllers/producto.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const r = express.Router();
r.get('/', listar);
r.get('/:slug', obtener);
r.post('/', requireAuth(['admin']), crear);
module.exports = r;
