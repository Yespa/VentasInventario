<template>
    <div class="modal-backdrop" v-if="isVisible">
      <div class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Venta en Apartado</h5>
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
                        <label for="montoRecibidoTransferencia">Abono transferencia</label>
                        <input type="number" class="form-control" id="montoRecibidoTransferencia" v-model="cantidadRecibidaTransferencia">
                    </div>

                    <!-- Columna para Monto Recibido en Efectivo -->
                    <div class="col-md-6">
                        <label for="montoRecibidoEfectivo">Abono en efectivo</label>
                        <input type="number" class="form-control" id="montoRecibidoEfectivo" v-model="cantidadRecibidaEfectivo">
                    </div>
                </div>      
            </div>

            <!-- Opcion de efectivo -->
            <div class="form-group" v-if="metodoPago === 'efectivo'">
                <label for="cantidadAbonada">Cantidad abonada</label>
                <input type="number" class="form-control" id="cantidadAbonada" v-model="cantidadRecibidaEfectivo">
            </div>


            <!-- Opcion de transferencia -->
            <div class="form-group" v-if="metodoPago === 'transferencia'">
                <label for="tipoTransferencia">Tipo de Transferencia</label>
                <select class="form-control" id="tipoTransferencia" v-model="tipoTransferencia">
                    <option value="bancolombia">Bancolombia</option>
                    <option value="nequi">Nequi</option>
                </select>
                <label for="cantidadAbonada">Cantidad abonada</label>
                <input type="number" class="form-control" id="cantidadAbonada" v-model="cantidadRecibidaTransferencia">
            </div>

            <div class="form-group">
                <label for="cantidadRestante">Cantidad por pagar</label>
                <input type="number" class="form-control" id="cantidadRestante" :value="cantidadRestante" readonly>
            </div>

            <div class="form-group">
                <label for="fechaPago">Fecha de pago</label>
                <input type="date" class="form-control" id="fechaPago" v-model="fechaPago">
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrar">Cerrar</button>
              <button type="button" class="btn btn-primary" @click="finalizarApartado">Finalizar Apartado</button>
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
        cantidadAbonada: 0,
        fechaPago: ''
      };
    },
    methods: {
      mostrar() {
        console.log("Se hace visible")
        this.isVisible = true;
      },
      cerrar() {
        this.cantidadRecibidaEfectivo = 0;
        this.cantidadRecibidaTransferencia = 0;
        this.isVisible = false;
      },
      finalizarApartado() {
        // Lógica para finalizar el apartado
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
        cantidadRestante() {
            let restante = 0
            if (this.totalPagado < this.totalFactura) {
                restante = this.totalFactura - this.totalPagado;
            }
            return restante
        }
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