const Gasto = require('../models/gasto');

// Agregar un gasto
exports.agregarGasto = async (req, res) => {
  try {
    const nuevoGasto = new Gasto(req.body);
    const gastoGuardado = await nuevoGasto.save();
    res.status(201).json(gastoGuardado);
    console.log('Gasto agregado');
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Obtener un gasto por ID
exports.obtenerGasto = async (req, res) => {
  try {
    const { id } = req.params;
    const gasto = await Gasto.findById(id);
    if (!gasto) {
        res.status(404).json({ mensaje: 'Gasto no encontrado' });
    } else {
        res.status(200).json(gasto);
    }
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar un gasto
exports.eliminarGasto = async (req, res) => {
  try {
    const { id } = req.params;
    const gastoEliminado = await Gasto.findByIdAndDelete(id);
    if (!gastoEliminado) res.status(404).json({ mensaje: 'Gasto no encontrado' });
    res.status(200).json(gastoEliminado);
    console.log('Gasto eliminado');
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar un gasto
exports.actualizarGasto = async (req, res) => {
  try {
    const { id } = req.params;
    const gastoActualizado = await Gasto.findByIdAndUpdate(id, req.body, { new: true });
    if (!gastoActualizado) res.status(404).json({ mensaje: 'Gasto no encontrado' });
    res.status(200).json(gastoActualizado);
    console.log('Gasto actualizado');
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener gastos con límite especificado en la consulta
exports.obtenerGastosLimitados = async (req, res) => {
  try {
    // Obtener el límite de la solicitud y aplicar un límite máximo de 20
    let limite = parseInt(req.query.limite) || 10;
    limite = Math.min(limite, 20); // Asegura que el límite no exceda 20

    const gastos = await Gasto.find().limit(limite);
    res.status(200).json(gastos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener gastos con limite por nombre
exports.buscarGastosNombreLimitados = async (req, res) => {
  try {
    const nombre = req.query.nombre;
    const gastos = await Gasto.find({ nombre: new RegExp(nombre, 'i') }).limit(5);
    res.json(gastos);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
