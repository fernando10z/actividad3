const express = require('express');
const { registrar, login } = require('../controllers/seguridad.controller');
const r = express.Router();
r.post('/registrar', registrar);
r.post('/login', login);
module.exports = r;
