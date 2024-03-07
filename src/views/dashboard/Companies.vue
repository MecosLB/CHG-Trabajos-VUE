<template>
    <section id="companies">
        <div class="row">
            <div v-if="loader" class="loader-view">
                <Loader />
            </div>

            <div v-else>
                <div class="d-flex align-items-center justify-content-between mt-3">
                    <div class="btn-pagination">
                        <nav aria-label="Pagination">
                            <ul class="pagination">
                                <li class="page-item m-1" v-if="pagination.page > 1">
                                    <button type="button" class="btn btn-sm btn-outline-primary rounded-5"
                                        @click="previous">
                                        <i class="fa-solid fa-chevron-left"></i>
                                    </button>
                                </li>

                                <li class="page-item m-1" v-if="pagination.page < totalPages">
                                    <button type="button" class="btn btn-sm btn-outline-primary rounded-5"
                                        @click="next">
                                        <i class="fa-solid fa-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div class="btn-add">
                        <button type="button" class="btn btn-sm btn-outline-primary rounded-5">
                            <i class="fa-solid fa-plus me-1"></i>
                            Agregar Empresa
                        </button>
                    </div>
                </div>

                <div v-if="loaderCompanies">
                    <div class="loader-companies"></div>
                </div>

                <div v-if="companies.length > 0" class="grid-companies">
                    <div v-for="{ id, nombre, direccion, correo, telefono } in companies" :key="id"
                        class="col-sm-12 col-md-12 col-lg-6 p-2">
                        <div class="card">
                            <div class="d-flex flex-row align-items-center justify-content-end p-2">
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-outline-primary rounded-1" type="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <button class="dropdown-item" type="button">
                                                <i class="fa-solid fa-pen me-1"></i>
                                                Editar
                                            </button>
                                        </li>

                                        <li>
                                            <button class="dropdown-item" type="button">
                                                <i class="fa-solid fa-eye-slash me-1"></i>
                                                Inhabilitar
                                            </button>
                                        </li>

                                        <li>
                                            <button class="dropdown-item" type="button">
                                                <i class="fa-solid fa-trash me-1"></i>
                                                Eliminar
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div class="container-card">
                                <div class="col-sm-12 col-md-12 col-lg-6 d-flex align-items-center justify-content-center">
                                    <img src="https://placehold.co/600x400/png" class="img-fluid p-2"
                                        alt="Logo" title="Logo">
                                </div>

                                <div class="col-sm-12 col-md-12 col-lg-6 d-flex align-items-center p-md-2">
                                    <ul class="list-group">
                                        <li class="list-group-item title">
                                            {{ nombre }}
                                        </li>
                                        <li class="list-group-item">
                                            <i class="fa-solid fa-location-dot me-1"></i>
                                            {{ direccion }}
                                        </li>
                                        <li class="list-group-item">
                                            <i class="fa-solid fa-at me-1"></i>
                                            {{ correo }}
                                        </li>
                                        <li class="list-group-item">
                                            <i class="fa-solid fa-phone me-1"></i>
                                            {{ telefono }}
                                        </li>
                                    </ul>
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

import Loader from '@/components/Loader.vue';

import getCompanies from '@/helpers/getCompanies';

const companies = ref([]);

const loader = ref(true);
const loaderCompanies = ref(true);

const pagination = ref({
    page: 1,
    results: 3,
});

const totalPages = ref(1);

onMounted(async () => {
    await loadView();

    loader.value = false;

    if (companies.value.length) loaderCompanies.value = false;
});

const loadCompanies = async () => {
    companies.value = [];
    loaderCompanies.value = true;

    try {
        const res = await getCompanies(pagination.value);
        const { error, mensaje, empresas, totalPaginas } = res;

        if (!error) {
            companies.value = empresas;
            totalPages.value = totalPaginas;
        } else {
            console.log(mensaje)
        }
    } catch (error) {
        console.log(error);
    }

    loaderCompanies.value = false;
}

const loadView = async () => {
    await loadCompanies();
}

const next = async () => {
    pagination.value.page++;
    await loadCompanies();
}

const previous = async () => {
    const page = pagination.value.page - 1;
    console.log(page);
    pagination.value.page = page == 0 ? 1 : page;
    await loadCompanies();
}
</script>

<style scoped>
.grid-companies {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 10px;
    font-size: 12px;
}

.loader-companies {
    width: 100%;
    height: 5px;
    background: radial-gradient(circle closest-side, #172554 92%, #0000) calc(100%/3) 0/calc(100%/4) 100%;
    animation: i2 0.5s infinite linear;
}

@keyframes i2 {
    100% {
        background-position: 0 0
    }
}

.card {
    border-color: transparent;
}

.card:hover {
    cursor: pointer;
}

.list-group-item {
    border-color: transparent;
}

.list-group-item.title {
    font-size: 15px;
    font-weight: bold;
}

.dropdown-item {
    font-size: 12px;
    color: #172554;
}

.dropdown-item.active,
.dropdown-item:active,
.dropdown-item:hover {
    background-color: transparent;
    color: #172554;
    font-weight: 500;
}

.container-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 10px;
}

@media only screen and (max-width: 992px) {
    .container-card {
        flex-direction: column;
    }
}
</style>