<template>
    <section id="candidates" class="container-fluid">
        <Breadcrumb :moduleName="'Vacantes'" class="mb-4" />

        <router-link class="btn btn-sm btn-outline-primary rounded-5 mb-4" :to="{ name: 'vacancies' }">
            <i class="fa-solid fa-arrow-left me-2"></i>
            Regresar
        </router-link>

        <div v-if="loader" class="loader-view">
            <Loader />
        </div>

        <template v-else>
            <div v-if="vacancie.length"
                v-for="{ id, estatus, titulo, departamento, empresa, direccion, ultimaActualizacion, nombreUsuario, fechaCaducidad } of vacancie"
                id="vacancies" class="py-2 animate__animated animate__fadeIn" :key="id">

                <article :class="`vacancie card row shadow-sm ${statusVacancieClass[estatus]}`">
                    <div class="col-7 info">
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

                    <span class="col-5 text-center date">
                        Fecha de caducidad:<br>
                        {{ getEndDate(fechaCaducidad) }}
                    </span>
                </article>
            </div>

            <div class="d-flex align-items-center my-4">
                <span class="d-flex gap-2">
                    <button v-if="pagination.page > 1" type="button" class="btn btn-sm btn-outline-primary rounded-1"
                        @click="prevPage">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>

                    <button v-if="pagination.page < totalPages" type="button"
                        class="btn btn-sm btn-outline-primary rounded-1" @click="nextPage">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </span>

                <span class="d-flex align-items-center ms-auto gap-4">
                    <div class="status-filter input-group">
                        <span class="input-group-text">
                            <i class="fa-solid fa-circle-dot"></i>
                        </span>
                        <select class="form-control form-control-sm rounded-5" v-model="filters.estatus"
                            @change="displayCandidates">
                            <option value="">Seleccionar estatus...</option>
                            <option value="Recibido">Recibido</option>
                            <option value="Visto">Visto</option>
                            <option value="Seleccionado">Seleccionado</option>
                            <option value="Finalista">Finalista</option>
                            <option value="Descartado">Descartado</option>
                        </select>
                    </div>

                    <div class="searchbar input-group">
                        <span class="input-group-text" id="buscar">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </span>
                        <input type="text" class="form-control form-control-sm rounded-5 form-search"
                            placeholder="Buscar candidato" aria-label="Buscar" v-model="filters.nombre"
                            @keyup.enter="displayCandidates">
                    </div>
                </span>
            </div>

            <template v-if="loaderSearch">
                <div class="m-4">
                    <div class="loader-companies"></div>
                </div>
            </template>

            <div class="grid-candidates row justify-content-center align-items-start">
                <div v-if="candidates.length"
                    v-for="{ id, estatus, nombre, apellidos, fechaNacimiento, telefono, correo, direccion, tituloProfesional } of candidates"
                    class="col-12 col-lg-6 col-xl-4 p-4 animate__animated animate__fadeIn" :key="id">
                    <article :class="`candidate card shadow-sm p-2 ${statusClass[estatus]}`">
                        <div class="header d-flex align-items-center gap-3 mb-2">
                            <i class="icon fa-solid fa-circle-user"></i>

                            <span class="name text-start">
                                <h6 class="fw-bold">
                                    <span>
                                        {{ nombre }}&nbsp;{{ apellidos }}
                                    </span>

                                    <span>
                                        &nbsp;-&nbsp;{{ calculateAge(fechaNacimiento) }}&nbsp;años
                                    </span>
                                </h6>
                                <p>
                                    {{ tituloProfesional }}
                                </p>
                            </span>

                            <CandidateVacancieOptions :candidateId="id" :candidateStatus="estatus"
                                :setCvTitle="setCvTitle" :onCandidateDiscard="onCandidateDiscard"
                                :onCandidateDelete="onCandidateDelete" :onCandidateSelect="onCandidateSelect"
                                :onCandidateFinalist="onCandidateFinalist" />
                        </div>

                        <ul class="body list-group">
                            <li class="list-group-item">
                                <i class="fa-solid fa-location-dot"></i>
                                &nbsp;{{ direccion }}
                            </li>
                            <li class="list-group-item">
                                <i class="fa-solid fa-at"></i>
                                &nbsp;{{ correo }}
                            </li>
                            <li class="list-group-item">
                                <i class="fa-solid fa-phone"></i>
                                &nbsp;{{ telefono }}
                            </li>
                        </ul>

                        <small class="status ms-auto fw-bold">
                            <i class="fa-solid fa-circle-dot"></i> {{ estatus }}
                        </small>
                    </article>
                </div>

                <article v-else class="col-12 alert alert-danger text-center fw-bold">
                    {{ mensaje }}
                </article>
            </div>
        </template>

        <!-- Modal Ver CV -->
        <div class="modal fade" id="cvModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="cvModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h6 class="modal-title" id="cvModalLabel">CV de {{ cvTitle }}</h6>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <template v-if="answers.length">
                            <h6>
                                Respuestas:
                            </h6>

                            <p v-for="{ label, respuesta } in answers">
                                <i class="fa-solid fa-circle-dot me-2 green"></i>
                                <b class="fw-bold me-2">{{ label }}:</b>{{ respuesta }}
                            </p>

                            <hr>
                        </template>

                        <embed src="" type="application/pdf" width="100%" height="500px">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-outline-primary"
                            data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import Loader from '@/components/Loader.vue';
import Breadcrumb from '@/components/dashboard/Breadcrumb.vue';
import CandidateVacancieOptions from '@/components/dashboard/CandidateVacancieOptions.vue';
import { getCandidatesVacancie, viewCandidateVacancie, discardCandidateVacancie, deleteCandidateVacancie, selectCandidateVacancie, finalistCandidateVacancie } from '@/helpers/dashboard/candidatesVacancie';
import { getVacancies } from '@/helpers/dashboard/vacancies';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';

const props = defineProps(['vacancieId']);

const candidates = ref([]);
const pagination = ref({
    page: 1,
    results: 6,
}),
    vacancie = ref([]),
    answers = ref([]),
    filters = ref({
        estatus: '',
        nombre: '',
    });

const totalPages = ref(1),
    loader = ref(true),
    loaderSearch = ref(true),
    mensaje = ref('No se encontraron candidatos'),
    cvTitle = ref('');

const statusClass = {
    'Recibido': 'received',
    'Visto': 'seen',
    'Seleccionado': 'selected',
    'Finalista': 'finalist',
    'Descartado': 'discarded',
},
    statusVacancieClass = {
        'Activo': 'active',
        'Suspendido': 'suspended',
        'Finalizado': 'ended',
        'Pendiente': 'paused',
    }
const customClass = {
    confirmButton: 'btn btn-sm btn-outline-primary rounded-1',
    cancelButton: 'btn btn-sm btn-outline-primary rounded-1'
}

// const baseUrl = window.location.origin;
const baseUrl = 'https://bolsa-testing.puntochg.com';

onMounted(async () => {
    window.scrollTo(0, 0);

    // Get current vacancie
    const { error: errorGet, mensaje: msgGet, vacantes } = await getVacancies({}, { id: props.vacancieId });
    if (errorGet)
        console.warn(msgGet);

    vacancie.value = vacantes;

    // Get that vacancie's candidates
    await displayCandidates();
    loader.value = false;
});

// Ref functions
const displayCandidates = async () => {
    loaderSearch.value = true;

    const { estatus, nombre } = filters.value;
    const { error: errorGet, mensaje: msgGet, vacantesCandidatos, totalPaginas } = await getCandidatesVacancie(props.vacancieId, { ...pagination.value }, { ...filters.value });

    totalPages.value = totalPaginas || 1;

    if ((estatus || nombre) && Math.ceil(totalPages.value) < pagination.value.page) {
        pagination.value.page = 1;
        return await displayCandidates();
    }

    candidates.value = vacantesCandidatos || [];

    loaderSearch.value = false;
}

const setCvTitle = async (candidateId = '') => {
    const pdfDOM = document.querySelector('#cvModal embed');
    const selectedCandidate = candidates.value.find(({ id }) => candidateId === id);

    cvTitle.value = `${selectedCandidate.nombre} ${selectedCandidate.apellidos}`;
    pdfDOM.src = `${baseUrl}/cv/${selectedCandidate.id}.pdf`;

    const { respuestas } = selectedCandidate;
    answers.value = respuestas === 'Array' ? [] : JSON.parse(respuestas);
    await onCandidateView(selectedCandidate);
}

const nextPage = async () => {
    pagination.value.page++;
    await displayCandidates();
}

const prevPage = async () => {
    const newPage = pagination.value.page - 1;
    pagination.value.page = newPage < 1 ? 1 : newPage;
    await displayCandidates();
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

const calculateAge = (_date) => {
    const today = new Date(),
        birthDate = new Date(_date);

    const monthDif = today.getMonth() - birthDate.getMonth();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (monthDif < 0) age--;
    if (monthDif === 0 && today.getDate() < birthDate.getDate()) age--;

    return age;
}

const onCandidateView = async (selectedCandidate = {}) => {
    if (selectedCandidate.estatus !== 'Recibido') return;

    const { error: errorView, mensaje: msgView } = await viewCandidateVacancie({ ...selectedCandidate });
    if (errorView)
        return console.warn(msgView);

    await displayCandidates();
}

const onCandidateDiscard = async (candidateId = '') => {
    const selectedCandidate = candidates.value.find(({ id }) => candidateId === id);

    Swal.fire({
        title: 'Descartar Candidato',
        text: `¿Realmente desea descartar al candidato: ${selectedCandidate.nombre} ${selectedCandidate.apellidos}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Descartar',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "#d33",
        width: '500px',
        reverseButtons: true,
        customClass: customClass,
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        const { error: errorDiscard, mensaje: msgDiscard } = await discardCandidateVacancie({ ...selectedCandidate });
        if (errorDiscard)
            return console.warn(msgDiscard);

        Swal.fire({
            title: `<h3 class='fw-bold'>
            ${msgDiscard}
        </h3>`,
            icon: 'success',
            showConfirmButton: false,
            showCloseButton: true,
            width: '400px',
        });

        await displayCandidates();
    });
}

const onCandidateDelete = async (candidateId = '') => {
    const selectedCandidate = candidates.value.find(({ id }) => candidateId === id);

    Swal.fire({
        title: 'Eliminar Candidato',
        text: `¿Realmente desea eliminar al candidato: ${selectedCandidate.nombre} ${selectedCandidate.apellidos}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "#d33",
        width: '500px',
        reverseButtons: true,
        customClass: customClass,
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        const { error: errorDelete, mensaje: msgDelete } = await deleteCandidateVacancie({ ...selectedCandidate });
        if (errorDelete)
            return console.warn(msgDelete);

        Swal.fire({
            title: `<h3 class='fw-bold'>
            ${msgDelete}
        </h3>`,
            icon: 'success',
            showConfirmButton: false,
            showCloseButton: true,
            width: '400px',
        });

        await displayCandidates();
    });
}

const onCandidateSelect = async (candidateId = '') => {
    const selectedCandidate = candidates.value.find(({ id }) => candidateId === id);

    Swal.fire({
        title: 'Seleccionar Candidato',
        text: `¿Realmente desea seleccionar como destacado al candidato: ${selectedCandidate.nombre} ${selectedCandidate.apellidos}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Seleccionar',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "#d33",
        width: '500px',
        reverseButtons: true,
        customClass: customClass,
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        const { error: errorDelete, mensaje: msgDelete } = await selectCandidateVacancie({ ...selectedCandidate });
        if (errorDelete)
            return console.warn(msgDelete);

        Swal.fire({
            title: `<h3 class='fw-bold'>
            ${msgDelete}
        </h3>`,
            icon: 'success',
            showConfirmButton: false,
            showCloseButton: true,
            width: '400px',
        });

        await displayCandidates();
    });
}

const onCandidateFinalist = async (candidateId = '') => {
    const selectedCandidate = candidates.value.find(({ id }) => candidateId === id);

    Swal.fire({
        title: 'Seleccionar como finalista al Candidato',
        text: `¿Realmente desea seleccionar como finalista al candidato: ${selectedCandidate.nombre} ${selectedCandidate.apellidos}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Seleccionar',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "#d33",
        width: '500px',
        reverseButtons: true,
        customClass: customClass,
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        const { error: errorDelete, mensaje: msgDelete } = await finalistCandidateVacancie({ ...selectedCandidate });
        if (errorDelete)
            return console.warn(msgDelete);

        Swal.fire({
            title: `<h3 class='fw-bold'>
            ${msgDelete}
        </h3>`,
            icon: 'success',
            showConfirmButton: false,
            showCloseButton: true,
            width: '400px',
        });

        await displayCandidates();
    });
}
</script>