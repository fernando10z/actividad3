const Persona = require('../models/persona.schema');
const { sign } = require('../utils/jwt');

async function registrar(req,res){
  try{
    const { nombre, email, password, rol } = req.body;
    const u = await Persona.create({ nombre, email, password, rol });
    const token = sign({ id:u._id, email:u.email, rol:u.rol, nombre:u.nombre });
    res.status(201).json({ usuario:{ id:u._id, nombre:u.nombre, email:u.email, rol:u.rol }, token });
  }catch(e){ res.status(400).json({error:e.message}); }
}

async function login(req,res){
  const { email, password } = req.body;
  const u = await Persona.findOne({ email });
  if(!u) return res.status(401).json({error:'Credenciales inválidas'});
  const ok = await u.comparar(password);
  if(!ok) return res.status(401).json({error:'Credenciales inválidas'});
  const token = sign({ id:u._id, email:u.email, rol:u.rol, nombre:u.nombre });
  res.json({ usuario:{ id:u._id, nombre:u.nombre, email:u.email, rol:u.rol }, token });
}

module.exports = { registrar, login };
