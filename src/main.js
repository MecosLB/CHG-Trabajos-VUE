import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

/* Bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

/* Animate CSS */
import 'animate.css';

/* Main */
import './css/main.css';

/* Auth */
import './css/auth/login.css';
import './css/auth/layout.css';

/* Dashboard */
import './css/dashboard/home.css';
import './css/dashboard/navbar.css';


createApp(App).use(store).use(router).mount('#app');