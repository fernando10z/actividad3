const express = require('express');
const { enviar, mensajeSimple } = require('../controllers/notificacion.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const r = express.Router();
r.post('/enviar', requireAuth(['admin']), enviar);
r.post('/mensaje', requireAuth(['admin']), mensajeSimple);
module.exports = r;
