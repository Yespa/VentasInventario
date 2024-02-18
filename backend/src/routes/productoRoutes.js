const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');


router.post('/productos', productoController.agregarProducto);
router.post('/productos/procesarVenta', productoController.procesaVenta);
router.get('/productos/all', productoController.obtenerProductosLimitados);
router.get('/productos/buscar', productoController.buscarProductosLimitados);
router.get('/productos/buscar/:codigo', productoController.buscarProductosCodigo);
router.get('/productos/:id', productoController.obtenerProducto);
router.delete('/productos/:id', productoController.eliminarProducto);
router.put('/productos/:id', productoController.actualizarProducto);


module.exports = router;
