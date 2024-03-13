<template>
    <div class="redirect">
        <Loader />
    </div>

    <Footer />
</template>

<script setup>
import { onMounted } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

import Loader from '@/components/Loader.vue';
import Footer from '@/components/Footer.vue';

import { validateLanding } from '@/helpers/auth/';

const props = defineProps([ 'landing' ]);

onMounted(async () => {
    const company = localStorage.getItem('company');
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (company) {
        router.push({ name: 'auth' });
        return;
    } else if (user && token) {
        router.push({ name: 'dashboard' });
        return;
    } else {
        await redirect();
        return;
    }
});

const redirect = async () => {
    const landing = props.landing; 
    const data = { landing };
    const res = await validateLanding(data);
    const { error, mensaje } = res;
    if (!error) router.push({ name: 'auth' })
    else router.push({ name: 'not-found' })
}
</script>

<style scoped>
.redirect {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 50px);
}
</style>