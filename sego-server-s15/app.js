require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { initSocket } = require('./utils/socket');

const seguridadRoutes = require('./routes/seguridad.routes');
const productoRoutes = require('./routes/producto.routes');
const carritoRoutes = require('./routes/carrito.routes');
const notificacionRoutes = require('./routes/notificacion.routes');
const ordenRoutesFactory = require('./routes/orden.routes');

const app = express();
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGIN||'http://localhost:3002').split(','), credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req,res)=> res.json({ ok:true, name:'SEGO', time:new Date().toISOString() }));

app.use('/api/v1/seguridad', seguridadRoutes);
app.use('/api/v1/producto', productoRoutes);
app.use('/api/v1/carrito', carritoRoutes);
app.use('/api/v1/notificacion', notificacionRoutes);

const server = http.createServer(app);
const io = initSocket(server, process.env.CORS_ORIGIN);
app.use('/api/v1/orden', ordenRoutesFactory(io));

const PORT = process.env.PORT || 4002;
connectDB().then(()=>{
  server.listen(PORT, ()=> console.log(`🚀 SEGO servidor en http://localhost:${PORT}`));
});
