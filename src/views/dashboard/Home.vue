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
                <div class="row mt-3 mb-3">
                    <div class="col-sm-12">
                        <div class="card car-vacancies">
                            <div class="car-body p-3">
                                <div class="row text-center">
                                    <h6> Vacantes Activas </h6>
                                </div>
                                
                                <div class="table-responsive mt-3">
                                    <table class="table table-sm table-hover table-striped">
                                        <thead class="text-center align-middle">
                                            <th> Titúlo </th>
                                            <th> Información General </th>
                                            <th> Candidatos </th>
                                        </thead>

                                        <tbody>
                                            <tr v-for="vacant in vacancies" :key="vacant.id">
                                                <td class="text-center align-middle">
                                                    <h6> {{ vacant.titulo }} </h6>
                                                </td>
                                                <td>
                                                    <ul class="list-group">
                                                        <li class="list-group-item">
                                                            <span class="fw-semibold"> Ubicación: </span>
                                                            <small> {{ vacant.direccion }} </small>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <span class="fw-semibold"> Fecha de Publicación: </span>
                                                            <small> {{ vacant.fechaPublicacion }} </small>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <span class="fw-semibold"> Empresa: </span>
                                                            <small> {{ vacant.empresa }} </small>
                                                        </li>
                                                    </ul>
                                                </td>
                                                <td v-if="vacant.candidatosPorRevisar > 0" class="text-center align-middle">
                                                    <h6> {{ vacant.candidatosPorRevisar }} </h6>
                                                    <small> Candidatos pendientes por revisar </small>
                                                </td>
                                                <td v-else class="text-center align-middle">
                                                    <small> Sin Candidatos </small>
                                                </td>
                                            </tr>
                                        </tbody>

                                        <tfoot></tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row mt-3 mb-3">
                    <div class="col-sm-12 col-md-6">
                        <div class="card">
                            <div class="car-body p-3">
                                <div class="row text-center">
                                    <h6> Nuevos Candidatos </h6>
                                    <h1> {{ totalNewCandidates }} </h1>
                                    <small> Candidatos pendientes por revisar </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-12 col-md-6">
                        <div class="card">
                            <div class="car-body p-3">
                                <div class="row text-center">
                                    <h6> Reporte de Candidatos </h6>
                                </div> 

                                <div class="chart">
                                    <DoughnutChart :chartData="chartData" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

import Loader from '@/components/Loader.vue';
import Breadcrumb from '@/components/dashboard/Breadcrumb.vue';
import { getVacancies } from '@/helpers/dashboard/home';

Chart.register(...registerables);

const candidates = ref(0);
const chartData = ref({});
const loader = ref(true);
const totalNewCandidates = ref(0);
const vacancies = ref([]);

onMounted(async () => {
    await loadView();
    setInterval(updateTotal, 250);
});

const getChartData = async () => {
    chartData.value = {
        labels: [ 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domigo' ],
        datasets: [
            {
                data: [ 5, 10, 4, 3, 1, 0, 7 ],
                backgroundColor: [ '#172554', '#2DD4BF', '#172554', '#2DD4BF', '#172554', '#2DD4BF', '#2DD4BF' ],
            },
        ],
    };
}

const setVacancies = async () => {
    const res = await getVacancies();
    if (!res.error) {
        const { mensaje, vacantes, nuevosCandidatos } = res;
        if (vacantes.length > 0) {
            vacancies.value = vacantes;
            candidates.value = nuevosCandidatos;
        }
    }
}

const loadView = async () => {
    await getChartData();
    await setVacancies();
    loader.value = false;
}

const updateTotal = () => {
    if (totalNewCandidates.value >= candidates.value) return;
    totalNewCandidates.value ++;
}
</script>