<template>
    <section id="candidates" class="container-fluid">
        <Breadcrumb :moduleName="'Vacantes'" class="mb-4" />

        <div v-if="loader" class="loader-view">
            <Loader />
        </div>

        <template v-else>
            <div>

            </div>

            <template v-if="loaderSearch">
                <div class="m-4">
                    <div class="loader-companies"></div>
                </div>
            </template>

            <div class="grid-candidates row justify-content-center align-items-start">
            </div>
        </template>
    </section>
</template>

<script setup>
import Loader from '@/components/Loader.vue';
import Breadcrumb from '@/components/dashboard/Breadcrumb.vue';
import { onMounted, ref } from 'vue';

const props = defineProps(['vacancieId']);

const loader = ref(true),
    loaderSearch = ref(true);

onMounted(() => {

});
</script>