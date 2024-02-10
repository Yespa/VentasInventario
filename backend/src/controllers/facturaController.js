const Factura = require('../models/Factura');

function convertirCOTaUTC(fechaLocal) {
  const fecha = new Date(fechaLocal);

  fecha.setHours(fecha.getHours() + 5);

  const fechaUTC = fecha.toISOString().split('.')[0] + "Z";
  return fechaUTC;
}


// Crear una nueva factura
exports.crearFactura = async (req, res) => {
  try {
    const nuevaFactura = new Factura(req.body);
    const facturaGuardada = await nuevaFactura.save();
    res.status(201).json(facturaGuardada);
  } catch (error) {
    console.log(error)
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

  // Obtener facturas con límite especificado en la consulta
  exports.obtenerFacturasLimitados = async (req, res) => {
    try {
      // Obtener el límite de la solicitud y aplicar un límite máximo de 100
      let limite = parseInt(req.query.limite) || 10;
      limite = Math.min(limite, 100); // Asegura que el límite no exceda 100

      // const facturas = await Factura.find().limit(limite);
      const facturas = await Factura.find().sort({fechaVenta: -1}).limit(limite);

      res.status(200).json(facturas);
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  };

  // Obtener facturas con limite por id y fecha
  exports.buscarFacturasLimitados = async (req, res) => {
    try {
      const { id, fechaInicio, fechaFin } = req.query;
      let query = {};

      if (id){
        query._id = id ;
      } else if (fechaInicio && fechaFin) {
        const fechaInicioUTC = new Date(convertirCOTaUTC(fechaInicio));
        const fechaFinUTC = new Date(convertirCOTaUTC(fechaFin));
  
        query.fechaVenta = {
            $gte: fechaInicioUTC,
            $lte: fechaFinUTC
          }
      }
  
      const fechas = await Factura.find(query).sort({fecha: -1}).limit(50);
      res.json(fechas);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
