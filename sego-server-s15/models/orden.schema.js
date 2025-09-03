const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  nroPedido: { type: String, required: true, unique: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref:'Persona', required: true },
  items: [{ producto:{ type: mongoose.Schema.Types.ObjectId, ref:'Producto', required:true }, nombre:String, precio:Number, qty:Number }],
  subtotal: Number, igv: Number, total: Number,
  estado: { type: String, enum:['pendiente','pagado','enviado','completado','cancelado'], default:'pendiente' },
  // Notificación a Logística
  estadoNotificacion: { type: String, enum:['no leído','leído'], default:'no leído' },
  leidaPor: { type: String },
  leidaEn: { type: Date },
  // Pago
  estadoPago: { type: String, enum:['pendiente','pagado'], default:'pendiente' },
  pago: { proveedor:String, ref:String, pagadoEn:Date },
  creadoEn: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Orden', schema);
