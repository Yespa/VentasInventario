<template>
  <div class="modal-backdrop" v-if="isVisible">
    <div class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Agregar Nuevo Producto</h5>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="nombreProducto">Nombre</label>
              <input type="text" class="form-control" id="nombreProducto" v-model="nuevoProducto.nombre">
              <span v-if="errores.nombre" class="text-danger">{{ errores.nombre }}</span>
            </div>
            <div class="form-group">
              <label for="descripcionProducto">Descripción</label>
              <input type="text" class="form-control" id="descripcionProducto" v-model="nuevoProducto.descripcion">
            </div>
            <div class="form-group">
              <label for="tipoProducto">Tipo de producto</label>
              <input type="text" class="form-control" id="tipoProducto" v-model="nuevoProducto.tipo_producto">
              <span v-if="errores.tipo_producto" class="text-danger">{{ errores.tipo_producto }}</span>
            </div>
            <div class="form-group">
              <label for="cantidadProducto">Cantidad</label>
              <input type="number" class="form-control" id="cantidadProducto" v-model="nuevoProducto.cantidad">
              <span v-if="errores.cantidad" class="text-danger">{{ errores.cantidad }}</span>
            </div>
            <div class="form-group">
              <label for="precioInventarioProducto">Precio inventario</label>
              <input type="number" class="form-control" id="precioInventarioProducto" v-model="nuevoProducto.precio_inventario">
              <span v-if="errores.precio_inventario" class="text-danger">{{ errores.precio_inventario }}</span>
            </div>
            <div class="form-group">
              <label for="precioSugeridoProducto">Precio sugerido</label>
              <input type="number" class="form-control" id="precioSugeridoProducto" v-model="nuevoProducto.precio_sugerido">
              <span v-if="errores.precio_sugerido" class="text-danger">{{ errores.precio_sugerido }}</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cerrar</button>
            <button type="button" class="btn btn-primary" @click="submitForm">Agregar Producto</button>
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
        nuevoProducto: {
          nombre: '',
          descripcion: '',
          tipo_producto: '',
          cantidad: 0,
          precio_inventario: 0,
          precio_sugerido: 0,
        },
        errores: {}
      };
    },
    methods: {
        openModal() {
            this.isVisible = true;
        },
        closeModal() {
            this.isVisible = false;
            this.errores = {};
        },
        validarFormulario() {
            this.errores = {};

            if (!this.nuevoProducto.nombre ) {
                this.errores.nombre = "El nombre del producto es obligatorio.";
            }
            if (!this.nuevoProducto.tipo_producto) {
                this.errores.tipo_producto = "El tipo de producto es obligatorio.";
            }
            if (this.nuevoProducto.cantidad === '') {
                this.errores.cantidad = "La cantidad debe llevar al menos un valor.";
            }
            if (this.nuevoProducto.precio_inventario === '') {
                this.errores.precio_inventario = "El precio de inventario debe llevar al menos un valor..";
            }
            if (this.nuevoProducto.precio_sugerido === '') {
                this.errores.precio_sugerido = "El precio de sugerido debe llevar al menos un valor.";
            }

            return Object.keys(this.errores).length === 0;
        },
      async submitForm() {
        console.log(this.nuevoProducto);
        if (!this.validarFormulario()) {
            return; // Detener si la validación falla
        }
        try {
          const response = await fetch('http://localhost:3000/api/productos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.nuevoProducto)
          });
  
          if (!response.ok) {
            throw new Error('Error al agregar el producto');
          }
  
          // Opcional: Manejar la respuesta
          console.log('Producto agregado');
          this.closeModal();
          this.$emit('productoAgregado');
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
  
  