<template>
    <section id="departments">
        <div class="container-fluid mb-4">
            <Breadcrumb :moduleName="'Departamentos'" />
        </div>

        <div class="container d-flex flex-column gap-5 mt-3 align-items-end">
            <div class="w-100 d-flex align-items-center justify-content-between">
                <button v-if="filterDept.nombre || filterDept.estatus || filterDept.idEmpresa" @click="clearFilter"
                    class="btn btn-sm btn-outline-danger px-5 rounded-5">
                    <i class="fa-solid fa-trash"></i> Borrar Filtros
                </button>

                <button @click="updateTitle" class="btn-main btn btn-sm btn-outline-primary px-5 rounded-5 ms-auto"
                    data-bs-toggle="modal" data-bs-target="#deptModal">
                    <i class="fa-solid fa-plus"></i> Agregar Departamento
                </button>
            </div>

            <table v-if="departments.length" class="table departments table-striped text-center align-middle">
                <thead>
                    <tr class="align-middle">
                        <th scope="col">
                            <div class="d-flex justify-content-center align-items-center gap-2">
                                Estatus
                                <div class="dropend">
                                    <button class="btn-icon" type="button" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <i class="fa-solid fa-filter"></i>
                                    </button>

                                    <ul class="dropdown-menu p-2">
                                        <li>
                                            <label for="statusFilter">Estatus:</label>
                                            <select @change="onDeptFilter" v-model="filterDept.estatus"
                                                class="form-control" name="statusFilter">
                                                <option value="">Seleccionar...</option>
                                                <option value="Activo">Activo</option>
                                                <option value="Suspendido">Suspendido</option>
                                            </select>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th v-if="isSuperAdmin()" scope="col">
                            <div class="d-flex justify-content-center align-items-center gap-2">
                                Empresa
                                <div class="dropend">
                                    <button class="btn-icon" type="button" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <i class="fa-solid fa-filter"></i>
                                    </button>

                                    <ul class="dropdown-menu p-2">
                                        <li>
                                            <label for="statusFilter">Empresa:</label>
                                            <select @change="onDeptFilter" v-model="filterDept.idEmpresa"
                                                class="form-control" name="statusFilter">
                                                <option value="">Seleccionar...</option>

                                                <template v-if="companies.length">
                                                    <option v-for="{ id, nombre } of companies" :value="id">
                                                        {{ nombre }}
                                                    </option>
                                                </template>
                                            </select>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-center align-items-center gap-2">
                                Nombre
                                <div class="dropend">
                                    <button class="btn-icon" type="button" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <i class="fa-solid fa-filter"></i>
                                    </button>

                                    <ul class="dropdown-menu p-2">
                                        <li>
                                            <label for="nameFilter">Nombre:</label>
                                            <input @change="onDeptFilter" v-model="filterDept.nombre"
                                                class="form-control" type="text" name="nameFilter"
                                                placeholder="Filtros...">
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th scope="col">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="{ id, estatus, nombre, empresa='' } of departments">
                        <td class="fw-bold status-company">
                            <i :class="`fa-solid fa-circle-dot ${estatus === 'Activo' ? 'active' : 'suspend'}`"></i> {{
                estatus }}
                        </td>
                        <td v-if="empresa && isSuperAdmin()" class="fw-bold">
                            {{ empresa }}
                        </td>
                        <td class="fw-bold">
                            {{ nombre }}
                        </td>
                        <td>
                            <DeptOptions :deptId="id" :deptStatus="estatus" :updateTitle="updateTitle"
                                :updateStatus="updateStatus" :onDeptDelete="onDeptDelete" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-else class="w-100 alert alert-danger text-center fw-bold">
                {{ mensaje }}
            </div>
        </div>

        <!-- Modal Editar departamento -->
        <div class="modal fade" id="deptModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="deptModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h6 class="modal-title" id="deptModalLabel">{{ deptTitle }} departamento {{
                deptTitle
                    ===
                    'Editar' ? `: ${activeDept.nombre}` : null }}</h6>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="modal-body row needs-validation">
                        <div v-if="isSuperAdmin() && deptTitle === 'Añadir'" class="col-12 mb-2">
                            <label for="company" class="form-label">Empresa:</label>
                            <select @change="onChangeInput" v-model="activeDept.idEmpresa"
                                class="form-control form-control-sm" name="company">
                                <option value="" selected>Seleccionar empresa...</option>

                                <template v-if="companies.length">
                                    <option v-for="{ id, nombre } of companies" :value="id">
                                        {{ nombre }}
                                    </option>
                                </template>
                            </select>
                            <div class="invalid-feedback">
                                Favor de seleccionar un empresa.
                            </div>
                        </div>

                        <div class="col-12 mb-2">
                            <label for="name" class="form-label">Departamento:</label>
                            <input @change="onChangeInput" type="text" v-model="activeDept.nombre"
                                class="form-control form-control-sm" name="name">
                            <div class="invalid-feedback">
                                Favor de ingresar un nombre de departamento.
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-outline-primary"
                            data-bs-dismiss="modal">Cancelar</button>

                        <button @click="modalDept" type="button" class="btn btn-sm btn-outline-primary">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import DeptOptions from '@/components/dashboard/DeptOptions.vue';
import Breadcrumb from '@/components/dashboard/Breadcrumb.vue';
import { createDepartment, getDepartments, updateDepartment, deleteDepartment } from '@/helpers/dashboard/departments';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';
import { getCompanies } from '@/helpers/dashboard/companies';

const departments = ref([]),
    companies = ref([]),
    deptTitle = ref('Añadir'),
    activeDept = ref({
        id: '',
        idEmpresa: '',
        estatus: '',
        nombre: '',
    }),
    filterDept = ref({
        estatus: '',
        nombre: '',
        idEmpresa: '',
    });

const mensaje = ref("No existen departamentos registrados");

const customClass = {
    confirmButton: 'btn btn-sm btn-outline-primary rounded-1',
    cancelButton: 'btn btn-sm btn-outline-primary rounded-1'
}
let deptModal = null;

onMounted(async () => {
    deptModal = document.getElementById('deptModal');

    const { departamentos } = await getDepartments({});
    departments.value = departamentos || [];

    if (isSuperAdmin())
        await displayCompanies();

    // Modal events
    deptModal.addEventListener('hidden.bs.modal', e => {
        const invalidInputsDOM = document.querySelectorAll('.is-invalid');

        for (const input of invalidInputsDOM)
            input.classList.remove('is-invalid');
    });
});

// Ref functions
const emptyDept = () => {
    for (const key in activeDept.value)
        activeDept.value[key] = '';
}

const updateTitle = ({ currentTarget }) => {
    const isNewDept = currentTarget.classList.contains('btn-main');
    deptTitle.value = isNewDept ? 'Añadir' : 'Editar';

    setActiveDept(currentTarget.getAttribute('deptId'));
}

const clearFilter = async () => {
    filterDept.value = {
        estatus: '',
        nombre: '',
        idEmpresa: '',
    };

    const { error: erroGet, mensaje: msgGet, departamentos = [] } = await getDepartments({ ...filterDept.value });

    if (erroGet)
        return console.warn(msgGet);

    departments.value = departamentos || [];
}

const setActiveDept = (deptId) => {
    if (!deptId) return emptyDept();

    const { id, idEmpresa, estatus, nombre } = departments.value.find(({ id }) => id === deptId);
    activeDept.value = {
        id: id,
        idEmpresa: idEmpresa,
        estatus: estatus,
        nombre: nombre,
    }
}
const displayCompanies = async () => {
    const { error: erroGet, mensaje: msgGet, empresas } = await getCompanies({ page: 1, results: 30 }, { estatus: 'Activo' });
    if (erroGet)
        console.warn(msgGet);

    companies.value = empresas || [];
}

// General functions
const hideModal = () => {
    document.querySelector('.btn-close').click();
}

const isSuperAdmin = ({ profile } = JSON.parse(localStorage.user)) => {
    return profile === 'Super Administrador';
}

const validateFields = () => {
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

    return document.querySelectorAll('.is-invalid').length;
}

const onChangeInput = ({ target }) => {
    if (!target.value) return;

    target.classList.remove('is-invalid');
}

const onDeptFilter = async () => {
    const { error: erroGet, mensaje: msgGet, departamentos = [] } = await getDepartments({ ...filterDept.value });

    if (!departamentos.length) {
        await clearFilter();

        return Swal.fire({
            html: `<h3 class='fw-bold'>
                    Lo sentimos.
                </h3>
                <p class='text-base'>
                    No hay resultados para su búsqueda.
                </p>`,
            icon: 'info',
            showConfirmButton: false,
            showCloseButton: true,
            width: '400px',
        });
    }

    if (erroGet)
        return console.warn(msgGet);

    departments.value = departamentos || [];
}

const onDeptCreate = async () => {
    const { error: errorCreate, mensaje: msgCreate } = await createDepartment({ ...activeDept.value });
    if (errorCreate)
        return console.warn(msgCreate);

    const { error: errorGet, mensaje: msgGet, departamentos = [] } = await getDepartments({});
    departments.value = departamentos || [];
    hideModal();

    if (errorGet)
        return console.warn(msgGet);

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

const onDeptUpdate = async () => {
    const { error: errorUpdate, mensaje: msgUpdate } = await updateDepartment({ ...activeDept.value });
    if (errorUpdate)
        return console.warn(msgUpdate);

    const { error: errorGet, mensaje: msgGet, departamentos = [] } = await getDepartments({});
    departments.value = departamentos || [];
    hideModal();

    if (errorGet)
        return console.warn(msgGet);

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

const updateStatus = async ({ currentTarget }) => {
    const statusDict = {
        'Activo': 'Suspendido',
        'Suspendido': 'Activo',
    }
    const deptId = currentTarget.getAttribute('deptId');
    setActiveDept(deptId);

    Swal.fire({
        title: `${activeDept.value.estatus === 'Activo' ? 'Suspender' : 'Activar'} Departamento`,
        text: `¿Realmente desea ${activeDept.value.estatus === 'Activo' ? 'suspender' : 'activar'} el departamento: ${activeDept.value.nombre}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "#d33",
        width: '500px',
        reverseButtons: true,
        customClass: customClass,
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        activeDept.value = {
            ...activeDept.value,
            estatus: statusDict[activeDept.value.estatus],
        }

        const { error: errorUpdate, mensaje: msgUpdate } = await updateDepartment({ ...activeDept.value });
        if (errorUpdate)
            return console.warn(msgUpdate);

        Swal.fire({
            title: `<h3 class='fw-bold'>
                    ¡Departamento ${activeDept.value.estatus === 'Activo' ? 'habilidato' : 'inhabilitado'}!
                </h3>`,
            icon: 'success',
            showConfirmButton: false,
            showCloseButton: true,
            width: '400px',
        });

        const { error: errorGet, mensaje: msgGet, departamentos = [] } = await getDepartments({});
        if (errorGet)
            return console.warn(msgGet);

        departments.value = departamentos || [];
        emptyDept();
    });
}

const onDeptDelete = async ({ currentTarget }) => {
    const deptId = currentTarget.getAttribute('deptId');
    setActiveDept(deptId);

    Swal.fire({
        title: 'Eliminar Departamento',
        text: `¿Realmente desea eliminar el departamento: ${activeDept.value.nombre}?`,
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

        const { error: errorDelete, mensaje: msgDelete } = await deleteDepartment({ ...activeDept.value });
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

        const { error: errorGet, mensaje: msgGet, departamentos = [] } = await getDepartments({});
        departments.value = departamentos || [];
        if (errorGet)
            return console.warn(msgGet);
    });

}

const modalDept = ({ target }) => {
    if (validateFields()) return;

    switch (deptTitle.value) {
        case 'Añadir':
            onDeptCreate();
            break;
        case 'Editar':
            onDeptUpdate();
            break;
    }
}
</script>@/helpers/dashboard/departments