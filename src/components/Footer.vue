<template>
    <div class="footer">
        <span> Copy <i class="fa-regular fa-copyright m-2"></i> Todos los derechos reservados {{ year }}. </span>
    </div>
</template>

<style scoped>
.footer {
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    height: 50px;
}
</style>

<script setup>
const date = new Date();
const year = date.getFullYear();
</script>