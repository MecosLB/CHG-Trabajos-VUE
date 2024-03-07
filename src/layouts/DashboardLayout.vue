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

<style scoped>
.dashboard {
    display: flex;
    flex-direction: row;
}

.container-content {
    width: 100%;
}

.views {
    min-height: calc(100vh - 100px);
}
</style>