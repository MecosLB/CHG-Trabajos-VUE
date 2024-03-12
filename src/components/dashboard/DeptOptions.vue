<template>
    <div class="dropdown">
        <button class="btn btn-sm btn-outline-primary rounded-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>

        <ul class="dropdown-menu">
            <li>
                <button @click="updateTitle" :deptId="deptId" class="dropdown-item"
                    data-bs-toggle="modal" data-bs-target="#deptModal">
                    <i class="fa-solid fa-pencil"></i> Editar
                </button>
            </li>

            <li>
                <button @click="updateStatus" :deptId="deptId" class="dropdown-item">
                    <i :class="`fa-solid fa-${deptStatus === 'Activo' ? 'eye-slash' : 'eye'}`"></i> {{ deptStatus === 'Activo'
                    ? 'Suspender' : 'Activar' }}
                </button>
            </li>

            <li>
                <button :deptId="deptId" @click="onDeptDelete" class="dropdown-item">
                    <i class="fa-solid fa-trash"></i> Eliminar
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps(['deptId', 'deptStatus', 'updateTitle', 'updateStatus', 'onDeptDelete']);
</script>