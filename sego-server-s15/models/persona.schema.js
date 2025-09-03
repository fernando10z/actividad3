const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin','customer'], default: 'customer' },
  creadoEn: { type: Date, default: Date.now }
});

schema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
schema.methods.comparar = function(p){ return bcrypt.compare(p, this.password); }

module.exports = mongoose.model('Persona', schema);
