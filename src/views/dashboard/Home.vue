<template>
    <section id="home">
        <div v-if="loader" class="loader-view">
            <Loader />
        </div>

        <div v-else>
            <div class="container-fluid mb-4">
                <Breadcrumb :moduleName="''" />
            </div>

            <div class="grid-home">
                <div class="col-sm-12 col-md-6 col-lg-4 p-2">
                    <div class="card">
                        <div class="car-body">
                            ...
                        </div>
                    </div>
                </div>

                <div class="col-sm-12 col-md-6 col-lg-4 p-2">
                    <div class="card">
                        <div class="car-body">
                            ...
                        </div>
                    </div>
                </div>

                <div class="col-sm-12 col-md-6 col-lg-4 p-2">
                    <div class="card">
                        <div class="car-body">
                            ...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import Loader from '@/components/Loader.vue';
import Breadcrumb from '@/components/dashboard/Breadcrumb.vue';

const loader = ref(true);

onMounted(async () => {
    await loadView();
});

const loadView = async () => {
    loader.value = false;
}
</script>

<style scoped>
.grid-home {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 10px;
    font-size: 12px;
}
</style>