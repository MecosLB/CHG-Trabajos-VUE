<template>
    <section id="companies">
        <div v-if="loader" class="loader-view">
            <Loader />
        </div>

        <div v-else>
            <div class="container-fluid mb-4">
                <Breadcrumb :moduleName="'Empresas'" />
            </div>

            <div class="actions-companies">
                <div class="col-12 col-sm-12 col-md-12 col-lg-4">
                    <nav aria-label="Pagination">
                        <ul class="pagination mb-0">
                            <li class="page-item m-1" v-if="pagination.page > 1">
                                <button type="button" class="btn btn-sm btn-outline-primary rounded-3"
                                    @click="previous">
                                    <i class="fa-solid fa-chevron-left"></i>
                                </button>
                            </li>

                            <li class="page-item m-1" v-if="pagination.page < totalPages">
                                <button type="button" class="btn btn-sm btn-outline-primary rounded-3" @click="next">
                                    <i class="fa-solid fa-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div class="col-12 col-sm-12 col-md-12 col-lg-4">
                    <div class="input-group">
                        <span class="input-group-text" id="buscar">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </span>
                        <input type="text" class="form-control form-control-sm rounded-5 form-search"
                            placeholder="Buscar empresa" aria-label="Buscar" v-model="searchForm" @keyup.enter="search">
                    </div>
                </div>

                <div class="col-12 col-sm-12 col-md-12 col-lg-4">
                    <div class="d-flex align-items-center justify-content-end">
                        <button type="button" class="btn btn-sm btn-outline-primary rounded-3 w-auto"
                            data-bs-toggle="modal" data-bs-target="#modalCompany"
                            @click="modalCompany({ action: 'Nuevo' })">
                            <i class="fa-solid fa-plus me-1"></i>
                            Agregar Empresa
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="loaderCompanies">
                <div class="m-4">
                    <div class="loader-companies"></div>
                </div>
            </div>

            <div class="grid-companies">
                <div v-if="companies.length > 0" v-for="company in companies" :key="company.id"
                    class="col-12 col-sm-12 col-md-12 col-lg-6 p-2">
                    <div class="card">
                        <div class="d-flex flex-row align-items-center justify-content-end p-2">
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline-primary rounded-1" type="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <button class="dropdown-item" type="button" data-bs-toggle="modal"
                                            data-bs-target="#modalCompany"
                                            @click="modalCompany({ action: 'Editar', company: company })">
                                            <i class="fa-solid fa-pen me-1"></i>
                                            Editar
                                        </button>
                                    </li>

                                    <li v-if="company.estatus !== 'Suspendido'">
                                        <button class="dropdown-item" type="button" @click="suspend(company)">
                                            <i class="fa-solid fa-eye-slash me-1"></i>
                                            Suspender
                                        </button>
                                    </li>

                                    <li v-if="company.estatus == 'Suspendido'">
                                        <button class="dropdown-item" type="button" @click="active(company)">
                                            <i class="fa-solid fa-eye me-1"></i>
                                            Activar
                                        </button>
                                    </li>

                                    <li>
                                        <button class="dropdown-item" type="button" @click="deleteC(company)">
                                            <i class="fa-solid fa-trash me-1"></i>
                                            Eliminar
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="container-card animate__animated animate__fadeIn">
                            <div class="col-12 col-sm-12 col-md-12 col-lg-6 d-flex align-items-center justify-content-center">
                                <img :id="company.id" :src="`logotipos/${company.id}.png`"
                                    class="img-fluid p-2 rounded-3" :alt="company.nombre" :title="company.nombre"
                                    @error="setDefaultLogotipo(company.id)">
                            </div>

                            <div class="col-12 col-sm-12 col-md-12 col-lg-6">
                                <div class="d-flex flex-column pb-md-3">
                                    <ul class="list-group">
                                        <li class="list-group-item title">
                                            {{ company.nombre }}
                                        </li>
                                        <li class="list-group-item">
                                            <i class="fa-solid fa-location-dot me-1"></i>
                                            {{ company.direccion }}
                                        </li>
                                        <li class="list-group-item">
                                            <i class="fa-solid fa-at me-1"></i>
                                            {{ company.correo }}
                                        </li>
                                        <li class="list-group-item">
                                            <i class="fa-solid fa-phone me-1"></i>
                                            {{ company.telefono }}
                                        </li>
                                    </ul>

                                    <div class="status-company text-end">
                                        <small class="fw-bold">
                                            <i :class="setClassStatus(company.estatus)"></i> {{ company.estatus }}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="showMessageCompanies" class="w-100">
                    <div class="alert alert-danger text-center fw-bold" role="alert" v-html="messageCompanies"></div>
                </div>
            </div>
        </div>
    </section>

    <div class="modal fade" id="modalCompany" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h6 class="modal-title">
                        {{ actionCompany }} Empresa
                    </h6>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="modalCompany({ action: 'Cerrar' })">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="modal-body">
                    <ul class="nav nav-tabs" id="company" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="general-tab" data-bs-toggle="tab"
                                data-bs-target="#general-tab-pane" type="button" role="tab"
                                aria-controls="general-tab-pane" aria-selected="true">
                                <i class="fa-solid fa-building me-1"></i> General
                            </button>
                        </li>

                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="address-tab" data-bs-toggle="tab"
                                data-bs-target="#address-tab-pane" type="button" role="tab"
                                aria-controls="address-tab-pane" aria-selected="false">
                                <i class="fa-solid fa-map-location-dot me-1"></i>
                                Domicilio
                            </button>
                        </li>
                    </ul>

                    <div class="tab-content" id="companyContent">
                        <div class="tab-pane fade show active" id="general-tab-pane" role="tabpanel"
                            aria-labelledby="general-tab" tabindex="0">
                            <div class="p-2">
                                <form autocomplete="off">
                                    <div class="row mb-2">
                                        <div class="col-sm-12 col-lg-12">
                                            <label for="estatus" class="form-label"> Estatus: </label>
                                            <div class="dropdown">
                                                <button class="btn btn-secondary w-100 btn-select dropdown-toggle"
                                                    type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    {{ statusSelected(companyForm.estatus) }}
                                                </button>
                                                <ul class="dropdown-menu w-100">
                                                    <li v-for="{ value, label } in statusOptions">
                                                        <a class="dropdown-item dropdown-option"
                                                            @click="optionStatus(value)">
                                                            {{ label }}
                                                        </a>
                                                    </li>
                                                </ul>
                                                <small id="estatus-error" class="error-form"> {{ errorMessage }}
                                                </small>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row mb-2">
                                        <div class="col-sm-12 col-lg-6">
                                            <label for="nombre" class="form-label"> Nombre: </label>
                                            <input type="text" class="form-control form-control-sm" id="nombre"
                                                placeholder="" v-model="companyForm.nombre">
                                            <small id="nombre-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>

                                        <div class="col-sm-12 col-lg-6">
                                            <label for="landing" class="form-label"> Landing: </label>
                                            <input type="text" class="form-control form-control-sm" id="landing"
                                                placeholder="" v-model="companyForm.landing">
                                            <small id="landing-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>
                                    </div>

                                    <div class="row mb-2">
                                        <div class="col-sm-12 col-lg-6">
                                            <label for="correo" class="form-label"> Correo: </label>
                                            <input type="text" class="form-control form-control-sm" id="correo"
                                                placeholder="" v-model="companyForm.correo">
                                            <small id="correo-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>

                                        <div class="col-sm-12 col-lg-6">
                                            <label for="telefono" class="form-label"> Teléfono: </label>
                                            <input type="text" class="form-control form-control-sm" id="telefono"
                                                placeholder="" v-model="companyForm.telefono">
                                            <small id="telefono-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>
                                    </div>

                                    <div class="row mb-2">
                                        <div class="col-sm-12 col-lg-12">
                                            <label for="logotipo" class="form-label"> Logotipo: </label>
                                            <input type="file" class="form-control form-control-sm" id="logotipo"
                                                placeholder="" @change="inputLogo">
                                            <small id="logotipo-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="address-tab-pane" role="tabpanel" aria-labelledby="address-tab"
                            tabindex="0">
                            <div class="p-2">
                                <form autocomplete="off">
                                    <div class="row">
                                        <div class="col-sm-12 col-lg-12">
                                            <label for="calle" class="form-label"> Calle: </label>
                                            <input type="text" class="form-control form-control-sm" id="calle"
                                                placeholder="" v-model="companyForm.calle">
                                            <small id="calle-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-12 col-lg-6">
                                            <label for="noInterior" class="form-label"> No. Interior: </label>
                                            <input type="text" class="form-control form-control-sm" id="noInterior"
                                                placeholder="" v-model="companyForm.noInterior">
                                            <small id="noInterior-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>

                                        <div class="col-sm-12 col-lg-6">
                                            <label for="noExterior" class="form-label"> No. Exterior: </label>
                                            <input type="text" class="form-control form-control-sm" id="noExterior"
                                                placeholder="" v-model="companyForm.noExterior">
                                            <small id="noExterior-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-12 col-lg-6">
                                            <label for="codigoPostal" class="form-label"> Código Postal: </label>
                                            <input type="text" class="form-control form-control-sm" id="codigoPostal"
                                                placeholder="" v-model="companyForm.codigoPostal">
                                            <small id="codigoPostal-error" class="error-form"> {{ errorMessage }}
                                            </small>
                                        </div>

                                        <div class="col-sm-12 col-lg-6">
                                            <label for="colonia" class="form-label"> Colonia: </label>
                                            <input type="text" class="form-control form-control-sm" id="colonia"
                                                placeholder="" v-model="companyForm.colonia">
                                            <small id="colonia-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-12 col-lg-6">
                                            <label for="municipio" class="form-label"> Municipio: </label>
                                            <input type="text" class="form-control form-control-sm" id="municipio"
                                                placeholder="" v-model="companyForm.municipio">
                                            <small id="municipio-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>

                                        <div class="col-sm-12 col-lg-6">
                                            <label for="estado" class="form-label"> Estado: </label>
                                            <input type="text" class="form-control form-control-sm" id="estado"
                                                placeholder="" v-model="companyForm.estado">
                                            <small id="estado-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div v-if="loaderModal" class="m-3">
                        <div class="loader-companies"></div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button id="btn-modal" type="button" class="btn btn-sm btn-outline-primary" data-bs-dismiss="modal"
                        @click="modalCompany({ action: 'Cancelar' })">
                        Cancelar
                    </button>

                    <button type="button" class="btn btn-sm btn-outline-primary"
                        @click="modalCompany({ action: actionCompany })">
                        {{ actionCompany }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import Swal from 'sweetalert2'

import Loader from '@/components/Loader.vue';
import Breadcrumb from '@/components/dashboard/Breadcrumb.vue';

import { activeCompany, deleteCompany, getCompanies, addCompany, suspendCompany, updateInfoCompany } from '@/helpers/dashboard/companies';
import { uploadFile, deleteFile } from '@/helpers/uploader';

const actionCompany = ref('');
const companies = ref([]);
const companyId = ref('');
const companyForm = ref({
    estatus: 'Activo',
    nombre: '',
    landing: '',
    correo: '',
    telefono: '',
    logotipo: '',
    calle: '',
    noInterior: '',
    noExterior: '',
    codigoPostal: '',
    colonia: '',
    municipio: '',
    estado: '',
});
const errorMessage = ref('');
const fileTemp = ref({});
const loader = ref(true);
const loaderCompanies = ref(true);
const loaderModal = ref(false);
const messageCompanies = ref('No existen registros de empresas.');
const pagination = ref({
    page: 1,
    results: 3,
});
const searchForm = ref('');
const statusOptions = ref([
    { value: 'Activo', label: 'Activa' },
    { value: 'Suspendido', label: 'Suspedida' }
]);
const showMessageCompanies = ref(false);
const totalPages = ref(1);

onMounted(async () => {
    await loadView();

    loader.value = false;

    if (companies.value.length) loaderCompanies.value = false;
});

const active = async (company) => {
    const customClass = {
        confirmButton: 'btn btn-sm btn-outline-primary rounded-1',
        cancelButton: 'btn btn-sm btn-outline-primary rounded-1'
    };

    Swal.fire({
        title: 'Activar Empresa',
        text: '¿Realmente desea activar esta empresa?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, Activar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
        customClass: customClass
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await activeCompany(company);
            const { error, mensaje } = res;
            if (error) showAlert({ title: '¡ERROR!', message: res.mensaje, icon: 'error' })
            else showAlert({ title: '¡ÉXITO!', message: res.mensaje, icon: 'success' })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            /*  */
        }
    });
}

const deleteC = async (company) => {
    const customClass = {
        confirmButton: 'btn btn-sm btn-outline-primary rounded-1',
        cancelButton: 'btn btn-sm btn-outline-primary rounded-1'
    };

    Swal.fire({
        title: 'Eliminar Empresa',
        text: '¿Realmente desea eliminar esta empresa?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, Eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
        customClass: customClass
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await deleteCompany(company);
            const { error, mensaje } = res;
            if (error) showAlert({ title: '¡ERROR!', message: res.mensaje, icon: 'error' })
            else showAlert({ title: '¡ÉXITO!', message: res.mensaje, icon: 'success' })
            await loadCompanies();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            /*  */
        }
    });
}

const editCompany = async () => {
    loaderModal.value = true;

    hideErrors();

    const { error, message, field } = validateForm();

    if (error) {
        loaderModal.value = false;
        showTab({ field });
        setError({ message, field });
        return
    }

    const id = companyId.value;
    const companyData = companyForm.value;
    const res = await updateInfoCompany(id, companyData);

    if (!res.error) {
        document.getElementById('btn-modal').click();
        resetForm();
        showAlert({
            title: '¡ÉXITO!',
            message: res.mensaje,
            icon: 'success'
        })
        loaderModal.value = false;
        await loadCompanies();
    } else {
        showAlert({
            title: '¡ERROR!',
            message: res.mensaje,
            icon: 'error'
        })
        loaderModal.value = false;
    }
}

const hideError = (conf) => {
    const { field } = conf;

    errorMessage.value = '';

    const input = document.getElementById(`${field}`);

    const small = document.getElementById(`${field}-error`);

    small.style.display = 'none';
}

const hideErrors = () => {
    const form = companyForm.value;
    for (const field in form) {
        if (Object.hasOwnProperty.call(form, field)) {
            hideError({ field });
        }
    }
}

const inputLogo = async () => {
    if (fileTemp.value) {
        await uploader({ action: 'Eliminar', file: fileTemp.value.name, extensions: '' });
    }

    companyForm.value.logotipo = '';

    const input = document.getElementById('logotipo');

    const value = input.value;
    if (value !== '') {
        const name = value.split('\\').pop();
        companyForm.value.logotipo = name;
    }

    const files = input.files;
    if (files.length > 0) {
        await uploader({ action: 'Subir', file: files[0], extensions: JSON.stringify(['png']) });
    }
}

const loadCompanies = async () => {
    companies.value = [];
    loaderCompanies.value = true;

    let filters = {};
    if (searchForm.value != '') {
        pagination.value.page = 1;

        filters = {
            estatus: '',
            nombre: searchForm.value,
            correo: '',
            telefono: '',
        };
    }

    try {
        const res = await getCompanies(pagination.value, filters);
        const { error, mensaje, empresas, totalPaginas } = res;

        if (!error) {
            companies.value = empresas;
            totalPages.value = totalPaginas;
            showMessageCompanies.value = false;
            messageCompanies.value = '';
            if (empresas.length == 0) {
                showMessageCompanies.value = true;
                messageCompanies.value = mensaje;
            }
        } else {
            showMessageCompanies.value = true;
            messageCompanies.value = mensaje;

            showAlert({ 
                title: '¡ERROR!', 
                message: mensaje, 
                icon: 'error',
            });
        }
    } catch (error) {
        showAlert({ 
            title: '¡ERROR!', 
            message: error, 
            icon: 'error',
        });
    }

    loaderCompanies.value = false;
}

const loadView = async () => {
    await loadCompanies();
}

const modalCompany = (conf) => {
    const { action, company = {} } = conf;

    switch (action) {
        case 'Agregar':
            newCompany();
            break;

        case 'Cancelar':
            resetForm();
            break;

        case 'Editar':
            actionCompany.value = 'Editar';
            if (Object.keys(company).length == 0) editCompany();
            else setInfoCompany(company);
            break;

        case 'Nuevo':
            actionCompany.value = 'Agregar';
            break;

        default:
            resetForm();
            break;
    }
}

const newCompany = async () => {
    loaderModal.value = true;
    hideErrors();

    const { error, message, field } = validateForm();

    if (error) {
        loaderModal.value = false;
        showTab({ field });
        setError({ message, field });
        return
    }

    const company = companyForm.value;

    const res = await addCompany(company);

    if (!res.error) {
        document.getElementById('btn-modal').click();
        resetForm();
        showAlert({
            title: '¡ÉXITO!',
            message: res.mensaje,
            icon: 'success'
        })
        await loadCompanies();
        loaderModal.value = false;
    } else {
        showAlert({
            title: '¡ERROR!',
            message: res.mensaje,
            icon: 'error'
        })
        loaderModal.value = false;
    }
}

const next = async () => {
    pagination.value.page++;
    await loadCompanies();
}

const optionStatus = (value) => {
    companyForm.value.estatus = value;
}

const previous = async () => {
    const page = pagination.value.page - 1
    console.log(page);
    pagination.value.page = page == 0 ? 1 : page;
    await loadCompanies();
}

const resetForm = () => {
    loaderModal.value = false;

    document.getElementById('general-tab').click();

    hideErrors();

    actionCompany.value = '';

    companyForm.value = {
        estatus: 'Activo',
        nombre: '',
        landing: '',
        correo: '',
        telefono: '',
        logotipo: '',
        calle: '',
        noInterior: '',
        noExterior: '',
        codigoPostal: '',
        colonia: '',
        municipio: '',
        estado: '',
    };
}

const search = async () => {
    const value = searchForm.value;
    await loadCompanies();
}

const statusSelected = (status) => {
    const optionSelected = companyForm.value.estatus;

    const option = statusOptions.value.find(key => {
        return key.value == status;
    });

    return option ? option.label : '';
}

const setClassStatus = (status) => {
    if (status == 'Activo') return 'fa-solid fa-circle-dot me-2 active'
    else return 'fa-solid fa-circle-dot me-2 suspend'
}

const setError = (conf) => {
    const { field, message } = conf;

    errorMessage.value = message;

    const input = document.getElementById(`${field}`);
    input.focus();

    const small = document.getElementById(`${field}-error`);
    small.style.display = 'block';
}

const setInfoCompany = (company) => {
    const { estatus, id, nombre, landing, correo, telefono, direccion } = company;

    const form = companyForm.value;

    const temp = direccion.split(',');
    const calle = temp[0];

    const numeros = temp[1];
    const temp2 = numeros.split('-');

    const noInterior = temp2[0];

    let noExterior = '';
    if (temp2[1]) {
        noExterior = temp2[1];
    }

    const codigoPostal = temp[2];
    const colonia = temp[3];
    const municipio = temp[4];
    const estado = temp[5];

    companyId.value = id;
    form.estatus = estatus;
    form.nombre = nombre;
    form.landing = landing;
    form.correo = correo;
    form.telefono = telefono;
    form.calle = calle;
    form.noInterior = noInterior;
    form.noExterior = noExterior;
    form.codigoPostal = codigoPostal;
    form.colonia = colonia;
    form.municipio = municipio;
    form.estado = estado;
}

const setDefaultLogotipo = (id) => {
    const urlDefault = 'https://placehold.co/600x400/png?text=LOGO';
    document.getElementById(`${id}`).src = urlDefault;
}

const showTab = ({ field }) => {
    const fieldsGeneral = ['nombre', 'landing', 'correo', 'telefono', 'logotipo'];
    const fieldsAddress = ['calle', 'noInterior', 'noExterior', 'codigoPostal', 'colonia', 'municipio', 'estado'];

    if (fieldsGeneral.includes(field)) document.getElementById('general-tab').click();
    if (fieldsAddress.includes(field)) document.getElementById('address-tab').click();
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

const suspend = async (company) => {
    const customClass = {
        confirmButton: 'btn btn-sm btn-outline-primary rounded-1',
        cancelButton: 'btn btn-sm btn-outline-primary rounded-1'
    };

    Swal.fire({
        title: 'Suspender Empresa',
        text: '¿Realmente desea suspender esta empresa?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, Suspender',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
        customClass: customClass
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await suspendCompany(company);
            const { error, mensaje } = res;
            if (error) showAlert({ title: '¡ERROR!', message: res.mensaje, icon: 'error' })
            else showAlert({ title: '¡ÉXITO!', message: res.mensaje, icon: 'success' })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            /*  */
        }
    });
}

const uploader = async ({ action, file, extensions }) => {
    switch (action) {
        case 'Subir':
            const res1 = await uploadFile({
                extensions: extensions,
                file: file
            });

            if (!res1.error) { fileTemp.value = file }
            break;

        case 'Eliminar':
            await deleteFile({
                file: file
            });
            break;

        default:
            break;
    }
}

const validateForm = () => {
    const form = companyForm.value;
    for (const field in form) {
        if (Object.hasOwnProperty.call(form, field)) {
            const value = form[field];
            if (actionCompany.value != 'Editar') {
                if (value == '') return { error: true, message: 'Error: Campo requerido', field: field }
            } else {
                if (field != 'logotipo') {
                    if (value == '') return { error: true, message: 'Error: Campo requerido', field: field }
                }
            }
        }
    }

    return { error: false, message: '', field: '' }
}
</script>