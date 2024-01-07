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
              Info table
            </div>
          </div>
          <div class="row" style="background-color: rgb(101, 141, 210);">
            <div class="col">
              Table
            </div>
          </div>
          <div class="row" style="background-color: rgb(101, 43, 158);">
            <div class="col">
              Boton table
            </div>
          </div>
        </div>
      </div>
  
      <div class="row" style="background-color: rgb(229, 62, 62);">
        <div class="col">
          footer
        </div>
      </div>
    </div>
</template>

<script>
    import SidebarMenu from '../SidebarMenu/SidebarMenu.vue';

    export default {
        components: {
            SidebarMenu
        },

    };
</script>



