<template>
  <button @click="toggleSidebar" class="btn btn-primary d-lg-none">☰</button>

  <div class="d-flex flex-column flex-shrink-0 p-3 bg-light w-100 h-100"
       :class="{ 'd-none': !isSidebarVisible, 'd-lg-block': true }">

    <router-link to="/ventas"><img src="/img/logo_horizontal.png" class="mb-3 align-self-center img-fluid"></router-link>
    <div class="border-top my-3"></div>
    
    <!-- Contenido existente de la barra lateral -->
    <ul class="nav nav-pills flex-column mb-auto">
      <li><router-link to="/dashboard" class="nav-link"><i class="fa-solid fa-chart-line"></i> <span class="menu-text"> Dashboard</span></router-link></li>
      <li><router-link to="/ventas" class="nav-link"><i class="fas fa-shopping-cart"></i> <span class="menu-text"> Ventas</span></router-link></li>
      <li><router-link to="/inventario" class="nav-link"><i class="fa-solid fa-boxes-stacked"></i> <span class="menu-text"> Inventario</span></router-link></li>
      <li><a href="#" class="nav-link"><i class="fa-solid fa-file-invoice-dollar"></i> <span class="menu-text"> Facturas</span></a></li>
      <li><a href="#" class="nav-link"><i class="fa-solid fa-users"></i> <span class="menu-text"> Clientes</span></a></li>

      <div class="border-top my-3"></div>      
      <li><a href="#" class="nav-link"><i class="fa-solid fa-right-from-bracket"></i> <span class="menu-text"> Salir</span></a></li>
    </ul>

  </div>
</template>


<script>
  export default {
    data() {
      return {
        isSidebarVisible: false,
      };
    },
    methods: {
      toggleSidebar() {
        this.isSidebarVisible = !this.isSidebarVisible;
      },
    },
  };
</script>


<style>

  .nav-link, .menu-text {
    /* Cambia la familia de fuente, tamaño, etc. */
    font-family: 'Poppins', sans-serif; /* Ejemplo de familia de fuente */
    font-size: 1rem; /* Ejemplo de tamaño de fuente */
    color: #000000; /* Cambia el color de la letra */
  }

  .fa-solid, .fas {
    color: #000000; /* Color negro */
  }

  img {
    max-width: 30%; /* O el porcentaje que prefieras */
    height: auto;
  }

  /* Estilo para la barra lateral */
  .d-flex {
    display: flex; /* Establece el contenedor para usar Flexbox */
    flex-direction: column; /* Los hijos se apilan verticalmente */
    align-items: center; /* Centra los hijos horizontalmente */
    justify-content: flex-start; /* Alinea los hijos al inicio del contenedor */
    background-color: #007bff;
    border-radius: 30px;
    padding: 90px 0; /* Ajusta el padding para ser simétrico verticalmente */
    height: 100vh;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: box-shadow 0.3s;
  }

  /* Estilo para resaltar las opciones al pasar el puntero */
  .nav-link {
    transition: background-color 0.3s, color 0.3s; /* Transición suave para el color de fondo y texto */
  }

  .nav-link:hover {
    background-color: #b2c2d2; /* Cambiar el color de fondo al pasar el puntero */
    color: #007bff; /* Cambiar el color del texto al pasar el puntero */
  }

  @media (max-width: 991.98px) {
    .menu-text {
      display: none; /* Oculta el texto en pantallas pequeñas */
    }

    .nav-link {
      justify-content: center; /* Centra los íconos en la barra lateral */
    }

    .fa-solid {
      margin-right: 0; /* Elimina el margen derecho del ícono */
    }
  }

</style>