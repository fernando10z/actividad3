const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref:'Persona', required: true, unique: true },
  items: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref:'Producto', required: true },
    qty: { type: Number, default: 1 }
  }],
  actualizadoEn: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Carrito', schema);
