// src/models/Factura.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  precioVenta: {
    type: Number,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  }
});

const facturaSchema = new mongoose.Schema({
  items: [itemSchema],
  comprador: {
    nombre: String,
    celular: String,
    cedula: String
  },
  fechaCompra: {
    type: Date,
    default: Date.now
  },
  vendedor: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Factura', facturaSchema);
