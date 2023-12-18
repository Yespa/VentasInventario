const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');


router.post('/productos', productoController.agregarProducto);
router.get('/productos/all', productoController.obtenerProductosLimitados);
router.get('/productos/:id', productoController.obtenerProducto);
router.delete('/productos/:id', productoController.eliminarProducto);
router.put('/productos/:id', productoController.actualizarProducto);


module.exports = router;
