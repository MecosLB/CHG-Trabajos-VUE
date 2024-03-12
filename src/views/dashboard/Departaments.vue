<template>
    <section id="departments" class="mt-3">
        <div class="container-fluid mb-4">
            <Breadcrumb :moduleName="'Departamentos'" />
        </div>

        <div class="container d-flex flex-column gap-5 mt-3">
            <button @click="updateTitle" class="btn-main btn px-5 rounded-5 w-auto ms-auto" data-bs-toggle="modal"
                data-bs-target="#deptModal">
                <i class="fa-solid fa-plus"></i> Añadir
            </button>

            <table v-if="departments.length" class="table departments table-striped text-center align-middle">
                <thead>
                    <tr>
                        <th scope="col">
                            <div class="d-flex justify-content-center align-items-center gap-2">
                                Estatus
                                <div class="dropend">
                                    <button class="btn btn-secondary" type="button" data-bs-toggle="dropdown"
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
                        <th scope="col">
                            <div class="d-flex justify-content-center align-items-center gap-2">
                                Nombre
                                <div class="dropend">
                                    <button class="btn btn-secondary" type="button" data-bs-toggle="dropdown"
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
                    <tr v-for="{ id, estatus, nombre } of departments">
                        <td :class="`fw-bold text-${estatus === 'Activo' ? 'success' : 'danger'}`">
                            <i :class="`fa-${estatus === 'Activo' ? 'solid' : 'regular'} fa-circle`"></i> {{ estatus }}
                        </td>
                        <td>
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

        <!-- Modal Editar usuario -->
        <div class="modal fade" id="deptModal" tabindex="-1" aria-labelledby="deptModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5 fw-bold" id="deptModalLabel">{{ deptTitle }} departamento {{
                deptTitle
                    ===
                    'Editar' ? `: ${activeDept.nombre}` : null }}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body needs-validation" novalidate>
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-suitcase"></i>
                            </span>
                            <input @change="onChangeInput" type="text" v-model="activeDept.nombre" class="form-control"
                                name="name" placeholder="Departamento">
                            <div class="invalid-feedback">
                                Favor de ingresar un nombre.
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>

                        <button @click="modalDept" type="button" class="btn btn-main">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import DeptOptions from '@/components/dashboard/DeptOptions.vue';
import Breadcrumb from '@/components/dashboard/Breadcrumb.vue';
import { createDepartment, getDepartments, updateDepartment, deleteDepartment } from '@/helpers/departments';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';

const departments = ref([]),
    deptTitle = ref('Añadir'),
    activeDept = ref({
        id: '',
        idEmpresa: '4009fd7d-de5a-4997-8f63-e27d9c34ff34',
        estatus: '',
        nombre: '',
    }),
    filterDept = ref({
        estatus: '',
        nombre: '',
    });

const mensaje = ref("No existen departamentos registrados");

let deptModal = null;

onMounted(async () => {
    deptModal = document.getElementById('deptModal');

    const { departamentos } = await getDepartments({});
    departments.value = departamentos;

    // Modal events
    deptModal.addEventListener('hidden.bs.modal', e => {
        const invalidInputsDOM = document.querySelectorAll('.is-invalid');

        for (const input of invalidInputsDOM)
            input.classList.remove('is-invalid');
    });
});

// Ref functions
const emptyDept = () => {
    activeDept.value = {
        ...activeDept.value,
        id: '',
        estatus: '',
        nombre: '',
    }
}

const updateTitle = ({ currentTarget }) => {
    const isNewDept = currentTarget.classList.contains('btn-main');
    deptTitle.value = isNewDept ? 'Añadir' : 'Editar';

    setActiveDept(currentTarget.getAttribute('deptId'));
}

const setActiveDept = (deptId) => {
    if (!deptId) return emptyDept();

    const { id, estatus, nombre } = departments.value.filter(({ id }) => id === deptId)[0];
    activeDept.value = {
        ...activeDept.value,
        id: id,
        estatus: estatus,
        nombre: nombre,
    }
}

// General functions
const hideModal = () => {
    document.querySelector('.btn-close').click();
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
        const filterObj = filterDept.value;
        filterObj.estatus = '';
        filterObj.nombre = '';

        return Swal.fire({
            html: `<h3 class='fw-bold'>
                    Lo sentimos.
                </h3>
                <p class='text-base'>
                    No hay resultados para su búsqueda.
                </p>`,
            icon: 'info',
            confirmButtonText: 'Cerrar',
            width: '400px',
        });
    }

    if (erroGet)
        return console.warn(msgGet);

    departments.value = departamentos;
}

const onDeptCreate = async () => {
    const { error: errorCreate, mensaje: msgCreate } = await createDepartment({ ...activeDept.value });
    if (errorCreate)
        return console.warn(msgCreate);

    const { error: errorGet, mensaje: msgGet, departamentos = [] } = await getDepartments({});
    if (errorGet)
        return console.warn(msgGet);

    departments.value = departamentos;
    hideModal();

    Swal.fire({
        title: `<h3 class='fw-bold'>
                    ${msgCreate}
                </h3>`,
        icon: 'success',
        confirmButtonText: 'Cerrar',
        width: '400px',
    });
}

const onDeptUpdate = async () => {
    const { error: errorUpdate, mensaje: msgUpdate } = await updateDepartment({ ...activeDept.value });
    if (errorUpdate)
        return console.warn(msgUpdate);

    const { error: errorGet, mensaje: msgGet, departamentos = [] } = await getDepartments({});
    if (errorGet)
        return console.warn(msgGet);

    departments.value = departamentos;
    hideModal();

    Swal.fire({
        title: `<h3 class='fw-bold'>
                    ${msgUpdate}
                </h3>`,
        icon: 'success',
        confirmButtonText: 'Cerrar',
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
        title: `<h3 class='fw-bold'>
                    ¿Desea ${activeDept.value.estatus === 'Activo' ? 'inhabilitar' : 'habilitar'} el departamento: ${activeDept.value.nombre}?
                </h3>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        // confirmButtonColor: "#3085d6",
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "#d33",
        width: '500px',
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
            confirmButtonText: 'Cerrar',
            width: '400px',
        });

        const { error: errorGet, mensaje: msgGet, departamentos = [] } = await getDepartments({});
        if (errorGet)
            return console.warn(msgGet);

        departments.value = departamentos;
        emptyDept();
    });
}

const onDeptDelete = async ({ currentTarget }) => {
    const deptId = currentTarget.getAttribute('deptId');
    setActiveDept(deptId);

    Swal.fire({
        title: `<h3 class='fw-bold'>
                    ¿Desea eliminar el departamento: ${activeDept.value.nombre}?
                </h3>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        // confirmButtonColor: "#3085d6",
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "#d33",
        width: '500px',
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
            confirmButtonText: 'Cerrar',
            width: '400px',
        });

        const { error: errorGet, mensaje: msgGet, departamentos = [] } = await getDepartments({});
        if (errorGet)
            return console.warn(msgGet);

        departments.value = departamentos;
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
</script>