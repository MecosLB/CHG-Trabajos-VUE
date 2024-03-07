<template>
    <div class="redirect">
        <Loader />
    </div>

    <Footer />
</template>

<script setup>

import Loader from '@/components/Loader.vue';
import Footer from '@/components/Footer.vue';

</script>

<style scoped>
.redirect {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 50px);
}
</style>