<template>
    <section id="users" class="mt-3">
        <div class="container-fluid">
            <div class="row title-module">
                <h6>
                    <i class="fa-solid fa-users me-2"></i> Usuarios
                </h6>
            </div>
        </div>

        <div class="container d-flex flex-column gap-5 mt-3">
            <button @click="updateTitle" class="btn-main btn px-5 rounded-5 w-auto ms-auto" data-bs-toggle="modal"
                data-bs-target="#userModal">
                <i class="fa-solid fa-plus"></i> Añadir
            </button>

            <table v-if="users.length" class="table users table-striped text-center align-middle">
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
                                    <button class="btn btn-secondary" type="button" data-bs-toggle="dropdown"
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
                        <td :class="`fw-bold text-${estatus === 'Activo' ? 'success' : 'danger'}`">
                            <i :class="`fa-${estatus === 'Activo' ? 'solid' : 'regular'} fa-circle`"></i> {{ estatus }}
                        </td>
                        <td>
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
        <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5 fw-bold" id="userModalLabel">{{ userTitle }} usuario {{ userTitle
                ===
                'Editar' ? `: ${activeUser.nombre}` : null }}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body needs-validation" novalidate>
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-id-card"></i>
                            </span>
                            <input @change="onChangeInput" type="text" v-model="activeUser.nombre" class="form-control"
                                name="name" placeholder="Nombre">
                            <div class="invalid-feedback">
                                Favor de ingresar un nombre.
                            </div>
                        </div>

                        <div v-if="userTitle === 'Añadir'" class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-envelope"></i>
                            </span>
                            <input @change="onChangeInput" type="email" v-model="activeUser.correo" class="form-control"
                                name="mail" placeholder="Correo electrónico">
                            <div class="invalid-feedback">
                                Favor de ingresar un correo electrónico.
                            </div>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-building"></i>
                            </span>
                            <select class="form-control" name="empresa" v-model="activeUser.idEmpresa">
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

                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-id-badge"></i>
                            </span>
                            <select class="form-control" name="perfil" v-model="activeUser.idPerfil">
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

                        <h6 class="fw-bold">
                            {{ userTitle === 'Editar' ? 'Cambiar' : 'Crear' }} contraseña <i
                                class="fa-solid fa-circle-info"></i>
                        </h6>

                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-key"></i>
                            </span>
                            <input type="password" class="form-control" name="password" placeholder="Nueva contraseña">
                            <div class="invalid-feedback">
                                Favor de ingresar una contraseña.
                            </div>
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-circle-check"></i>
                            </span>
                            <input type="password" class="form-control" name="passwordConfirmation"
                                placeholder="Repetir contraseña">
                            <div class="invalid-feedback">
                                Favor de confirmar la contraseña.
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>

                        <button @click="modalUser" type="button" class="btn btn-main">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import UsersOptions from '@/components/dashboard/UsersOptions.vue';
import { getCompanies } from '@/helpers/companies';
import { getProfiles } from '@/helpers/profiles';
import { createUser, getUsers, updateUser, deleteUser } from '@/helpers/users';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';

const users = ref([]),
    userTitle = ref('Añadir'),
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

let userModal = null;

onMounted(async () => {
    userModal = document.getElementById('userModal');

    const { usuarios } = await getUsers({}),
        { empresas } = await getCompanies(),
        { perfiles } = await getProfiles();

    users.value = usuarios;
    companies.value = empresas;
    profiles.value = perfiles;

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
            confirmButtonText: 'Cerrar',
            width: '400px',
        });
    }

    if (erroGet)
        return console.warn(msgGet);

    users.value = usuarios;
}

const onUserCreate = async () => {
    const { error: errorCreate, mensaje: msgCreate } = await createUser({ ...activeUser.value });
    if (errorCreate)
        return console.warn(msgCreate);

    const { error: errorGet, mensaje: msgGet, usuarios = [] } = await getUsers({});
    if (errorGet)
        return console.warn(msgGet);

    users.value = usuarios;
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

const onUserUpdate = async () => {
    const { error: errorUpdate, mensaje: msgUpdate } = await updateUser({ ...activeUser.value });
    if (errorUpdate)
        return console.warn(msgUpdate);

    const { error: errorGet, mensaje: msgGet, usuarios = [] } = await getUsers({});
    if (errorGet)
        return console.warn(msgGet);

    users.value = usuarios;
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
    const userId = currentTarget.getAttribute('userId');
    setActiveUser(userId);

    Swal.fire({
        title: `<h3 class='fw-bold'>
                    ¿Desea ${activeUser.value.estatus === 'Activo' ? 'inhabilitar' : 'habilitar'} al usuario: ${activeUser.value.nombre}?
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
            confirmButtonText: 'Cerrar',
            width: '400px',
        });

        const { error: errorGet, mensaje: msgGet, usuarios = [] } = await getUsers({});
        if (errorGet)
            return console.warn(msgGet);

        users.value = usuarios;
        emptyUser();
    });
}

const onUserDelete = async ({ currentTarget }) => {
    const userId = currentTarget.getAttribute('userId');
    setActiveUser(userId);

    Swal.fire({
        title: `<h3 class='fw-bold'>
                    ¿Desea eliminar al usuario: ${activeUser.value.nombre}?
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

        const { error: errorDelete, mensaje: msgDelete } = await deleteUser({ ...activeUser.value });
        if (errorDelete)
            return console.warn(msgDelete);

        Swal.fire({
            title: `<h3 class='fw-bold'>
                    ¡Usuario eliminado!
                </h3>`,
            icon: 'success',
            confirmButtonText: 'Cerrar',
            width: '400px',
        });

        const { error: errorGet, mensaje: msgGet, usuarios = [] } = await getUsers({});
        if (errorGet)
            return console.warn(msgGet);

        users.value = usuarios;
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