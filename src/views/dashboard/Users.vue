<template>
    <section id="users" class="container-fluid">
        <Breadcrumb :moduleName="'Usuarios'" class="mb-4" />

        <div v-if="loader" class="loader-view">
            <Loader />
        </div>

        <div v-else class="container d-flex flex-column gap-5 mt-3 align-items-end">
            <button @click="updateTitle" class="btn-main btn btn-sm btn-outline-primary rounded-5"
                data-bs-toggle="modal" data-bs-target="#userModal">
                <i class="fa-solid fa-plus"></i> Agregar Usuario
            </button>

            <table v-if="users.length"
                class="table users table-striped text-center align-middle animate__animated animate__fadeIn">
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
                                            <select @change="onUserFilter" v-model="filterUser.estatus"
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
                                    <button class="btn-icon" type="button" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <i class="fa-solid fa-filter"></i>
                                    </button>

                                    <ul class="dropdown-menu p-2">
                                        <li>
                                            <label for="nameFilter">Nombre:</label>
                                            <input @change="onUserFilter" v-model="filterUser.nombre"
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
                    <tr v-for="{ id, estatus, nombre } of users">
                        <td class="fw-bold status-company">
                            <i :class="`fa-solid fa-circle-dot ${estatus === 'Activo' ? 'active' : 'suspend'}`"></i> {{
            estatus }}
                        </td>
                        <td class="fw-bold">
                            {{ nombre }}
                        </td>
                        <td>
                            <UsersOptions :userId="id" :userStatus="estatus" :updateTitle="updateTitle"
                                :updateStatus="updateStatus" :onUserDelete="onUserDelete" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-else class="w-100 alert alert-danger text-center fw-bold">
                {{ mensaje }}
            </div>
        </div>

        <!-- Modal Editar usuario -->
        <div class="modal fade" id="userModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="userModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h6 class="modal-title" id="userModalLabel">{{ userTitle }} usuario {{ userTitle
            ===
            'Editar' ? `: ${activeUser.nombre}` : null }}</h6>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="modal-body row needs-validation">
                        <div class="col-12 col-lg-6 mb-2">
                            <label for="name" class="form-label">Nombre:</label>
                            <input @change="onChangeInput" type="text" v-model="activeUser.nombre"
                                class="form-control form-control-sm" name="name">
                            <div class="invalid-feedback">
                                Favor de ingresar un nombre.
                            </div>
                        </div>

                        <div v-if="userTitle === 'Añadir'" class="col-12 col-lg-6 mb-2">
                            <label for="mail" class="form-label">Correo electrónico:</label>
                            <input @change="onChangeInput" type="email" v-model="activeUser.correo"
                                class="form-control form-control-sm" name="mail">
                            <div class="invalid-feedback">
                                Favor de ingresar un correo electrónico.
                            </div>
                        </div>

                        <div class="col-12 col-lg-6 mb-2">
                            <label for="empresa" class="form-label">Empresa</label>
                            <select class="form-control form-control-sm" name="empresa" v-model="activeUser.idEmpresa">
                                <option value="" selected>Seleccionar empresa...</option>

                                <template v-if="companies.length">
                                    <option v-for="{ id, nombre } of companies" :value="id">
                                        {{ nombre }}
                                    </option>
                                </template>
                            </select>
                            <div class="invalid-feedback">
                                Favor de seleccionar una empresa.
                            </div>
                        </div>

                        <div :class="`col-12 ${userTitle === 'Añadir' ? 'col-lg-6' : ''} mb-2`">
                            <label for="perfil" class="form-label">Perfil:</label>
                            <select class="form-control form-control-sm" name="perfil" v-model="activeUser.idPerfil">
                                <option value="" selected>Seleccionar perfil...</option>

                                <template v-if="profiles.length">
                                    <option v-for="{ id, nombre } of profiles" :value="id">
                                        {{ nombre }}
                                    </option>
                                </template>
                            </select>
                            <div class="invalid-feedback">
                                Favor de seleccionar un tipo de perfil.
                            </div>
                        </div>

                        <h6 class="col-12 my-3 fw-bold">
                            {{ userTitle === 'Editar' ? 'Cambiar' : 'Crear' }} contraseña <i
                                class="fa-solid fa-circle-info"></i>
                        </h6>

                        <div class="col-12 mb-2">
                            <label for="password" class="form-label">Contraseña</label>
                            <input type="password" class="form-control form-control-sm" name="password">
                            <div class="invalid-feedback">
                                Favor de ingresar una contraseña.
                            </div>
                        </div>

                        <div class="col-12 mb-2">
                            <label for="passwordConfirmation" class="form-label">Repetir contraseña</label>
                            <input type="password" class="form-control form-control-sm" name="passwordConfirmation">
                            <div class="invalid-feedback">
                                Favor de confirmar la contraseña.
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-outline-primary"
                            data-bs-dismiss="modal">Cancelar</button>

                        <button @click="modalUser" type="button" class="btn btn-sm btn-outline-primary">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import UsersOptions from '@/components/dashboard/UsersOptions.vue';
import Breadcrumb from '@/components/dashboard/Breadcrumb.vue';
import { getCompanies } from '@/helpers/dashboard/companies';
import { getProfiles } from '@/helpers/dashboard/profiles';
import { createUser, getUsers, updateUser, deleteUser } from '@/helpers/dashboard/users';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';
import Loader from '@/components/Loader.vue';

const users = ref([]),
    userTitle = ref('Añadir'),
    loader = ref(true),
    activeUser = ref({
        id: '',
        idPerfil: '',
        idEmpresa: '',
        estatus: '',
        nombre: '',
        correo: '',
        contrasena: '',
    }),
    filterUser = ref({
        estatus: '',
        nombre: '',
    });

const companies = ref([]);
const profiles = ref([]);
const mensaje = ref("No existen usuarios registrados");

const customClass = {
    confirmButton: 'btn btn-sm btn-outline-primary rounded-1',
    cancelButton: 'btn btn-sm btn-outline-primary rounded-1'
}
let userModal = null;

onMounted(async () => {
    userModal = document.getElementById('userModal');

    const { usuarios } = await getUsers({}),
        { empresas } = await getCompanies(),
        { perfiles } = await getProfiles();

    users.value = usuarios || [];
    companies.value = empresas || [];
    profiles.value = perfiles || [];

    loader.value = false;

    // Modal events
    userModal.addEventListener('hidden.bs.modal', e => {
        const invalidInputsDOM = document.querySelectorAll('.is-invalid');

        for (const input of invalidInputsDOM)
            input.classList.remove('is-invalid');
    });
});

// Ref functions
const emptyUser = () => {
    for (const key in activeUser.value)
        activeUser.value[key] = '';
}

const updateTitle = ({ currentTarget }) => {
    const isNewUser = currentTarget.classList.contains('btn-main');
    userTitle.value = isNewUser ? 'Añadir' : 'Editar';

    setActiveUser(currentTarget.getAttribute('userId'));
}

const setActiveUser = (userId) => {
    const passDOM = document.querySelector('input[name=password]'),
        passConfirmDOM = document.querySelector('input[name=passwordConfirmation]');

    passDOM.value = '';
    passConfirmDOM.value = '';

    if (!userId) return emptyUser();

    const { id, idPerfil, idEmpresa, estatus, nombre } = users.value.filter(({ id }) => id === userId)[0];
    activeUser.value = {
        ...activeUser.value,
        id: id,
        idPerfil: idPerfil,
        idEmpresa: idEmpresa,
        estatus: estatus,
        nombre: nombre,
        correo: '',
    }

    // console.log(activeUser.value);
}

const validatePassword = () => {
    const passDOM = document.querySelector('input[name=password]'),
        passConfirmDOM = document.querySelector('input[name=passwordConfirmation]');
    const isEqual = passDOM.value === passConfirmDOM.value;

    if (isEqual)
        activeUser.value = {
            ...activeUser.value,
            contrasena: passDOM.value,
        }

    return isEqual;
}

// General functions
const hideModal = () => {
    document.querySelector('.btn-close').click();
}

const validateFields = () => {
    const isTherePassword = document.querySelector('input[name=password]').value || document.querySelector('input[name=passwordConfirmation]').value;
    const inputsDom = document.querySelectorAll('.needs-validation input'),
        selectsDom = document.querySelectorAll('.needs-validation select');
    const fields = [...inputsDom, ...selectsDom];

    for (const field of fields) {
        if (userTitle.value === 'Editar' && field.type === 'password' && !isTherePassword) {
            field.classList.remove('is-invalid');
            continue;
        }

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

const onUserFilter = async () => {
    const { error: erroGet, mensaje: msgGet, usuarios = [] } = await getUsers({ ...filterUser.value });

    if (!usuarios.length) {
        const filterObj = filterUser.value;
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
            showConfirmButton: false,
            showCloseButton: true,
            width: '400px',
        });
    }

    if (erroGet)
        return console.warn(msgGet);

    users.value = usuarios || [];
}

const onUserCreate = async () => {
    const { error: errorCreate, mensaje: msgCreate } = await createUser({ ...activeUser.value });
    if (errorCreate)
        return console.warn(msgCreate);

    const { error: errorGet, mensaje: msgGet, usuarios = [] } = await getUsers({});
    if (errorGet)
        return console.warn(msgGet);

    users.value = usuarios || [];
    hideModal();

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

const onUserUpdate = async () => {
    const { error: errorUpdate, mensaje: msgUpdate } = await updateUser({ ...activeUser.value });
    if (errorUpdate)
        return console.warn(msgUpdate);

    const { error: errorGet, mensaje: msgGet, usuarios = [] } = await getUsers({});
    if (errorGet)
        return console.warn(msgGet);

    users.value = usuarios || [];
    hideModal();

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
    const userId = currentTarget.getAttribute('userId');
    setActiveUser(userId);

    Swal.fire({
        title: `${activeUser.value.estatus === 'Activo' ? 'Suspender' : 'Activar'} Usuario`,
        text: `¿Realmente desea ${activeUser.value.estatus === 'Activo' ? 'suspender' : 'activar'} al usuario: ${activeUser.value.nombre}?`,
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

        activeUser.value = {
            ...activeUser.value,
            estatus: statusDict[activeUser.value.estatus],
        }

        const { error: errorUpdate, mensaje: msgUpdate } = await updateUser({ ...activeUser.value });
        if (errorUpdate)
            return console.warn(msgUpdate);

        Swal.fire({
            title: `<h3 class='fw-bold'>
                    ¡Usuario ${activeUser.value.estatus === 'Activo' ? 'habilidato' : 'inhabilitado'}!
                </h3>`,
            icon: 'success',
            showConfirmButton: false,
            showCloseButton: true,
            width: '400px',
        });

        const { error: errorGet, mensaje: msgGet, usuarios = [] } = await getUsers({});
        if (errorGet)
            return console.warn(msgGet);

        users.value = usuarios || [];
        emptyUser();
    });
}

const onUserDelete = async ({ currentTarget }) => {
    const userId = currentTarget.getAttribute('userId');
    setActiveUser(userId);

    Swal.fire({
        title: 'Eliminar Usuario',
        text: `¿Realmente desea eliminar al usuario: ${activeUser.value.nombre}?`,
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

        const { error: errorDelete, mensaje: msgDelete } = await deleteUser({ ...activeUser.value });
        if (errorDelete)
            return console.warn(msgDelete);

        Swal.fire({
            title: `<h3 class='fw-bold'>
                    ¡Usuario eliminado!
                </h3>`,
            icon: 'success',
            showConfirmButton: false,
            showCloseButton: true,
            width: '400px',
        });

        const { error: errorGet, mensaje: msgGet, usuarios = [] } = await getUsers({});
        if (errorGet)
            return console.warn(msgGet);

        users.value = usuarios || [];
    });

}

const modalUser = ({ target }) => {
    if (validateFields()) return;
    if (!validatePassword()) return console.log('No coinciden contrasenas');

    switch (userTitle.value) {
        case 'Añadir':
            onUserCreate();
            break;
        case 'Editar':
            onUserUpdate();
            break;
    }
}
</script>