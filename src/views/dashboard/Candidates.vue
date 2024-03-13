<template>
    <section id="candidates" class="container-fluid">
        <Breadcrumb :moduleName="'Candidatos'" class="mb-4" />

        <div v-if="loader" class="loader-view">
            <Loader />
        </div>

        <template v-else>
            <div class="d-flex align-items-center mb-4">
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
                            <option value="Descartado">Descartado</option>
                        </select>
                    </div>

                    <div class="searchbar input-group">
                        <span class="input-group-text" id="buscar">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </span>
                        <!-- <input type="text" class="form-control form-control-sm rounded-5 form-search"
                            placeholder="Buscar candidato" aria-label="Buscar" v-model="searchForm" @keyup.enter="search"> -->
                        <input type="text" class="form-control form-control-sm rounded-5 form-search"
                            placeholder="Buscar candidato" aria-label="Buscar" v-model="filters.nombre"
                            @keyup.enter="displayCandidates">
                    </div>
                </span>
            </div>

            <div class="grid-candidates row justify-content-center align-items-start">

                <div v-if="candidates.length"
                    v-for="{ id, estatus, nombre, apellidos, fechaNacimiento, telefono, correo, direccion, tituloProfesional } of candidates"
                    class="col-12 col-lg-6 col-xl-4 p-4" :key="id">
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

                            <CandidateOptions :candidateId="id" :candidateStatus="estatus" :setCvTitle="setCvTitle"
                                :onCandidateDiscard="onCandidateDiscard" :onCandidateDelete="onCandidateDelete" />
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
                        <object data="https://bolsa-testing.puntochg.com/cv/8ab9eef3-6d47-401b-8c86-72e1f688ad74.pdf"
                            width="100%" height="500px"></object>
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
import CandidateOptions from '@/components/dashboard/CandidateOptions.vue';
import { deleteCandidate, discardCandidate, getCandidates, viewCandidate } from '@/helpers/candidates';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';

const candidates = ref([]);
const pagination = ref({
    page: 1,
    results: 6,
}),
    filters = ref({
        estatus: '',
        nombre: '',
    });

const totalPages = ref(1),
    loader = ref(true),
    mensaje = ref('No hemos recibido candidatos'),
    cvTitle = ref('');

const statusClass = {
    'Recibido': 'received',
    'Visto': 'seen',
    'Descartado': 'discarded',
}
const customClass = {
    confirmButton: 'btn btn-sm btn-outline-primary rounded-1',
    cancelButton: 'btn btn-sm btn-outline-primary rounded-1'
}

onMounted(async () => {
    const { candidatos, totalPaginas } = await getCandidates({ ...pagination.value });
    candidates.value = candidatos;
    totalPages.value = totalPaginas;
    loader.value = false;
});

// Ref functions
const displayCandidates = async () => {
    const { error: errorGet, mensaje: msgGet, candidatos, totalPaginas } = await getCandidates({ ...pagination.value }, { ...filters.value });

    if (errorGet)
        return console.warn(msgGet);

    candidates.value = candidatos;
    totalPages.value = totalPaginas;
}

const setCvTitle = async (candidateId = '') => {
    const selectedCandidate = candidates.value.filter(({ id }) => candidateId === id)[0];
    cvTitle.value = `${selectedCandidate.nombre} ${selectedCandidate.apellidos}`;
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

    const { error: errorView, mensaje: msgView } = await viewCandidate({ ...selectedCandidate });
    if (errorView)
        return console.warn(msgView);

    await displayCandidates();
}

const onCandidateDiscard = async (candidateId = '') => {
    const selectedCandidate = candidates.value.filter(({ id }) => candidateId === id)[0];

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

        const { error: errorDiscard, mensaje: msgDiscard } = await discardCandidate({ ...selectedCandidate });
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
    const selectedCandidate = candidates.value.filter(({ id }) => candidateId === id)[0];

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

        const { error: errorDelete, mensaje: msgDelete } = await deleteCandidate({ ...selectedCandidate });
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