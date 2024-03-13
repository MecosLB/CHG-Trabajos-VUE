<template>
    <div class="dropdown ms-auto mb-auto">
        <button class="btn btn-sm btn-outline-primary rounded-1" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>

        <ul class="dropdown-menu">
            <li>
                <button @click="setCvTitle(candidateId)" class="dropdown-item" data-bs-toggle="modal"
                    data-bs-target="#cvModal">
                    <i class="fa-solid fa-file-lines me-1"></i> Ver CV
                </button>
            </li>

            <li v-if="candidateStatus !== 'Descartado'">
                <button @click="onCandidateDiscard(candidateId)" class="dropdown-item">
                    <i class="fa-solid fa-folder-open me-1"></i> Descartar
                </button>
            </li>

            <li v-if="candidateStatus === 'Descartado'">
                <button @click="onCandidateDelete(candidateId)" class="dropdown-item">
                    <i class="fa-solid fa-trash me-1"></i> Eliminar
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps(['candidateId', 'candidateStatus', 'setCvTitle', 'onCandidateDiscard', 'onCandidateDelete']);
</script>