<template>
    <div class="container mt-4">
      <!-- Zona de Información del Cliente -->
      <div class="mb-3">
        <h2>Información del Cliente</h2>
        <input type="text" class="form-control mb-2" placeholder="Nombre del Cliente" v-model="cliente.nombre">
        <input type="text" class="form-control mb-2" placeholder="Cédula del Cliente" v-model="cliente.cedula">
        <input type="text" class="form-control" placeholder="Celular del Cliente" v-model="cliente.celular">
      </div>
  
      <!-- Zona de Búsqueda de Productos -->
      <div class="mb-3">
        <h2>Buscar Producto</h2>
        <input type="text" class="form-control" placeholder="Buscar producto...">
        <!-- Aquí podrías agregar un botón para buscar o un evento de teclado para la búsqueda -->
      </div>
  
      <!-- Zona de Lista de Productos Seleccionados -->
      <div class="mb-3">
        <h2>Productos Seleccionados</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio de Venta</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in productosSeleccionados" :key="producto.id">
              <td>{{ producto.nombre }}</td>
              <td>
                <input type="number" class="form-control" v-model="producto.cantidad">
              </td>
              <td>{{ producto.precioVenta }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mb-3">
        <button @click="mostrarModalVentaContado" class="btn btn-success">Contado</button>
        <button @click="mostrarModalVentaApartado" class="btn btn-info">Apartado</button>
        <button @click="cancelarCompra" class="btn btn-danger">Cancelar Compra</button>
        <venta-contado ref="modalVentaContado" :totalVenta="totalVenta"></venta-contado>
        <venta-apartado ref="modalVentaApartado" :totalVenta="totalVenta"></venta-apartado>
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
            totalVenta: 100000,
            cantidadRecibida: 0,
            cambioDevuelto: 0,
            // ... otros datos necesarios ...
            };
        },
        methods: {
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
                console.log("Ventas cancelada")
            }
            // ... otras funciones ...
        },
    // Métodos y lógica de tu componente
    };
</script>
  