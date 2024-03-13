import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* Bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

/* Animate CSS */
import 'animate.css';

import './css/main.css';
import './css/auth/login.css';
import './css/auth/layout.css';
import './css/dashboard/companies.css';
import './css/dashboard/candidates.css';

createApp(App).use(store).use(router).mount('#app')