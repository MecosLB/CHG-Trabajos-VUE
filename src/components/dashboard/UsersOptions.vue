<template>
    <div class="dropdown">
        <button class="btn btn-sm btn-outline-primary rounded-1" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>

        <ul class="dropdown-menu">
            <li>
                <button @click="updateTitle" :userId="userId" class="dropdown-item"
                    data-bs-toggle="modal" data-bs-target="#userModal">
                    <i class="fa-solid fa-pencil"></i> Editar
                </button>
            </li>

            <li>
                <button @click="updateStatus" :userId="userId" class="dropdown-item">
                    <i :class="`fa-solid fa-${userStatus === 'Activo' ? 'eye-slash' : 'eye'}`"></i> {{ userStatus ===
                    'Activo'
                    ? 'Suspender' : 'Activar' }}
                </button>
            </li>

            <li>
                <button :userId="userId" @click="onUserDelete" class="dropdown-item">
                    <i class="fa-solid fa-trash"></i> Eliminar
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps(['userId', 'userStatus', 'updateTitle', 'updateStatus', 'onUserDelete']);
</script>