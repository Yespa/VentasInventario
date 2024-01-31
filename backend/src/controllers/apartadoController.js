const Apartado = require('../models/Apartado');

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
      // Obtener el límite de la solicitud y aplicar un límite máximo de 20
      let limite = parseInt(req.query.limite) || 10;
      limite = Math.min(limite, 20); // Asegura que el límite no exceda 20

      const apartados = await Apartado.find().limit(limite);
      res.status(200).json(apartados);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  };
