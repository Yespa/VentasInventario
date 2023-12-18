const Producto = require('../models/producto');

// Agregar un producto
exports.agregarProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
    console.log('Producto agregado');
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Obtener un producto por ID
exports.obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id);
    if (!producto) {
        res.status(404).json({ mensaje: 'Producto no encontrado' });
    } else {
        res.status(200).json(producto);
    }
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar un producto
exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndDelete(id);
    if (!productoEliminado) res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.status(200).json(productoEliminado);
    console.log('Producto eliminado');
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar un producto
exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoActualizado = await Producto.findByIdAndUpdate(id, req.body, { new: true });
    if (!productoActualizado) res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.status(200).json(productoActualizado);
    console.log('Producto actualizado');
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener productos con límite especificado en la consulta
exports.obtenerProductosLimitados = async (req, res) => {
  try {
    // Obtener el límite de la solicitud y aplicar un límite máximo de 20
    let limite = parseInt(req.query.limite) || 10;
    limite = Math.min(limite, 20); // Asegura que el límite no exceda 20

    const productos = await Producto.find().limit(limite);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
