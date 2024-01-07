<template>
    <div class="container mt-4">
        <div class="mb-3">
      <div class="form-check">
        <input class="form-check-input" type="radio" id="mostrador" value="mostrador" v-model="clienteTipo" name="tipoCliente">
        <label class="form-check-label" for="mostrador">Mostrador</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" id="cliente" value="cliente" v-model="clienteTipo" name="tipoCliente">
        <label class="form-check-label" for="cliente">Cliente</label>
      </div>
    </div>

    <div v-if="clienteTipo === 'cliente'" class="card cliente-seleccion">
        <div class="card-body">
            <div class="row">
                <div class="col-md-4">
                    <button @click="mostrarModalNuevoCliente" class="btn btn-success">+</button>
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control" placeholder="Buscar cliente..." v-model="terminoBusquedaCliente" @input="buscarClientesPorNombre">
                    <div v-if="resultadosBusquedaCliente.length" class="menu-desplegable">
                        <ul class="list-group">
                            <li class="list-group-item" v-for="cliente in resultadosBusquedaCliente" :key="cliente._id" @click="seleccionarCliente(cliente)">
                                {{ cliente.nombre }} 
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Información del Cliente -->
    <div v-if="clienteSeleccionado" class="card cliente-info">
        <div class="card-body">
        <h5 class="card-title">Información del Cliente</h5>
        <div class="row">
            <div class="col-md-4">
            <p class="card-text"><strong>Nombre:</strong> {{ clienteSeleccionado.nombre }}</p>
            </div>
            <div class="col-md-4">
            <p class="card-text"><strong>Doc Identidad:</strong> {{ clienteSeleccionado.documento_identidad }}</p>
            </div>
            <div class="col-md-4">
            <p class="card-text"><strong>Teléfono:</strong> {{ clienteSeleccionado.telefono }}</p>
            </div>
        </div>
        </div>
    </div>


    <div class="form-group">
      <input type="text" class="form-control" placeholder="Buscar producto por nombre..." v-model="terminoBusquedaProductos" @input="buscarProductosPorNombre">
    </div>
    <div v-if="resultadosBusquedaProductos.length" class="menu-desplegable">
      <ul class="list-group">
        <li class="list-group-item" v-for="producto in resultadosBusquedaProductos" :key="producto._id" @click="seleccionarProducto(producto)">
          {{ producto.nombre }} - {{ producto.cantidad }} 
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
        <venta-contado ref="modalVentaContado" :totalFactura="totalFactura" :clienteSeleccionado="clienteSeleccionado" :productosSeleccionados="productosSeleccionados"></venta-contado>
        <venta-apartado ref="modalVentaApartado" :totalFactura="totalFactura" :clienteSeleccionado="clienteSeleccionado" :productosSeleccionados="productosSeleccionados"></venta-apartado>
        <agregar-cliente ref="modalAgregarNuevoCliente" ></agregar-cliente>

    </div>
    </div>
  </template>
  
<script>

    import VentaContado from './VentaContado.vue';
    import VentaApartado from './VentaApartado.vue';
    import AgregarCliente from '../Clientes/AgregarCliente.vue'

    export default {
        components: {
            VentaContado,
            VentaApartado,
            AgregarCliente,
        },
        data() {
            return {
                clienteTipo: 'mostrador',
                terminoBusquedaCliente: '',
                clienteSeleccionado: null,
                productosSeleccionados: [],
                terminoBusquedaProductos: '',
                resultadosBusquedaProductos: [],
                resultadosBusquedaCliente: [],
                error: null,
            };
        },
        methods: {
            async obtenerInformacionMostrador() {
                try {
                    const response = await fetch(`http://localhost:3000/api/clientes/65823973a2d6b05b7a147e32`, {
                        method: 'GET',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.productoEditado)
                    });

                    if (!response.ok) {
                        throw new Error('Error al actualizar el producto');
                    }

                    const cliente = await response.json();
                    console.log('Cliente obtenido:', cliente);
                    this.clienteSeleccionado = cliente;
                } catch (error) {
                    console.error('Error:', error);
                }
            },
            prepararSeleccionCliente() {
                this.clienteSeleccionado = null;
                this.terminoBusquedaCliente = '';
            },
            async buscarClientesPorNombre() {
                if (this.terminoBusquedaCliente.trim() === '') {
                    this.resultadosBusquedaCliente = [];
                    return;
                }
                try {
                    const respuesta = await fetch(`http://localhost:3000/api/clientes/buscar?nombre=${this.terminoBusquedaCliente}`);
                    if (!respuesta.ok) {
                    throw new Error(`HTTP error! status: ${respuesta.status}`);
                    }
                    const clientes = await respuesta.json();
                    this.resultadosBusquedaCliente = clientes;
                } catch (error) {
                    this.error = error.message;
                    console.log(error);
                }
            },
            seleccionarCliente(cliente) {
                this.clienteSeleccionado = cliente;
                // Opcionalmente, puedes limpiar la búsqueda o cerrar la lista de resultados
                this.terminoBusquedaCliente = '';
                this.resultadosBusquedaCliente = [];
            },
            async buscarProductosPorNombre() {
                if (this.terminoBusquedaProductos.trim() === '') {
                    this.resultadosBusquedaProductos = [];
                    return;
                }
                try {
                    const respuesta = await fetch(`http://localhost:3000/api/productos/buscar?nombre=${this.terminoBusquedaProductos}`);
                    if (!respuesta.ok) {
                    throw new Error(`HTTP error! status: ${respuesta.status}`);
                    }
                    const productos = await respuesta.json();
                    this.resultadosBusquedaProductos = productos;
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
                this.terminoBusquedaProductos = '';
                this.resultadosBusquedaProductos = [];
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
            mostrarModalNuevoCliente() {
                console.log("MODAL NUEVO CLIENTE");
                this.$refs.modalAgregarNuevoCliente.mostrar();
            },
            cancelarCompra() {
                console.log("Venta cancelada")
                this.clienteTipo = 'mostrador',
                this.obtenerInformacionMostrador();
                this.productosSeleccionados = []
                this.terminoBusquedaProductos = ''
                this.resultadosBusquedaProductos = []
            }
        },
        mounted() {
            this.obtenerInformacionMostrador();
        },
        computed: {
            totalFactura() {
                return this.productosSeleccionados.reduce((acumulador, producto) => {
                return acumulador + (producto.precio_total || 0);
                }, 0);
            }
        },
        watch: {
            clienteTipo(newValue) {
            if (newValue === 'mostrador') {
                this.obtenerInformacionMostrador();
            } else {
                this.prepararSeleccionCliente();
            }
            }
        },
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