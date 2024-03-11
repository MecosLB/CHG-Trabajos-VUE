<template>
    <div class="dashboard">
        <Sidebar />

        <div class="container-fluid container-content">
            <Navbar />

            <div class="views">
                <router-view/>
            </div>

            <Footer />
        </div>
    </div>
</template>

<script setup>
import Sidebar from '@/components/dashboard/Sidebar.vue';
import Navbar from '@/components/dashboard/Navbar.vue';
import Footer from '@/components/Footer.vue'

import { validateSession } from '@/helpers/auth';
import { onMounted } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

onMounted(async () => {
    const res = await validateSession();
    if (res.error) router.push({ name: 'auth' })
});
</script>

<style>
@import url('../css/main.css');
</style>