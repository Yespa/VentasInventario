// app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db/mongoose');
const productoRoutes = require('./src/routes/productoRoutes');
const facturaRoutes = require('./src/routes/facturaRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5173/'
}));

// Conectar a la base de datos
connectDB();

// Middleware para parsear el body de tipo JSON
app.use(express.json()); // para parsear body de tipo JSON

// Servir archivos estáticos
app.use(express.static('public'));

// Rutas de la API
app.use('/api', productoRoutes);
app.use('/api', facturaRoutes);
app.use('/api', clienteRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
