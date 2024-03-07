export default {
    name: 'auth',
    component: () => import(/* webpackChunkName: "Auth Layout" */ '@/layouts/AuthLayout.vue'),
    redirect: {
        name: 'login'
    },
    children: [
        {
            path: '',
            name: 'login',
            component: () => import(/* webpackChunkName: "Login" */ '@/views/auth/Login.vue'),
        }
    ]
};