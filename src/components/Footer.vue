<template>
    <div class="footer">
        <span> Todos los derechos reservados <i class="fa-regular fa-copyright m-2"></i> {{ year }} Punto CHG. </span>
    </div>
</template>

<script setup>
const date = new Date();
const year = date.getFullYear();
</script>