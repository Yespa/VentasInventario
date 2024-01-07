<template>
    <div class="modal-backdrop" v-if="isVisible">
      <div class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Venta al Contado</h5>
            </div>
            <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
              <p><strong>Nombre del Cliente:</strong> {{ clienteSeleccionado.nombre }}</p>

              <!-- Botón para mostrar/ocultar productos -->
              <button class="btn btn-link" @click="mostrarProductos = !mostrarProductos">
                {{ mostrarProductos ? 'Ocultar Productos' : 'Mostrar Productos' }}
              </button>

              <!-- Sección plegable para los productos -->
              <div v-if="mostrarProductos">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(producto, index) in productosSeleccionados" :key="index">
                      <td>{{ producto.nombre }}</td>
                      <td>{{ producto.cantidad }}</td>
                      <td>{{ (producto.precio_total)}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p class="text-right"><strong>Total a pagar:</strong> {{ (totalFactura) }}</p>
            </div>

            <!-- Método de Pago -->
            <div class="form-group">
                <label for="metodoPago">Método de Pago</label>
                <select class="form-control" id="metodoPago" v-model="metodoPago">
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="mixto">Mixto</option>
                </select>
            </div>

            <!-- Opciones de Transferencia -->
            <div class="form-group" v-if="metodoPago === 'transferencia'">
                <label for="tipoTransferencia">Tipo de Transferencia</label>
                <select class="form-control" id="tipoTransferencia" v-model="tipoTransferencia">
                    <option value="bancolombia">Bancolombia</option>
                    <option value="nequi">Nequi</option>
                </select>
                <label for="montoRecibido">Monto recibido</label>
                <input type="number" class="form-control" id="montoRecibido" v-model="cantidadRecibidaTransferencia">
   
            </div>

            <!-- Opciones de Mixto -->
            <div class="form-group" v-if="metodoPago === 'mixto'">
                <label for="tipoTransferencia">Tipo de Transferencia</label>
                <select class="form-control" id="tipoTransferencia" v-model="tipoTransferencia">
                    <option value="bancolombia">Bancolombia</option>
                    <option value="nequi">Nequi</option>
                </select>

                <!-- Fila para Montos Recibidos -->
                <div class="row">
                    <!-- Columna para Monto Recibido en Transferencia -->
                    <div class="col-md-6">
                    <label for="montoRecibidoTransferencia">Monto recibido en transferencia</label>
                    <input type="number" class="form-control" id="montoRecibidoTransferencia" v-model="cantidadRecibidaTransferencia">
                    </div>

                    <!-- Columna para Monto Recibido en Efectivo -->
                    <div class="col-md-6">
                    <label for="montoRecibidoEfectivo">Monto recibido en efectivo</label>
                    <input type="number" class="form-control" id="montoRecibidoEfectivo" v-model="cantidadRecibidaEfectivo">
                    </div>
                </div>

                <div class="row">
                  <!-- Campo de total pagado -->
                  <div class="col-md-6">
                        <label for="totalPagado">Total pagado</label>
                        <input type="number" class="form-control" id="totalPagado" :value="totalPagado" readonly>
                  </div>

                    <!-- Columna para cantidad restante -->
                  <div class="col-md-6">
                    <label for="restanteTotal">Restante</label>
                    <input type="number" class="form-control" id="restanteTotal" v-model="restanteTotal" readonly>
                  </div>
                </div>

                <!-- Campo de Cambio Devuelto -->
                <div class="form-group">
                    <label for="cambioDevuelto">Cambio a devolver</label>
                    <input type="number" class="form-control" id="cambioDevuelto" :value="cambioDevuelto" readonly>
                </div>
            </div>

            <!-- Monto y Devolución para Efectivo -->
            <div v-if="metodoPago === 'efectivo'">
                <label for="montoRecibido">Monto recibido</label>
                <input type="number" class="form-control" id="montoRecibido" v-model="cantidadRecibidaEfectivo">

                <div class="form-group">
                    <label for="cambioDevuelto">Cambio a devolver</label>
                    <input type="number" class="form-control" id="cambioDevuelto" :value="cambioDevuelto" readonly>
                </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrar">Cerrar</button>
              <button type="button" class="btn btn-primary" @click="finalizarVenta">Finalizar Venta</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    
    props: ['totalFactura', 'clienteSeleccionado', 'productosSeleccionados'],
    data() {
      return {
        isVisible: false,
        mostrarProductos: false,
        metodoPago: 'efectivo',
        tipoTransferencia: 'bancolombia',
        cantidadRecibidaEfectivo: 0,
        cantidadRecibidaTransferencia: 0,
      };
    },
    methods: {
      mostrar() {
        this.isVisible = true;
      },
      cerrar() {
        this.cantidadRecibidaEfectivo = 0;
        this.cantidadRecibidaTransferencia = 0;
        this.isVisible = false;
      },
      finalizarVenta() {
        // Lógica para finalizar la venta
        this.cerrar();
        // Emitir un evento o llamar a un método padre según sea necesario
      }
    },
    computed: {
      totalPagado() {
          const transferencia = parseInt(this.cantidadRecibidaTransferencia) || 0;
          const efectivo = parseInt(this.cantidadRecibidaEfectivo) || 0;
          return  transferencia + efectivo;
      },
      cambioDevuelto() {
          let devueltas = 0
          if (this.totalPagado > this.totalFactura) {
              devueltas = this.totalPagado - this.totalFactura;
          }
          return devueltas
      },
      restanteTotal() {
        let restante = 0
        if (this.totalPagado < this.totalFactura) {
          restante = this.totalPagado - this.totalFactura;
        }
        return restante
      },
    },
    watch: {
      metodoPago(newValue, oldValue) {
          if (newValue !== oldValue) {
              this.cantidadRecibidaTransferencia = 0;
              this.cantidadRecibidaEfectivo = 0;
          }
      }
    },
  };
  </script>

<style scoped>
    .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5); /* Controla la opacidad del fondo */
    }

    .modal.fade.show {
    display: block;
    opacity: 1; /* Asegúrate de que el modal sea completamente opaco */
    }

    .modal {
    transition: opacity 0.3s ease-in-out;
    z-index: 1050; /* Asegúrate de que el modal esté por encima del fondo */
    }

    /* Ajustes adicionales para el modal si es necesario */
    .modal-dialog {
    margin-top: 10vh; /* Ajusta esto según sea necesario para posicionar el modal */
    }

    .close {
    cursor: pointer;
    }
</style>
  