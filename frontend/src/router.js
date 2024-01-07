import { createRouter, createWebHistory } from 'vue-router';
import ListProductos from './components/Inventario/ListProductos.vue';
import Dashboard from './components/Dashboard/Dashboard.vue';
// import ListFacturas from './components/Facturas/ListFacturas.vue';
import Ventas from './components/Ventas/Ventas.vue';


const routes = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
  
export default router;
