<template>
  <div class="modal-backdrop" v-if="isVisible">
    <div class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Agregar Nuevo Cliente</h5>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="nombreCliente">Nombre</label>
              <input type="text" class="form-control" id="nombreCliente" v-model="nuevoCliente.nombre">
              <span v-if="errores.nombre" class="text-danger">{{ errores.nombre }}</span>
            </div>
            <div class="form-group">
              <label for="documentoIdentidad">Documento identidad</label>
              <input type="number" class="form-control" id="documentoIdentidad" v-model="nuevoCliente.documento_identidad">
              <span v-if="errores.documento_identidad" class="text-danger">{{ errores.documento_identidad }}</span>
            </div>
            <div class="form-group">
              <label for="telefonoCliente">Telefono</label>
              <input type="text" class="form-control" id="telefonoCliente" v-model="nuevoCliente.telefono">
              <span v-if="errores.telefono" class="text-danger">{{ errores.telefono }}</span>
            </div>
            <div class="form-group">
              <label for="direccionCliente">Dirección</label>
              <input type="text" class="form-control" id="direccionCliente" v-model="nuevoCliente.direccion">
              <span v-if="errores.direccion" class="text-danger">{{ errores.direccion }}</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cerrar</button>
            <button type="button" class="btn btn-primary" @click="submitForm">Agregar cliente</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
  export default {
    data() {
      return {
        isVisible: false,
        nuevoCliente: {
          nombre: '',
          telefono: '',
          documento_identidad: 0,
          direccion: '',
        },
        errores: {}
      };
    },
    methods: {
        mostrar() {
            this.isVisible = true;
        },
        closeModal() {
            this.isVisible = false;
            this.errores = {};
        },
        validarFormulario() {
            this.errores = {};

            if (!this.nuevoCliente.nombre ) {
                this.errores.nombre = "El nombre del cliente es obligatorio.";
            }

            if (this.nuevoCliente.documento_identidad === '' || this.nuevoCliente.documento_identidad === 0) {
                this.errores.documento_identidad = "El documento de identidad es obligatorio.";
            }
            if (this.nuevoCliente.telefono === '') {
                this.errores.telefono = "El telefono es obligatorio";
            }

            return Object.keys(this.errores).length === 0;
        },
      async submitForm() {
        console.log(this.nuevoCliente);
        if (!this.validarFormulario()) {
            return; // Detener si la validación falla
        }
        try {
          const response = await fetch('http://localhost:3000/api/clientes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.nuevoCliente)
          });
  
          if (!response.ok) {
            throw new Error('Error al agregar el producto');
          }
  
          // Opcional: Manejar la respuesta
          console.log('Cliente agregado');
          this.closeModal();
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
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
  
  
  