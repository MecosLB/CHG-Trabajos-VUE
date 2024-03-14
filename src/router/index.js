import { createRouter, createWebHashHistory } from 'vue-router';

import dashboardRouter from './dashboard';

import authRouter from './auth';

import { guardDashboard, guardAuth } from './auth/guard';

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
        beforeEnter: [ guardAuth ],
        ...authRouter
    },
    {
        path: '/dashboard',
        beforeEnter: [ guardDashboard ],
        ...dashboardRouter
    },
    {
        path: '/:pathMatch(.*)*',
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