require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const Categoria = require('../models/categoria.schema');
const Producto = require('../models/producto.schema');
const Persona = require('../models/persona.schema');

const categorias = [
  ["Sistemas de videovigilancia y CCTV","videovigilancia"],
  ["Control de acceso y sistemas de seguridad electrónica","control-acceso"],
  ["Alarmas y detección de intrusos","alarmas"],
  ["Seguridad perimetral","seguridad-perimetral"],
  ["Seguridad para transporte","seguridad-transporte"],
  ["Seguridad bancaria y financiera","seguridad-bancaria"],
  ["Identificación y autenticación biométrica","biometria"],
  ["Protección contra incendios y humo","incendios"],
  ["Ciberseguridad y protección de datos","ciberseguridad"],
  ["Seguridad residencial y comercial","seguridad-propiedades"],
  ["Monitoreo remoto y gestión de alarmas","monitoreo-remoto"],
  ["Consultoría en seguridad y análisis de riesgos","consultoria-seguridad"]
];

const productos = [
  ["Kit CCTV 8 cámaras 4K","kit-cctv-8-4k","NVR PoE, 4K, visión nocturna",1999,"videovigilancia"],
  ["Control de acceso biométrico ZK","control-biometrico-zk","Huella, tarjeta y PIN",450,"control-acceso"],
  ["Central de alarmas híbrida","central-alarmas-hibrida","Cableado/inalámbrico",899,"alarmas"],
  ["Barrera perimetral IR 100m","barrera-perimetral-ir","Doble haz, 100m",620,"seguridad-perimetral"],
  ["DVR móvil para flotas","dvr-movil-flotas","GPS/4G, antivibración",750,"seguridad-transporte"],
  ["Cámara PTZ bancaria 25x","camara-ptz-bancaria","WDR extremo",1290,"seguridad-bancaria"],
  ["Terminal facial con mascarilla","terminal-facial","Anti-spoofing",980,"biometria"],
  ["Detector de humo direccionable","detector-humo","EN54",85,"incendios"],
  ["Firewall UTM SMB","firewall-utm-smb","IPS/AV/VPN",1200,"ciberseguridad"],
  ["Kit alarma residencial","kit-alarma-residencial","App móvil",399,"seguridad-propiedades"],
  ["Panel de monitoreo NOC","panel-monitoreo-noc","Dashboard multisede",2200,"monitoreo-remoto"],
  ["Consultoría integral","consultoria-integral","Evaluación de riesgos",3500,"consultoria-seguridad"]
];

(async ()=>{
  await connectDB();
  await Promise.all([Categoria.deleteMany({}), Producto.deleteMany({}), Persona.deleteMany({ email:/@sego\.test$/ })]);
  const catDocs = await Categoria.insertMany(categorias.map(([nombre,slug])=>({nombre,slug,descripcion:nombre})));
  const slug2id = Object.fromEntries(catDocs.map(c=>[c.slug,c._id]));
  await Producto.insertMany(productos.map(([nombre,slug,descripcion,precio,cat])=>({nombre,slug,descripcion,precio,stock:50,categoria:slug2id[cat]})));
  await Persona.create({ nombre:'Admin', email:'admin@sego.test', password:'Admin123!', rol:'admin' });
  await Persona.create({ nombre:'Cliente', email:'cliente@sego.test', password:'Cliente123!', rol:'customer' });
  console.log('✅ Seed OK');
  await mongoose.connection.close();
})().catch(e=>{ console.error(e); process.exit(1); });
