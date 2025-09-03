const Producto = require('../models/producto.schema');
const Categoria = require('../models/categoria.schema');

async function listar(req,res){
  const { q, cat } = req.query;
  const filtro = {};
  if(q) filtro.$text = { $search: q };
  if(cat){
    const c = await Categoria.findOne({ slug: cat });
    if(c) filtro.categoria = c._id;
  }
  const items = await Producto.find(filtro).populate('categoria','nombre slug').limit(200);
  res.json(items);
}

async function obtener(req,res){
  const p = await Producto.findOne({ slug:req.params.slug }).populate('categoria','nombre slug');
  if(!p) return res.status(404).json({error:'Producto no encontrado'});
  res.json(p);
}

async function crear(req,res){
  try{
    const { nombre, slug, descripcion, precio, stock, imagenes, specs, categoriaSlug } = req.body;
    const c = await Categoria.findOne({ slug: categoriaSlug });
    if(!c) return res.status(400).json({error:'Categoría inválida'});
    const p = await Producto.create({ nombre, slug, descripcion, precio, stock, imagenes, specs, categoria:c._id });
    res.status(201).json(p);
  }catch(e){ res.status(400).json({error:e.message}); }
}

module.exports = { listar, obtener, crear };
