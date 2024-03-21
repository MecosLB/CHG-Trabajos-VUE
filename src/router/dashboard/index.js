export default {
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "Dashboard Layout" */ '@/layouts/DashboardLayout.vue'),
    redirect: {
        name: 'home'
    },
    children: [
        {
            path: '',
            name: 'home',
            component: () => import(/* webpackChunkName: "Home" */ '@/views/dashboard/Home.vue'),
        },
        {
            path: 'vacancies',
            name: 'vacancies',
            component: () => import(/* webpackChunkName: "Vacancies" */ '@/views/dashboard/Vacancies.vue'),
        },
        {
            path: 'vacancies/:vacancieId',
            name: 'vacancie',
            component: () => import(/* webpackChunkName: "Vacancie" */ '@/views/dashboard/Vacancie.vue'),
            props: true,
        },
        {
            path: 'departaments',
            name: 'departaments',
            component: () => import(/* webpackChunkName: "Departaments" */ '@/views/dashboard/Departaments.vue'),
        },
        {
            path: 'candidates',
            name: 'candidates',
            component: () => import(/* webpackChunkName: "Candidates" */ '@/views/dashboard/Candidates.vue'),
        },
        {
            path: 'companies',
            name: 'companies',
            component: () => import(/* webpackChunkName: "Companies" */ '@/views/dashboard/Companies.vue'),
        },
        {
            path: 'users',
            name: 'users',
            component: () => import(/* webpackChunkName: "Users" */ '@/views/dashboard/Users.vue'),
        },
    ]
};