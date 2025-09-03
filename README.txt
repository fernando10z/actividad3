SEGO - E-commerce de Seguridad Electrónica (Cliente/Servidor estilo Sesión 15) - Con módulo de Sockets + Logística + Pago QR (simulado)

Contenido:
- sego-server-s15/: API + Socket.IO + MongoDB
- sego-client-s15/: Cliente estático con HTML/JS + Socket.IO

Instalación:
1) Servidor
   cd sego-server-s15
   cp .env.example .env
   npm install
   npm run seed
   npm run dev
2) Cliente
   cd sego-client-s15
   npm install
   npm start

Credenciales demo:
- admin@sego.test / Admin123!
- cliente@sego.test / Cliente123!

Rutas clave:
- /api/v1/seguridad (POST /registrar, /login)
- /api/v1/producto (GET /?q=&cat=, GET /:slug, POST /) [admin]
- /api/v1/carrito (GET, POST /items, DELETE /items/:productoId)
- /api/v1/orden (POST, GET /mias, PUT /:id/estado [admin], POST /:id/pagar)
- /api/v1/notificacion (POST /enviar, POST /mensaje) [admin]

Eventos Socket.IO:
- Cliente → Server: matricular, mensajeSimple, logistica:pedido-leido
- Server → Cliente: matriculado, notificacion, mensajeSimple, nuevaOrden, ordenActualizada, logistica:nuevo-pedido, pedido-actualizado, pago-confirmado, logistica:pedido-pagado

Módulo 1: Pedido - Notificación a Logística
- Al crear una orden (POST /api/v1/orden), el backend:
  - Genera nroPedido (ej. ORD-<base36>).
  - Guarda en MongoDB con estadoNotificacion='no leído' y estadoPago='pendiente'.
  - Emite socket 'logistica:nuevo-pedido' con { id, nroPedido, cliente, fecha, montoTotal, estadoNotificacion }.
- Logística abre /logistica.html, recibe el evento y puede marcar como leído:
  - Emite 'logistica:pedido-leido' con { ordenId, operador }.
  - El servidor actualiza MongoDB a 'leído' y emite 'pedido-actualizado'.

Módulo 2: Ventas - Confirmación de Pago vía QR (simulado)
- En /carrito.html el usuario genera pedido → se muestra un QR simulado.
- El pago se simula consumiendo POST /api/v1/orden/:id/pagar.
- El servidor marca la orden como pagada y emite 'pago-confirmado' al cliente (socket).
- Además, difunde 'logistica:pedido-pagado' para el panel de logística.

Esquema Mongo relevante (Orden):
- nroPedido: String (único)
- estadoNotificacion: 'no leído' | 'leído'
- estadoPago: 'pendiente' | 'pagado'
- pago: { proveedor, ref, pagadoEn }
- leidaPor, leidaEn

Pruebas manuales sugeridas:
1) Login como cliente (login.html con cliente@sego.test / Cliente123!).
2) Agregar productos → Carrito → "Generar pedido".
3) Abrir /logistica.html para ver 'logistica:nuevo-pedido' en tiempo real.
4) En Logística, "Marcar leído" → cambia a 'leído' (socket 'pedido-actualizado').
5) En Carrito, "He pagado" → POST /pagar → cliente recibe 'pago-confirmado' y Logística 'pedido-pagado'.

Seguridad:
- JWT + middleware requireAuth. Validación de dueño al pagar.
- CORS limitado por variable CORS_ORIGIN.

Notas:
- Servicio autónomo dentro del mismo servidor SEGO, con controladores y eventos claros (on/emit).
- Se muestra un ejemplo paso a paso en Postman listo para importar (registro → login → crear pedido → logística lo marca leído → cliente paga vía endpoint → socket confirma) para que veas cómo se valida el token y se actualiza en Mongo