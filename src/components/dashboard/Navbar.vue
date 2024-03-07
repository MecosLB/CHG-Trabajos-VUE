<template>
    <div class="navbar">
        <div class="btn-sidebar">
            <button type="button" class="btn btn-sm btn-outline-primary rounded-5">
                <i :class="iClass"></i>
            </button>
        </div>

        <div class="btn-user">
            <div class="btn-group dropstart">
                <button type="button" class="btn btn-sm btn-outline-primary rounded-5" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-user-tie me-2"></i> Nombre Usuario
                </button>
                <ul class="dropdown-menu">
                    <!-- Dropdown menu links -->
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const iClass = ref('fa-solid fa-arrow-left-long');
// const iClass = ref('fa-solid fa-arrow-right-long');
</script>

<style scoped>
.navbar {
    height: 50px
}
</style>