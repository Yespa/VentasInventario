<template>
    <div class="container-fluid">

        <div class="row" style="background-color: silver;">
            <div class="col">
                header
            </div>
        </div>

        <div class="row">
            <div class="col-2">
                <sidebar-menu/>
            </div>
        <div class="col">
          <div class="row" style="background-color: rgb(88, 98, 80);">
            <div class="col">
                <h1>Datos Obtenidos</h1>
            </div>
          </div>
          <div class="row" style="background-color: rgb(101, 141, 210);">
            <div class="col">
                <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                    <div>
                        <table class="table" v-if="productos && productos.length">
                            <thead>
                                <tr>
                                <!-- Cabeceras de la tabla -->
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Tipo de producto</th>
                                <th>Cantidad</th>
                                <th>Precio inventario</th>
                                <th>Precio sugerido</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="producto in productos" :key="producto._id">
                                <!-- Datos de la tabla -->
                                <td>{{ producto._id }}</td>
                                <td>{{ producto.nombre }}</td>
                                <td>{{ producto.descripcion }}</td>
                                <td>{{ producto.tipo_producto }}</td>
                                <td>{{ producto.cantidad }}</td>
                                <td>{{ producto.precio_inventario }}</td>
                                <td>{{ producto.precio_sugerido }}</td>
                                <td>
                                    <button class="btn btn-primary" @click="mostrarModalEditar(producto)">Editar</button>
                                    <button class="btn btn-danger" @click="eliminarProducto(producto._id)">Eliminar</button>
                                </td>
                                </tr>
                            </tbody>
                        </table>
                        <editar-producto-modal ref="modalEditarProducto" :producto="productoSeleccionado" @actualizarLista="obtenerProductos"></editar-producto-modal>
                        <agregar-producto-modal ref="modalAgregarProducto" @productoAgregado="obtenerProductos"></agregar-producto-modal>
                        <div v-if="error">
                            <p>Error: {{ error }}</p>
                        </div>
                        </div>
                </main>
            </div>
          </div>
          <div class="row" style="background-color: rgb(101, 43, 158);">
            <div class="col">
                <button class="btn btn-success"  @click="mostrarFormularioAgregar">Agregar Producto</button>
            </div>
          </div>
        </div>

        <div class="row" style="background-color: silver;">
            <div class="col">
                footer
            </div>
        </div>
      </div>

    </div>
  </template>


  
<script>
    import SidebarMenu from '../SidebarMenu/SidebarMenuV2.vue';
    import EditarProductoModal from './EditarProductoModal.vue';
    import AgregarProductoModal from './AgregarProductoModal.vue';

    export default {
        components: {
            EditarProductoModal,
            AgregarProductoModal,
            SidebarMenu
        },
        data() {
            return {
            productos: null,
            productoSeleccionado: null,
            error: null
            };
        },
        methods: {
            mostrarModalEditar(producto) {
                this.productoSeleccionado = producto;
                this.$refs.modalEditarProducto.openModal(producto);
            },
            mostrarFormularioAgregar() {
                this.$refs.modalAgregarProducto.openModal();
            },
            async obtenerProductos() {
                try {
                    const respuesta = await fetch("http://localhost:3000/api/productos/all?limite=15");
                    if (!respuesta.ok) {
                    throw new Error(`HTTP error! status: ${respuesta.status}`);
                    }
                    const data = await respuesta.json();
                    this.productos = data;
                } catch (error) {
                    this.error = error.message;
                    console.log(error);
                }
            },
            async eliminarProducto(id) {
                if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                    try {
                        const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
                            method: 'DELETE'
                        });

                        if (!response.ok) {
                            throw new Error('Error al eliminar el producto');
                        }

                        console.log('Producto eliminado');
                        this.obtenerProductos();
                    } catch (error) {
                    console.error('Error:', error);
                    }
                }
            },
        },
        mounted() {
            this.obtenerProductos();
        }
    };
</script>
