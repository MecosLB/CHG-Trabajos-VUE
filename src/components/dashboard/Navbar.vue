<template>
    <div class="navbar sticky-top">
        <div class="btn-sidebar">
            <button type="button" class="btn btn-sm btn-outline-primary rounded-5" @click="btnSideBar">
                <i id="iBtnSideBar" class="fa-solid fa-arrow-left-long"></i>
            </button>
        </div>

        <div class="btn-user">
            <div class="btn-group dropstart">
                <button type="button" title="Usuario" class="btn btn-sm btn-outline-primary rounded-5"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-building-user"></i>
                    {{ user.name }}
                </button>

                <ul class="dropdown-menu">
                    <li class="dropdown-item dropdown-item-user">
                        <span class="fw-bold"> Perfil: </span> {{ user.profile }}
                    </li>
                    <li class="dropdown-item dropdown-item-user">
                        <span class="fw-bold"> Empresa: </span> {{ nameCompany }}
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" @click="signOff">
                            <i class="fa-solid fa-power-off me-1"></i> Cerrar Sesión
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

import { logout } from '@/helpers/auth';

const nameCompany = ref('');

const user = ref({});

onMounted(async () => {
    await setInfo();
});

const setInfo = async () => {
    const company = JSON.parse(localStorage.getItem('company'));
    const { id, name } = company;
    nameCompany.value = name;

    user.value = JSON.parse(localStorage.getItem('user'))
    document.title = `Bolsa de Trabajo | ${nameCompany.value}`;
}

const signOff = async () => {
    const res = await logout();
    const { error } = res;

    if (!error) router.push({ name: 'auth' })
    else console.log('Ocurrió un error al intentar cerrar sesión.');
}

const btnSideBar = () => {
    const logoWrapper = document.querySelector('div.logo');
    const sidebar = document.getElementById('sidebar');
    const sidebarClass = sidebar.classList;

    const iBtnSideBar = document.getElementById('iBtnSideBar');
    const iBtnSideBarClass = iBtnSideBar.classList;

    sidebarClass.toggle('show');
    sidebarClass.toggle('hide');

    iBtnSideBarClass.toggle('fa-arrow-left-long');
    iBtnSideBarClass.toggle('fa-arrow-right-long');

    setTimeout(() => {
        logoWrapper.classList.toggle('opacity-0');
    }, sidebarClass.contains('show') ? 300 : 0);
}
</script>