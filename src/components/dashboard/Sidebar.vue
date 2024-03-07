<template>
    <div class="sidebar show">
        
    </div>
</template>

<script setup>

</script>

<style scoped>
.sidebar {
    background-color: #172554;
    min-height: 100vh;
    width: 250px;
}

.sidebar.show {
    width: 250px;
    transition: ease-in 1s;
}

.sidebar.hide {
    width: 0px;
    transition: ease-in 1s;
}
</style>