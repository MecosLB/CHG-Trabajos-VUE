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
                    <div class="col-sm-12  mb-3">
                        <router-link :to="{ name: 'candidates' }">
                            <div class="card">
                                <div class="car-body p-3">
                                    <div class="row text-center">
                                        <h6>
                                            <i class="fa-solid fa-user-plus me-2"></i> Nuevos Candidatos
                                        </h6>
                                        <h1> {{ totalNewCandidates }} </h1>
                                        <small> pendientes por revisar </small>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>

                <div class="row mt-3 mb-3">
                    <div class="col-sm-12 mb-3">
                        <div class="card car-vacancies">
                            <div class="car-body p-3">
                                <div class="row text-center">
                                    <h6>
                                        <i class="fa-solid fa-file-contract me-2"></i> Vacantes Activas
                                    </h6>
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
                    <div class="col-sm-12 col-md-6 mb-3">
                        <div class="card">
                            <div class="car-body p-3">
                                <div class="row text-center">
                                    <h6>
                                        <i class="fa-solid fa-chart-simple me-2"></i> Reporte de Candidatos de las Vacantes
                                    </h6>
                                </div> 

                                <div v-if="dataReport.length > 0" class="chart">
                                    <DoughnutChart :chartData="chartVacancies" />
                                </div>

                                <div v-else class="row text-center mt-2">
                                    <small> No existen candidatos registrados para las vacantes de el mes de  </small>
                                </div>

                                <div class="row text-center fw-bold mt-2">
                                    <small> {{ monthVacancies }} </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-12 col-md-6 mb-3">
                        <div class="card">
                            <div class="car-body p-3">
                                <div class="row text-center">
                                    <h6>
                                        <i class="fa-solid fa-chart-simple me-2"></i> Reporte de Candidatos
                                    </h6>
                                </div> 

                                <div v-if="dataReport.length > 0" class="chart">
                                    <DoughnutChart :chartData="chartCandidates" />
                                </div>

                                <div v-else class="row text-center mt-2">
                                    <small> No existen candidatos registrados para el mes de  </small>
                                </div>

                                <div class="row text-center fw-bold mt-2">
                                    <small> {{ monthCandidates }} </small>
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

import { useRouter } from 'vue-router';
const router = useRouter();

import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

import Swal from 'sweetalert2';

import Loader from '@/components/Loader.vue';
import Breadcrumb from '@/components/dashboard/Breadcrumb.vue';

import { getReports, getVacancies } from '@/helpers/dashboard/home';
import { validateSession } from '@/helpers/auth';

Chart.register(...registerables);

const candidates = ref(0);
const chartCandidates = ref({});
const chartVacancies = ref({});
const dataReport = ref([]);
const loader = ref(true);
const monthCandidates = ref('');
const monthVacancies = ref('');
const totalNewCandidates = ref(0);
const vacancies = ref([]);

onMounted(async () => {
    const res = await validateSession();
    console.log('home', res);
    const { error } = res;
    if (error) { 
        router.push({ name: 'auth' })
    } else {
        await loadView();
        setInterval(updateTotal, 250);
    }
});

const dataCandidates = async ({ mes, labels, data, colors }) => {
    monthCandidates.value = mes;
    dataReport.value = data;

    chartCandidates.value = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: colors,
            }
        ],
    };
}

const dataVacancies = async ({ mes, labels, data, colors }) => {
    monthVacancies.value = mes;
    dataReport.value = data;

    chartVacancies.value = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: colors,
            }
        ],
    };
}

const reports = async () => {
    const res = await getReports();
    
    if (res.error) {
        showAlert({ 
            title: '¡ERROR!', 
            message: res.mensaje, 
            icon: 'error',
        });
        return false;
    }

    if (!res.error) {
        const { candidatos, vacantesCandidatos } = res;
        await dataCandidates(candidatos);
        await dataVacancies(vacantesCandidatos);
    }

    return true;
}

const setVacancies = async () => {
    const res = await getVacancies();
    
    if (res.error) {
        showAlert({ 
            title: '¡ERROR!', 
            message: res.mensaje, 
            icon: 'error',
        });
        return;
    }

    if (!res.error) {
        const { mensaje, vacantes, nuevosCandidatos } = res;
        if (vacantes.length > 0) {
            vacancies.value = vacantes;
            candidates.value = nuevosCandidatos;
        }
    }
}

const showAlert = ({ title, message, icon }) => {
    Swal.fire({
        title: title,
        html: message,
        icon: icon,
        showConfirmButton: false,
        showCloseButton: true,
    });
}

const loadView = async () => {
    await reports();
    await setVacancies();
    loader.value = false;
}

const updateTotal = () => {
    if (totalNewCandidates.value >= candidates.value) return;
    totalNewCandidates.value ++;
}
</script>