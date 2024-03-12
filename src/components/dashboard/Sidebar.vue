<template>
    <div id="sidebar" class="sidebar show">
        <div class="logo">
            <img :src="logoCompany" class="img-fluid img-sidebar" :alt="nameCompany" :title="nameCompany">
        </div>

        <div class="menu">
            <div class="list-group">
                <router-link class="list-group-item list-group-item-action" :to="{ name: 'home' }">
                    <i class="fa-solid fa-house me-2"></i>
                    <span> Inicio </span>
                </router-link>

                <router-link class="list-group-item list-group-item-action" :to="{ name: 'vacancies' }">
                    <i class="fa-solid fa-briefcase me-2"></i>
                    <span> Vacantes </span>
                </router-link>

                <router-link class="list-group-item list-group-item-action" :to="{ name: 'departaments' }">
                    <i class="fa-solid fa-list-check me-2"></i>
                    <span> Departamentos </span>
                </router-link>

                <router-link class="list-group-item list-group-item-action" :to="{ name: 'candidates' }">
                    <i class="fa-solid fa-users-rectangle me-2"></i>
                    <span> Candidatos </span>
                </router-link>

                <router-link class="list-group-item list-group-item-action" :to="{ name: 'companies' }">
                    <i class="fa-solid fa-building me-2"></i>
                    <span> Empresas </span>
                </router-link>

                <router-link class="list-group-item list-group-item-action" :to="{ name: 'users' }">
                    <i class="fa-solid fa-users me-2"></i>
                    <span> Usuarios </span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const nameCompany = ref('');
const logoCompany = ref('logotipos/default.png');

onMounted(async () => {
    await setInfo();
});

const setInfo = async () => {
    const company = JSON.parse(localStorage.getItem('company'));
    const { id, name } = company;
    nameCompany.value = name;
    logoCompany.value = `logotipos/${company.id}.png`;
}
</script>

<style scoped>
@import url('../../css/dashboard/sidebar.css');
</style>