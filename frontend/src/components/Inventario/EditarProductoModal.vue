<template>
    <div class="modal-backdrop" v-if="isVisible">
      <div class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar Producto</h5>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="nombreProducto">Nombre</label>
                <input type="text" class="form-control" id="nombreProducto" v-model="productoEditado.nombre">
                <span v-if="errores.nombre" class="text-danger">{{ errores.nombre }}</span>
              </div>
              <div class="form-group">
                <label for="descripcionProducto">Descripción</label>
                <input type="text" class="form-control" id="descripcionProducto" v-model="productoEditado.descripcion">
              </div>
              <div class="form-group">
                <label for="tipoProducto">Tipo de producto</label>
                <input type="text" class="form-control" id="tipoProducto" v-model="productoEditado.tipo_producto">
                <span v-if="errores.tipo_producto" class="text-danger">{{ errores.tipo_producto }}</span>
              </div>
              <div class="form-group">
                <label for="cantidadProducto">Cantidad</label>
                <input type="number" class="form-control" id="cantidadProducto" v-model="productoEditado.cantidad">
                <span v-if="errores.cantidad" class="text-danger">{{ errores.cantidad }}</span>
              </div>
              <div class="form-group">
                <label for="precioInventarioProducto">Precio de inventario</label>
                <input type="number" class="form-control" id="precioInventarioProducto" v-model="productoEditado.precio_inventario">
                <span v-if="errores.precio_inventario" class="text-danger">{{ errores.precio_inventario }}</span>
              </div>
              <div class="form-group">
                <label for="precioSugeridoProducto">Precio sugerido</label>
                <input type="number" class="form-control" id="precioSugeridoProducto" v-model="productoEditado.precio_sugerido">
                <span v-if="errores.precio_sugerido" class="text-danger">{{ errores.precio_sugerido }}</span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cerrar</button>
              <button type="button" class="btn btn-primary" @click="submitForm">Guardar Cambios</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['producto'],
    data() {
      return {
        isVisible: false,
        errores: {}
      };
    },
    methods: {
        openModal(producto) {
            this.isVisible = true;
            this.productoEditado = { ...producto };
        },
        closeModal() {
            this.isVisible = false;
            this.errores = {};
        },
        validarFormulario() {
            this.errores = {};

            if (!this.productoEditado.nombre ) {
                this.errores.nombre = "El nombre del producto es obligatorio.";
            }
            if (!this.productoEditado.tipo_producto) {
                this.errores.tipo_producto = "El tipo de producto es obligatorio.";
            }
            if (!this.productoEditado.cantidad) {
                this.errores.cantidad = "La cantidad debe llevar al menos un valor.";
            }
            if (!this.productoEditado.precio_inventario) {
                this.errores.precio_inventario = "El precio de inventario debe llevar al menos un valor..";
            }
            if (!this.productoEditado.precio_sugerido) {
                this.errores.precio_sugerido = "El precio de sugerido debe llevar al menos un valor.";
            }

            return Object.keys(this.errores).length === 0;
        },
        async submitForm() {
            console.log(this.productoEditado);
            if (!this.validarFormulario()) {
                return; // Detener si la validación falla
            }
            try {
                const response = await fetch(`http://localhost:3000/api/productos/${this.productoEditado._id}`, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.productoEditado)
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el producto');
                }

                const responseData = await response.json();
                console.log('Producto actualizado:', responseData);

                this.$emit('actualizarLista');
                this.closeModal();
            } catch (error) {
                console.error('Error:', error);
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
  
  