const Gasto = require('../models/gasto');

function convertirCOTaUTC(fechaLocal) {
  const fecha = new Date(fechaLocal);

  fecha.setHours(fecha.getHours() + 5);

  const fechaUTC = fecha.toISOString().split('.')[0] + "Z";
  return fechaUTC;
}

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
    // Obtener el límite de la solicitud y aplicar un límite máximo de 100
    let limite = parseInt(req.query.limite) || 10;
    limite = Math.min(limite, 100); // Asegura que el límite no exceda 100

    // const gastos = await Gasto.find().limit(limite);
    const gastos = await Gasto.find().sort({fecha: -1}).limit(limite);

    res.status(200).json(gastos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener gastos con limite por nombre o codigo
exports.buscarGastosLimitados = async (req, res) => {
  try {
    const { nombre, codigo, fechaInicio, fechaFin } = req.query;
    let query = {};

    if (nombre) {
      query.nombre = new RegExp(nombre, 'i');
    } else if (codigo) {
      const regex = new RegExp("^" + codigo);
      query.codigo = { $regex: regex };
    } else if (fechaInicio && fechaFin) {
      const fechaInicioUTC = new Date(convertirCOTaUTC(fechaInicio));
      const fechaFinUTC = new Date(convertirCOTaUTC(fechaFin));

      query.fecha = {
          $gte: fechaInicioUTC,
          $lte: fechaFinUTC
        }
    }

    const gastos = await Gasto.find(query).sort({fecha: -1}).limit(50);
    res.json(gastos);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
