<template>
    <section id="companies">
        <div class="container-fluid">
            <div v-if="companies.length > 0" class="grid-companies">
                <pre> {{ companies }} </pre>
            </div>

            <div v-else class="loader-view">
                <Loader />
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import Loader from '@/components/Loader.vue';

import getCompanies from '@/helpers/getCompanies';

const companies = ref([]);

onMounted(async () => {
    try {
        const res = await getCompanies();
        const { error, mensaje, empresas } = res;
        if (!error) companies.value = empresas;
        else console.log(mensaje);
    } catch (error) {
        console.log(error);
    }
});
</script>

<style scoped>
.grid-companies {
    display: flex;
}

.loader-view {
    height: calc(100vh - 100px);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>