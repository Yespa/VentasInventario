const Factura = require('../models/Factura');

// Crear una nueva factura
exports.crearFactura = async (req, res) => {
  try {
    const nuevaFactura = new Factura(req.body);
    const facturaGuardada = await nuevaFactura.save();
    res.status(201).json(facturaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Obtener una factura por ID
exports.obtenerFactura = async (req, res) => {
    try {
      const { id } = req.params;
      const factura = await Factura.findById(id).populate('items.producto');
      if (!factura) {
          res.status(404).json({ mensaje: 'Factura no encontrada' });
      } else {
          res.status(200).json(factura);
      }
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  };

// Actualizar una factura
exports.actualizarFactura = async (req, res) => {
    try {
      const { id } = req.params;
      const facturaActualizada = await Factura.findByIdAndUpdate(id, req.body, { new: true });
      if (!facturaActualizada) res.status(404).json({ mensaje: 'Factura no encontrada' });
      res.status(200).json(facturaActualizada);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  };
  
  // Eliminar una factura
  exports.eliminarFactura = async (req, res) => {
    try {
      const { id } = req.params;
      const facturaEliminada = await Factura.findByIdAndDelete(id);
      if (!facturaEliminada) res.status(404).json({ mensaje: 'Factura no encontrada' });
      res.status(200).json({ mensaje: 'Factura eliminada' });
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  };
