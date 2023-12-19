import { createRouter, createWebHistory } from 'vue-router';
import ListProductos from './components/Inventario/ListProductos.vue';
// import ListFacturas from './components/Facturas/ListFacturas.vue';
import Ventas from './components/Ventas/Ventas.vue';


const routes = [
    {
      path: '/inventario',
      name: 'Inventario',
      component: ListProductos
    },
    {
      path: '/ventas',
      name: 'Ventas',
      component: Ventas
    },
    // ... otras rutas ...
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
  
export default router;
