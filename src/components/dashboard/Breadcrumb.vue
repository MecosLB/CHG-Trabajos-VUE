<template>
    <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <router-link :to="{ name: 'home' }">
                    <i class="fa-solid fa-house me-2"></i>
                    <span> Inicio </span>
                </router-link>
            </li>
            <li v-if="moduleName !== ''" class="breadcrumb-item active" aria-current="page">
                {{ moduleName }}
            </li>
        </ol>
    </nav>
</template>

<script setup>
const props = defineProps(['moduleName']);
</script>

<style scoped>
@import url('../../css/dashboard/breadcrumb.css');
</style>