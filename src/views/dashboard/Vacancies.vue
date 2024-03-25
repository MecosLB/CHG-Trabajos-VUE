<template>
    <section id="vacancies" class="container-fluid">
        <Breadcrumb :moduleName="'Vacantes'" class="mb-4" />

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

                <div v-if="isSuperAdmin()" class="company-filter input-group ms-auto">
                    <span class="input-group-text">
                        <i class="fa-solid fa-building"></i>
                    </span>
                    <select @change="displayVacancies" class="form-control form-control-sm rounded-5"
                        v-model="filters.idEmpresa">
                        <option value="">Seleccionar empresa...</option>

                        <template v-if="companies.length">
                            <option v-for="{ id, nombre } of companies" :value="id">
                                {{ nombre }}
                            </option>
                        </template>
                    </select>
                </div>

                <button @click="updateTitle"
                    :class="`btn-main btn btn-sm btn-outline-primary px-5 rounded-5 ${isSuperAdmin() ? 'ms-3' : 'ms-auto'}`"
                    data-bs-toggle="modal" data-bs-target="#vacancieModal">
                    <i class="fa-solid fa-plus"></i> Agregar Vacante
                </button>
            </div>

            <template v-if="loaderSearch">
                <div class="m-4">
                    <div class="loader-companies"></div>
                </div>
            </template>

            <div class="grid-vacancies row">

                <div v-if="vacancies.length"
                    v-for="{ id, estatus, titulo, departamento, empresa, direccion, ultimaActualizacion, nombreUsuario, fechaCaducidad, candidatos, candidatosPorRevisar } of vacancies"
                    class="col-12 py-2 animate__animated animate__fadeIn" :key="id">

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

                        <router-link :to="{ name: candidatos !== '0' && 'vacancie', params: { vacancieId: id } }"
                            class="col-2 text-center candidates">
                            <strong :class="candidatos === '0' ? 'red' : 'green'">{{ `${candidatos} ${candidatos ===
            '1'
            ?
            'candidato' :
            'candidatos'}` }}
                            </strong>
                            {{ `${candidatosPorRevisar !== '0' ? `${candidatosPorRevisar} por revisar` : ''}` }}
                        </router-link>

                        <span class="col-2 options">
                            <VacancieOptions :vacancieId="id" :vacancieStatus="estatus"
                                :onVacancieUpdateStatus="onVacancieUpdateStatus" :updateTitle="updateTitle" />
                        </span>
                    </article>

                </div>

                <article v-else class="col-12 alert alert-danger text-center fw-bold">
                    {{ mensaje }}
                </article>
            </div>
        </template>

        <VacancieModal :isSuperAdmin="isSuperAdmin" :departments="departments" :companies="companies"
            :displayDepartments="displayDepartments" :vacancieTitle="vacancieTitle" :activeVacancie="activeVacancie"
            :modalVacancie="modalVacancie" :updateContent="updateContent" :questions="questions"
            :addQuestion="addQuestion" :deleteQuestion="deleteQuestion" />
    </section>
</template>

<script setup>
import Loader from '@/components/Loader.vue';
import Breadcrumb from '@/components/dashboard/Breadcrumb.vue';
import VacancieOptions from '@/components/dashboard/VacancieOptions.vue';
import { createVacancie, getVacancies, updateVacancie } from '@/helpers/dashboard/vacancies';
import { getCompanies } from '@/helpers/dashboard/companies';
import { getDepartments } from '@/helpers/dashboard/departments';
import { updateStatusVacancie } from '@/helpers/dashboard/vacancies';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';
import VacancieModal from '@/components/dashboard/VacancieModal.vue';

const vacancies = ref([]),
    companies = ref([]),
    departments = ref([]),
    questions = ref([]);
const pagination = ref({
    page: 1,
    results: 5,
}),
    filters = ref({
        idEmpresa: '',
    }),
    activeVacancie = ref({
        id: '',
        position: '',
        status: '',
        companyId: '',
        departmentId: '',
        description: '',
        salary: '',
        workHour: '',
        startDate: '',
        endDate: '',
        additionalQuestion: [],
    });

const totalPages = ref(1),
    loader = ref(true),
    loaderSearch = ref(true),
    mensaje = ref('No se encontraron vacantes'),
    vacancieTitle = ref('Añadir');

const statusClass = {
    'Activo': 'active',
    'Suspendido': 'suspended',
    'Finalizado': 'ended',
    'Pendiente': 'paused',
}
const customClass = {
    confirmButton: 'btn btn-sm btn-outline-primary rounded-1',
    cancelButton: 'btn btn-sm btn-outline-primary rounded-1'
}
let vacancieModal = null;

onMounted(async () => {
    vacancieModal = document.getElementById('vacancieModal');
    await displayVacancies();

    if (isSuperAdmin())
        await displayCompanies();

    if (!isSuperAdmin())
        await displayDepartments();

    loader.value = false;

    // Modal events
    vacancieModal.addEventListener('hidden.bs.modal', e => {
        const invalidInputsDOM = document.querySelectorAll('.is-invalid');

        for (const input of invalidInputsDOM)
            input.classList.remove('is-invalid');
    });
});

// Ref functions
const displayVacancies = async () => {
    loaderSearch.value = true;

    const { idEmpresa } = filters.value;
    const { error: erroGet, mensaje: msgGet, vacantes, totalPaginas } = await getVacancies({ ...pagination.value }, { ...filters.value });

    totalPages.value = totalPaginas || 1;

    console.log(totalPaginas);

    if (idEmpresa && Math.ceil(totalPages.value) < pagination.value.page) {
        pagination.value.page = 1;
        return await displayVacancies();
    }

    vacancies.value = vacantes || [];

    loaderSearch.value = false;
}

const nextPage = async () => {
    pagination.value.page++;
    await displayVacancies();
}

const prevPage = async () => {
    const newPage = pagination.value.page - 1;
    pagination.value.page = newPage < 1 ? 1 : newPage;
    await displayVacancies();
}

const displayCompanies = async () => {
    const { error: erroGet, mensaje: msgGet, empresas } = await getCompanies({ page: 1, results: 30 }, { estatus: 'Activo' });
    if (erroGet)
        console.warn(msgGet);

    companies.value = empresas || [];
}

const displayDepartments = async ({ target = '' } = {}) => {
    let { id: selectedCompany } = JSON.parse(localStorage.company);

    if (isSuperAdmin())
        selectedCompany = target.value;

    const { error: errorGet, mensaje: msgGet, departamentos } = await getDepartments({ estatus: 'Activo', idEmpresa: selectedCompany });
    if (errorGet)
        console.warn(msgGet);

    departments.value = departamentos || [];
    activeVacancie.value = {
        ...activeVacancie.value,
        departmentId: '',
    }
}

const emptyVacancie = () => {
    const quillEditor = document.querySelector('.ql-editor');
    quillEditor.innerHTML = '';

    if (isSuperAdmin())
        departments.value = [];

    for (const key in activeVacancie.value) {
        if (key === 'additionalQuestion') {
            activeVacancie.value[key] = [];
            continue;
        }

        activeVacancie.value[key] = '';
    }
}

const updateTitle = async ({ currentTarget }) => {
    const generalTabDOM = document.querySelector('#generalTab');
    const isNewVacancie = currentTarget.classList.contains('btn-main');
    vacancieTitle.value = isNewVacancie ? 'Añadir' : (currentTarget.classList.contains('btn-duplicate') ? 'Duplicar' : 'Editar');

    generalTabDOM.click();
    await setActiveVacancie(currentTarget.getAttribute('vacancieId'));
}

const setActiveVacancie = async (vacancieId) => {
    if (!vacancieId) return emptyVacancie();

    const { id: currentId, titulo, estatus, idEmpresa, departamento, descripcion, salario, jornada, fechaPublicacion, fechaCaducidad, preguntas } = vacancies.value.find(({ id }) => id === vacancieId);

    // Update vacancie info
    activeVacancie.value = {
        ...activeVacancie.value,
        id: currentId,
        position: titulo,
        status: estatus,
        companyId: idEmpresa,
        description: descripcion,
        salary: salario.split(',').join(''),
        workHour: jornada,
        startDate: formatDate(fechaPublicacion),
        endDate: formatDate(fechaCaducidad),
        additionalQuestion: JSON.parse(preguntas),
    };

    const { error: errorGet, mensaje: msgGet, departamentos } = await getDepartments({ estatus: 'Activo', idEmpresa: idEmpresa });
    if (errorGet)
        console.warn(msgGet);

    departments.value = departamentos || [];

    // Update vacancie department id
    const { id: departmentId } = departments.value.find(({ nombre }) => nombre === departamento);
    activeVacancie.value = {
        ...activeVacancie.value,
        departmentId: departmentId,
    };
}

const updateContent = (content) => {
    activeVacancie.value = {
        ...activeVacancie.value,
        description: content,
    }
}

const addQuestion = (questionType) => {
    if (!questionType) return;

    const questionTextDOM = document.querySelector('input[name=questionText]'),
        questionAnswerDOM = document.querySelectorAll('input[name=answer]');
    const answers = [];

    if (!questionTextDOM.value)
        return Swal.fire({
            title: `<h3 class='fw-bold'>
                    Es necesario escribir la pregunta
                </h3>`,
            icon: 'warning',
            showConfirmButton: false,
            showCloseButton: true,
            width: '400px',
        });

    // Add answers to array in case it is a multiple choice question
    for (const answerDOM of questionAnswerDOM) {
        if (!answerDOM.value) continue;

        answers.push(answerDOM.value);
    }

    if (questionType !== 'text' && answers.length < 2)
        return Swal.fire({
            title: `<h3 class='fw-bold'>
                    Es necesario agregar mínimo 2 respuestas a la pregunta
                </h3>`,
            icon: 'warning',
            showConfirmButton: false,
            showCloseButton: true,
            width: '400px',
        });

    // Add the question to the ref
    activeVacancie.value.additionalQuestion.push({
        tipo: questionType,
        label: questionTextDOM.value,
        valores: answers,
    });

    // Empty fields
    questionTextDOM.value = '';
}

const deleteQuestion = (questionIndex = 0) => {
    let questions = activeVacancie.value.additionalQuestion;

    if (!questions.length) return;

    activeVacancie.value = {
        ...activeVacancie.value,
        additionalQuestion: [...questions.filter((question, index) => index !== questionIndex)]
    }
}

// General functions
const hideModal = () => {
    document.querySelector('.btn-close').click();
}

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

const formatDate = (date = '') => {
    const splitDate = date.split('-');
    return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
}

const isSuperAdmin = ({ profile } = JSON.parse(localStorage.user)) => {
    return profile === 'Super Administrador';
}

const validateFields = () => {
    const quillEditor = document.querySelector('.ql-editor');
    const inputsDom = document.querySelectorAll('.needs-validation input'),
        selectsDom = document.querySelectorAll('.needs-validation select');
    const fields = [...inputsDom, ...selectsDom];

    for (const field of fields) {
        if (!field.value) {
            field.classList.add('is-invalid');
            continue;
        }

        field.classList.remove('is-invalid');
    }

    if (quillEditor.innerHTML === '<p><br></p>')
        quillEditor.parentElement.classList.add('is-invalid');
    else
        quillEditor.parentElement.classList.remove('is-invalid');

    return document.querySelectorAll('.is-invalid').length;
}

const onVacancieUpdateStatus = async (vacancieId = '', status = 'Activo') => {
    const statusText = {
        'Activo': 'activar',
        'Suspendido': 'suspender',
        'Finalizado': 'finalizar',
        'Eliminado': 'eliminar',
    }
    const selectedVacancie = vacancies.value.find(({ id }) => id === vacancieId);
    const actionText = statusText[status].charAt(0).toUpperCase() + statusText[status].slice(1);

    Swal.fire({
        title: `${actionText} Vacante`,
        text: `¿Realmente desea ${statusText[status]} la vacante: ${selectedVacancie.titulo} de ${selectedVacancie.empresa}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: actionText,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "#d33",
        width: '500px',
        reverseButtons: true,
        customClass: customClass,
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        const { error: errorUpdateStatus, mensaje: msgUpdateStatus } = await updateStatusVacancie({ ...selectedVacancie }, status);
        if (errorUpdateStatus)
            return console.warn(msgUpdateStatus);

        Swal.fire({
            title: `<h3 class='fw-bold'>
            ${msgUpdateStatus}
        </h3>`,
            icon: 'success',
            showConfirmButton: false,
            showCloseButton: true,
            width: '400px',
        });

        await displayVacancies();
    });
}

const onVacancieCreate = async () => {
    const { error: errorCreate, mensaje: msgCreate } = await createVacancie({ ...activeVacancie.value });
    if (errorCreate)
        return console.warn(msgCreate);

    hideModal();
    await displayVacancies();

    Swal.fire({
        title: `<h3 class='fw-bold'>
                    ${msgCreate}
                </h3>`,
        icon: 'success',
        showConfirmButton: false,
        showCloseButton: true,
        width: '400px',
    });
}

const onVacancieUpdate = async () => {
    const { error: errorUpdate, mensaje: msgUpdate } = await updateVacancie({ ...activeVacancie.value });
    if (errorUpdate)
        return console.warn(msgUpdate);

    hideModal();
    await displayVacancies();

    Swal.fire({
        title: `<h3 class='fw-bold'>
                    ${msgUpdate}
                </h3>`,
        icon: 'success',
        showConfirmButton: false,
        showCloseButton: true,
        width: '400px',
    });
}

const modalVacancie = ({ target }) => {
    if (validateFields()) return;

    switch (vacancieTitle.value) {
        case 'Añadir':
        case 'Duplicar':
            onVacancieCreate();
            break;
        case 'Editar':
            onVacancieUpdate();
            break;
    }
}
</script>