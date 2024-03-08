<template>
    <div class="footer">
        <span> Todos los derechos reservados <i class="fa-regular fa-copyright m-2"></i> {{ year }} Punto CHG. </span>
    </div>
</template>

<style scoped>
.footer {
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    height: 50px;
    color: #2DD4BF;
}
</style>

<script setup>
const date = new Date();
const year = date.getFullYear();
</script>