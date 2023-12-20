<template>
    <div class="container mt-4">
      <!-- Zona de Información del Cliente -->
      <div class="mb-3">
        <h2>Información del Cliente</h2>
        <input type="text" class="form-control mb-2" placeholder="Nombre del Cliente" v-model="cliente.nombre">
        <input type="text" class="form-control mb-2" placeholder="Cédula del Cliente" v-model="cliente.cedula">
        <input type="text" class="form-control" placeholder="Celular del Cliente" v-model="cliente.celular">
      </div>
  
    <div class="form-group">
      <input type="text" class="form-control" placeholder="Buscar producto por nombre..." v-model="terminoBusqueda" @input="buscarProductosPorNombre">
    </div>
    <div v-if="resultadosBusqueda.length" class="menu-desplegable">
      <ul class="list-group">
        <li class="list-group-item" v-for="producto in resultadosBusqueda" :key="producto._id" @click="seleccionarProducto(producto)">
          {{ producto.nombre }} - {{ producto.cantidad }} 
          <!-- Aquí puedes agregar más detalles o un botón para seleccionar el producto -->
        </li>
      </ul>
    </div>
  
      <!-- Zona de Lista de Productos Seleccionados -->
      <div class="mb-3">
        <h2>Productos Seleccionados</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio unidad</th>
                    <th>Precio total</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(producto, index) in productosSeleccionados" :key="producto._id">
                    <td>{{ producto.nombre }}</td>
                    <td>
                        <input type="number" class="form-control" v-model="producto.cantidad" @input="actualizarTotal(index)" min="1">
                    </td>
                    <td>
                        <input type="number" class="form-control" v-model="producto.precio_unitario_venta" min="0" @input="actualizarTotal(index)">
                    </td>
                    <td>
                        <input type="number" class="form-control" id="precioTotal" :value="producto.precio_total" readonly>
                    </td>
                    <td>
                        <button class="btn btn-info" @click="actualizarProductoDefault(index)">Actualizar</button>
                        <button class="btn btn-danger" @click="eliminarProducto(index)">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
        <div class="total-global">
            <h3>Total Factura: {{ totalFactura }}</h3>
        </div>
      <div class="mb-3">
        <button @click="mostrarModalVentaContado" class="btn btn-success">Contado</button>
        <button @click="mostrarModalVentaApartado" class="btn btn-info">Apartado</button>
        <button @click="cancelarCompra" class="btn btn-danger">Cancelar Compra</button>
        <venta-contado ref="modalVentaContado" :totalFactura="totalFactura"></venta-contado>
        <venta-apartado ref="modalVentaApartado" :totalFactura="totalFactura"></venta-apartado>
    </div>
    </div>
  </template>
  
<script>

    import VentaContado from './VentaContado.vue';
    import VentaApartado from './VentaApartado.vue';

    export default {
        components: {
            VentaContado,
            VentaApartado
        },
        data() {
            return {
            cliente: {
                nombre: '',
                cedula: '',
                celular: ''
            },
            productosSeleccionados: [],
            terminoBusqueda: '',
            productos: [],
            resultadosBusqueda: [],
            cantidadRecibida: 0,
            cambioDevuelto: 0,
            error: null,
            // ... otros datos necesarios ...
            };
        },
        methods: {
            async buscarProductosPorNombre() {
                if (this.terminoBusqueda.trim() === '') {
                    this.resultadosBusqueda = [];
                    return;
                }
                try {
                    const respuesta = await fetch(`http://localhost:3000/api/productos/buscar?nombre=${this.terminoBusqueda}`);
                    if (!respuesta.ok) {
                    throw new Error(`HTTP error! status: ${respuesta.status}`);
                    }
                    const productos = await respuesta.json();
                    this.resultadosBusqueda = productos;
                } catch (error) {
                    this.error = error.message;
                    console.log(error);
                }
            },
            seleccionarProducto(productoSeleccionado) {
                const productoExistente = this.productosSeleccionados.find(producto => producto._id === productoSeleccionado._id);
                if (productoExistente) {
                    productoExistente.cantidad++;
                    this.actualizarTotal(this.productosSeleccionados.indexOf(productoExistente));
                } else {
                    this.productosSeleccionados.push({
                        ...productoSeleccionado,
                        cantidad: 1,
                        precio_total: productoSeleccionado.precio_sugerido || 0,
                        precio_unitario_venta: productoSeleccionado.precio_sugerido || 0
                    });
                }

                this.terminoBusqueda = '';
                this.resultadosBusqueda = [];
            },
            actualizarTotal(index) {
                const producto = {...this.productosSeleccionados[index]};
                producto.precio_total = (producto.cantidad * producto.precio_unitario_venta) || 0;
                this.productosSeleccionados.splice(index, 1, producto);
            },
            actualizarProductoDefault(index) {
                const producto = this.productosSeleccionados[index];
                producto.cantidad = 1
                producto.precio_unitario_venta = producto.precio_sugerido
                this.actualizarTotal(index)
            },
            eliminarProducto(index) {
                this.productosSeleccionados.splice(index, 1);
            },
            mostrarModalVentaContado() {
                console.log("MODAL CONTADO");
                this.$refs.modalVentaContado.mostrar();
            },
            mostrarModalVentaApartado() {
                console.log("MODAL APARTADO");
                this.$refs.modalVentaApartado.mostrar();
            },
            cancelarCompra() {
            // Lógica para cancelar la compra
                console.log("Venta cancelada")
            }
            // ... otras funciones ...
        },
        computed: {
            totalFactura() {
                return this.productosSeleccionados.reduce((acumulador, producto) => {
                return acumulador + (producto.precio_total || 0);
                }, 0);
            }
        }
    // Métodos y lógica de tu componente
    };
</script>
  
<style>
    .menu-desplegable {
        position: absolute;
        z-index: 1000; /* Asegúrate de que sea mayor que el z-index de otros elementos */
        width: 100%; /* O el ancho que necesites */
        background-color: white;
        border: 1px solid #ddd; /* Estilo opcional para el borde */
        box-shadow: 0 2px 4px rgba(0,0,0,0.2); /* Sombra opcional para dar efecto elevado */
    }
</style>