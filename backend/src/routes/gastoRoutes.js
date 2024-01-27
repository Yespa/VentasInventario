const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');


router.post('/gastos', gastoController.agregarGasto);
router.get('/gastos/all', gastoController.obtenerGastosLimitados);
router.get('/gastos/buscar', gastoController.buscarGastosNombreLimitados);
router.get('/gastos/:id', gastoController.obtenerGasto);
router.delete('/gastos/:id', gastoController.eliminarGasto);
router.put('/gastos/:id', gastoController.actualizarGasto);


module.exports = router;