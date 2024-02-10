const Apartado = require('../models/Apartado');

function convertirCOTaUTC(fechaLocal) {
  const fecha = new Date(fechaLocal);

  fecha.setHours(fecha.getHours() + 5);

  const fechaUTC = fecha.toISOString().split('.')[0] + "Z";
  return fechaUTC;
}

// Crear una nueva apartado
exports.crearApartado = async (req, res) => {
  try {
    const nuevoApartado = new Apartado(req.body);
    const apartadoGuardado = await nuevoApartado.save();
    res.status(201).json(apartadoGuardado);
  } catch (error) {
    console.log(error)
    res.status(400).json({ mensaje: error.message });
  }
};

// Obtener un apartado por ID
exports.obtenerApartado = async (req, res) => {
    try {
      const { id } = req.params;
      const apartado = await Apartado.findById(id).populate('items.producto');
      if (!apartado) {
          res.status(404).json({ mensaje: 'Apartado no encontrado' });
      } else {
          res.status(200).json(apartado);
      }
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  };

// Actualizar un apartado
exports.actualizarApartado = async (req, res) => {
    try {
      const { id } = req.params;
      const apartadoActualizada = await Apartado.findByIdAndUpdate(id, req.body, { new: true });
      if (!apartadoActualizada) res.status(404).json({ mensaje: 'Apartado no encontrado' });
      res.status(200).json(apartadoActualizada);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  };
  
  // Eliminar un apartado
  exports.eliminarApartado = async (req, res) => {
    try {
      const { id } = req.params;
      const apartadoEliminado = await Apartado.findByIdAndDelete(id);
      if (!apartadoEliminado) res.status(404).json({ mensaje: 'Apartado no encontrado' });
      res.status(200).json({ mensaje: 'Apartado eliminado' });
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  };

  // Obtener apartados con límite especificado en la consulta
  exports.obtenerApartadoLimitados = async (req, res) => {
    try {
      // Obtener el límite de la solicitud y aplicar un límite máximo de 100
      let limite = parseInt(req.query.limite) || 10;
      limite = Math.min(limite, 100); // Asegura que el límite no exceda 100

      // const apartados = await Apartado.find().limit(limite);
      const apartados = await Apartado.find().sort({fechaApartado: -1}).limit(limite);

      res.status(200).json(apartados);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  };

  // Obtener gastos con limite por id, nombre, documento, fecha
exports.buscarApartadosLimitados = async (req, res) => {
  try {
    const { id, nombre, docIdentidad, fechaInicio, fechaFin } = req.query;
    let query = {};

    if (nombre) {
      query['cliente.nombre'] = new RegExp(nombre, 'i');
    } else if (docIdentidad) {
      query['cliente.docIdentidad'] = new RegExp(docIdentidad, 'i');
    }else if (id){
      query._id = id ;
    } else if (fechaInicio && fechaFin) {
      const fechaInicioUTC = new Date(convertirCOTaUTC(fechaInicio));
      const fechaFinUTC = new Date(convertirCOTaUTC(fechaFin));

      query.fechaApartado = {
          $gte: fechaInicioUTC,
          $lte: fechaFinUTC
        }
    }

    const apartados = await Apartado.find(query).sort({fecha: -1}).limit(50);
    res.json(apartados);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
