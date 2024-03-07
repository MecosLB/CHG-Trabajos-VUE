import { createRouter, createWebHashHistory } from 'vue-router';

import dashboardRouter from './dashboard';
import authRouter from './auth';

const routes = [
    {
        path: '/',
        component: () => import(/* webpackChunkName: "Redirect" */ '@/views/Redirect.vue'),
    },
    {
        path: '/:landing',
        name: 'redirect',
        component: () => import(/* webpackChunkName: "Redirect" */ '@/views/Redirect.vue'),
        props: ( route ) => {
            return {
                landing: route.params.landing
            }
        }
    },
    {
        path: '/auth',
        ...authRouter
    },
    {
        path: '/dashboard',
        ...dashboardRouter
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;