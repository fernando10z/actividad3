const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  descripcion: String
});
module.exports = mongoose.model('Categoria', schema);
