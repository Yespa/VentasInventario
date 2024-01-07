import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App);

app.use(router);
app.mount('#app');


