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
    },
    {
        path: '/:pathMatch(.*)*',
        beforeEnter: [  ],
        component: () => import(/* webpackChunkName: "Not Found" */ '@/views/NotFound.vue'),
    },
    {
        path: '/not-found',
        name: 'not-found',
        component: () => import(/* webpackChunkName: "Not Found" */ '@/views/NotFound.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;