<template>
    <div class="container-auth">
        <router-view/>
    </div>

    <Footer />
</template>

<script setup>
import Footer from '@/components/Footer.vue';
</script>

<style scoped>
@import url('../css/main.css');
@import url('../css/auth/layout.css');
</style>