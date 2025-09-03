const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  descripcion: String,
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imagenes: [String],
  specs: Object,
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
  creadoEn: { type: Date, default: Date.now }
});
schema.index({ nombre:'text', descripcion:'text' });
module.exports = mongoose.model('Producto', schema);
