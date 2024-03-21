<template>
    <div class="dropdown">
        <button class="btn btn-sm btn-outline-primary rounded-1" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>

        <ul class="dropdown-menu">
            <li v-if="vacancieStatus !== 'Finalizado'">
                <button @click="updateTitle" class="dropdown-item" :vacancieId="vacancieId" data-bs-toggle="modal"
                    data-bs-target="#vacancieModal">
                    <i class="fa-solid fa-pencil me-1"></i> Editar
                </button>
            </li>

            <li>
                <button @click="updateTitle" class="dropdown-item btn-duplicate" :vacancieId="vacancieId" data-bs-toggle="modal"
                    data-bs-target="#vacancieModal">
                    <i class="fa-solid fa-copy me-1"></i> Duplicar
                </button>
            </li>

            <template v-if="vacancieStatus === 'Activo'">
                <li>
                    <button @click="onVacancieUpdateStatus(vacancieId, 'Suspendido')" class="dropdown-item">
                        <i class="fa-solid fa-eye-slash me-1"></i> Suspender
                    </button>
                </li>

                <li>
                    <button @click="onVacancieUpdateStatus(vacancieId, 'Finalizado')" class="dropdown-item">
                        <i class="fa-solid fa-hourglass-end me-1"></i> Finalizar
                    </button>
                </li>
            </template>

            <li v-if="['Suspendido', 'Pendiente'].includes(vacancieStatus)">
                <button @click="onVacancieUpdateStatus(vacancieId, 'Activo')" class="dropdown-item">
                    <i class="fa-solid fa-eye me-1"></i> Activar
                </button>
            </li>

            <li>
                <button @click="onVacancieUpdateStatus(vacancieId, 'Eliminado')" class="dropdown-item">
                    <i class="fa-solid fa-trash me-1"></i> Eliminar
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps(['vacancieId', 'vacancieStatus', 'onVacancieUpdateStatus', 'updateTitle']);
</script>