<template>
    <div class="dropdown">
        <button class="btn btn-secondary rounded-5" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fa-solid fa-ellipsis"></i>
        </button>

        <ul class="dropdown-menu">
            <li>
                <button @click="updateTitle" :userId="userId" class="dropdown-item text-secondary"
                    data-bs-toggle="modal" data-bs-target="#userModal">
                    <i class="fa-solid fa-pencil"></i> Editar
                </button>
            </li>

            <li>
                <button @click="updateStatus" :userId="userId" class="dropdown-item text-secondary">
                    <i :class="`fa-solid fa-${userStatus === 'Activo' ? 'eye-slash' : 'eye'}`"></i> {{ userStatus ===
                    'Activo'
                    ? 'Inhabilitar' : 'Habilitar' }}
                </button>
            </li>

            <li>
                <button :userId="userId" @click="onUserDelete" class="dropdown-item text-danger">
                    <i class="fa-solid fa-trash"></i> Eliminar
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps(['userId', 'userStatus', 'updateTitle', 'updateStatus', 'onUserDelete']);
</script>