<template>
    <div class="redirect">
        <Loader />
        <small> Not Found </small>
    </div>

    <Footer />
</template>

<script setup>
import Loader from '@/components/Loader.vue';
</script>

<style scoped>
.redirect {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: calc(100vh - 50px);
}

small {
    font-weight: bold;
}
</style>