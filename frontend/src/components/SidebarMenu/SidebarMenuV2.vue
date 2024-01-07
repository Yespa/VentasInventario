<template>

  <div class="d-flex">
    <div id="sidebar-container" class="bg-primary">
      <div class="logo">
          <h4>LOGO</h4>
      </div>

      <div class="menu">
        <a href=""><i class="fa-solid fa-chart-line"></i> Dashboard</a>
        <a href=""><i class="fas fa-shopping-cart"></i> Ventas</a>
        <a href=""><i class="fa-solid fa-boxes-stacked"></i> Inventario</a>
        <a href=""><i class="fa-solid fa-file-invoice-dollar"></i> Facturas</a>
        <a href=""><i class="fa-solid fa-users"></i> Clientes</a>
        <a href=""><i class="fa-solid fa-right-from-bracket"></i> Salir</a>
      </div>
    </div>
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

#sidebar-container {
  min-height: 100vh;
}

</style>