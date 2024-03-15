<template>
    <section id="login">
        <div class="col-sm-12 col-md-6">
            <div class="card rounded-5">
                <div class="p-2">
                    <div class="container-login">
                        <div class="col-sm-12 col-md-4 img-login">
                            <img :src="`logotipos/${infoCompany.id}.png`" class="img-fluid rounded-5" alt="Logotipo">
                        </div>

                        <div class="col-sm-12 col-md-8">
                            <div class="card-body">
                                <div class="header">
                                    <h5 class="card-title"> ¡Bienvenido! </h5>
                                    <span class="card-subtitle"> {{ infoCompany.name }} </span>
                                </div>

                                <form autocomplete="off">
                                    <div class="mb-3">
                                        <div class="col-12">
                                            <label for="email" class="form-label">
                                                <i class="fa-solid fa-at me-2"></i>
                                                Correo
                                            </label>
                                            <input type="email" class="form-control" id="email" placeholder=""
                                                v-model="loginForm.email">
                                            <small id="email-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <div class="col-12">
                                            <label for="password" class="form-label">
                                                <i class="fa-solid fa-lock me-2"></i>
                                                Contraseña
                                            </label>
                                            <input type="password" class="form-control" id="password" placeholder=""
                                                v-model="loginForm.password">
                                            <small id="password-error" class="error-form"> {{ errorMessage }} </small>
                                        </div>
                                    </div>
                                </form>

                                <div v-if="loader" class="m-4">
                                    <div class="loader-login"></div>
                                </div>

                                <div class="btn-login">
                                    <button type="text" class="btn btn-outline-primary w-100" @click="validateLogin">
                                        Iniciar Sesión </button>
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

import { login, validateCompany, validateSession } from '@/helpers/auth';

import Swal from 'sweetalert2';

import { useRouter } from 'vue-router';
const router = useRouter();

const infoCompany = ref({});

const loader = ref(false);

const errorMessage = ref('');

const loginForm = ref({
    email: 'sistemas.ceachege@gmail.com',
    password: '123'
});

onMounted(async () => {
    await company();
    await user();
});

const company = async () => {
    const res = await validateCompany();
    const { error, company } = res;
    if (error) router.push({ name: 'not-found' })
    else infoCompany.value = JSON.parse(company);
};

const hideError = (conf) => {
    const { field } = conf;
    const small = document.getElementById(`${field}-error`);
    small.style.display = 'none';
}

const hideErrors = () => {
    const form = loginForm.value;
    for (const field in form) {
        if (Object.hasOwnProperty.call(form, field)) {
            hideError({ field });
        }
    }
}

const user = async () => {
    const res = await validateSession();
    const { error } = res;
    if (!error) router.push({ name: 'dashboard' })
    else router.push({ name: 'auth' })
};

const setError = (conf) => {
    const { field, message } = conf;

    errorMessage.value = message;

    const input = document.getElementById(`${field}`);
    input.focus();

    const small = document.getElementById(`${field}-error`);
    small.style.display = 'block';
}

const showAlert = ({ title, message, icon }) => {
    Swal.fire({
        title: title,
        html: message,
        icon: icon,
        showConfirmButton: false,
        showCloseButton: true,
    });
};

const validateEmail = (email) => {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(regEx)) return false;
    return true;
};

const validateLogin = async () => {
    loader.value = true;

    hideErrors();

    const user = loginForm.value;

    if (user.email == '') {
        setError({ field: 'email', message: 'Error: Campo requerido.' })
        return;
    }

    if (!validateEmail(user.email)) {
        setError({ field: 'email', message: 'Error: Correo invalido.' })
        return;
    }

    if (user.password == '') {
        setError({ field: 'password', message: 'Error: Campo requerido.' })
        return;
    }

    const res = await login(user);

    const { error, message } = res;

    if (error) {
        loader.value = false;

        showAlert({
            title: '¡Error!',
            message: message,
            icon: 'error'
        });

        return;
    } else {
        router.push({ name: 'dashboard' })
    }
};
</script>