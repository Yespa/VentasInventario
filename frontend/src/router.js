import { createRouter, createWebHistory } from 'vue-router';
import ListProductos from './components/Inventario/ListProductos.vue';


const routes = [
    {
      path: '/inventario',
      name: 'Inventario',
      component: ListProductos
    },
    {
      path: '/facturas',
      name: 'Facturas',
      component: ListProductos
    },
    // ... otras rutas ...
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
  
export default router;
