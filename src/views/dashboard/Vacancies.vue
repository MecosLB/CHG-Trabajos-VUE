<template>
    <section id="vacancies" class="container-fluid">
        <Breadcrumb :moduleName="'Vacantes'" class="mb-4" />

        <div v-if="loader" class="loader-view">
            <Loader />
        </div>

        <template v-else>
            <!-- <template v-if="loaderSearch">
                <div class="m-4">
                    <div class="loader-companies"></div>
                </div>
            </template> -->

            <div class="grid-vacancies row">

                <div v-if="vacancies.length"
                    v-for="{ id, estatus, titulo, departamento, empresa, direccion, ultimaActualizacion, nombreUsuario, fechaCaducidad, candidatos, candidatosPorRevisar } of vacancies"
                    class="col-12 py-2" :key="id">

                    <article :class="`vacancie card row shadow-sm ${statusClass[estatus]}`">
                        <div class="col-5 info">
                            <span class="status">
                                <i class="fa-solid fa-circle-dot"></i>
                                &nbsp;{{ estatus }}
                            </span>

                            <span class="d-flex flex-column h-100 overflow-hidden px-4 py-2">
                                <h6 class="title">
                                    {{ titulo }}
                                </h6>
                                <p class="department">
                                    {{ departamento }}<br>
                                    {{ `${empresa} - ${getCity(direccion)}` }}
                                </p>
                                <small class="updated" v-if="ultimaActualizacion">
                                    Última actualización el {{ ultimaActualizacion }}
                                </small>

                                <small class="user">
                                    Publicada por {{ nombreUsuario }}
                                </small>
                            </span>
                        </div>

                        <span class="col-3 text-center date">
                            Fecha de caducidad:<br>
                            {{ getEndDate(fechaCaducidad) }}
                        </span>

                        <span class="col-2 text-center candidates">
                            <strong :class="candidatos === '0' ? 'red' : 'green'">{{ `${candidatos} ${candidatos === '1'
            ?
            'candidato' :
            'candidatos'}` }}</strong>
                            {{ `${candidatosPorRevisar !== '0' ? `${candidatosPorRevisar} por revisar` : ''}` }}
                        </span>

                        <span class="col-2 options">
                            <button class="btn btn-sm btn-outline-primary rounded-1">
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <!-- <button class="btn btn-sm btn-outline-primary rounded-1" type="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button> -->
                        </span>
                    </article>

                </div>

            </div>
        </template>
    </section>
</template>

<script setup>
import Loader from '@/components/Loader.vue';
import Breadcrumb from '@/components/dashboard/Breadcrumb.vue';
import { getVacancies } from '@/helpers/dashboard/home';
import { onMounted, ref } from 'vue';

const vacancies = ref([]);
const pagination = ref({
    page: 1,
    results: 6,
});

const loader = ref(true);

const statusClass = {
    'Activo': 'active',
    'Pendiente': 'suspended',
    'Finalizado': 'ended',
}

onMounted(async () => {
    await displayVacancies();
    loader.value = false;
});

// Ref functions
const displayVacancies = async () => {
    const { error: erroGet, mensaje: msgGet, vacantes } = await getVacancies({ ...pagination.value });
    if (erroGet)
        console.warn(erroGet);

    vacancies.value = vacantes || [];
    console.log(vacancies.value);
}

// General functions
const getCity = (location = '') => {
    const splitLocation = location.split(',');
    return splitLocation[splitLocation.length - 2];
}

const getEndDate = (date = '') => {
    const monthText = {
        0: 'Enero',
        1: 'Febrero',
        2: 'Marzo',
        3: 'Abril',
        4: 'Mayo',
        5: 'Junio',
        6: 'Julio',
        7: 'Agosto',
        8: 'Septiembre',
        9: 'Octubre',
        10: 'Noviembre',
        11: 'Diciembre',
    }
    const splitDate = date.split('-'),
        formatDate = `${splitDate[1]}-${splitDate[0]}-${splitDate[2]}`,
        endDate = new Date(formatDate);

    return `${endDate.getDate()} de ${monthText[endDate.getMonth()]} de ${endDate.getFullYear()}`;
}
</script>