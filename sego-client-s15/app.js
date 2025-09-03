const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname,'public')));
const PORT = process.env.PORT || 3002;
app.listen(PORT, ()=> console.log(`🌐 SEGO cliente en http://localhost:${PORT}`));
