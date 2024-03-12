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
</script>