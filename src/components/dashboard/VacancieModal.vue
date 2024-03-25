<template>

    <!-- Modal Agregar/Editar vacante -->
    <div class="modal fade" id="vacancieModal" data-bs-backdrop="static" tabindex="-1"
        aria-labelledby="vacancieModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h6 class="modal-title" id="vacancieModalLabel">
                        {{ vacancieTitle }} vacante
                    </h6>
                    <button @click="onCloseModal" type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <ul class="nav nav-tabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="generalTab" data-bs-toggle="tab"
                                data-bs-target="#generalTabPane" type="button" role="tab" aria-controls="generalTabPane"
                                aria-selected="true">
                                <i class="fa-solid fa-file-lines me-1"></i> Datos de la vacante
                            </button>
                        </li>

                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="questionsTab" data-bs-toggle="tab"
                                data-bs-target="#questionsTabPane" type="button" role="tab"
                                aria-controls="questionsTabPane" aria-selected="true">
                                <i class="fa-solid fa-question me-1"></i> Preguntas adicionales
                            </button>
                        </li>
                    </ul>

                    <div class="tab-content" id="vacancyContent">
                        <article class="tab-pane fade show active" id="generalTabPane" role="tabpanel"
                            aria-labelledby="generalTab" tabindex="0">

                            <div class="row mt-4">
                                <div class="col-12 mb-2 needs-validation">
                                    <label for="position" class="form-label">Cargo:</label>
                                    <input @change="onChangeInput" v-model="activeVacancie.position" type="text"
                                        class="form-control form-control-sm" name="position">
                                    <div class="invalid-feedback">
                                        Favor de ingresar un cargo.
                                    </div>
                                </div>

                                <div v-if="isSuperAdmin()" class="col-12 mb-2 needs-validation">
                                    <label for="company" class="form-label">Empresa:</label>
                                    <select @change="e => {
                            onChangeInput(e);
                            displayDepartments(e);
                        }" v-model="activeVacancie.companyId" class="form-control form-control-sm" name="company">
                                        <option value="" selected>Seleccionar empresa...</option>

                                        <template v-if="companies.length">
                                            <option v-for="{ id, nombre } of companies" :value="id">
                                                {{ nombre }}
                                            </option>
                                        </template>
                                    </select>
                                    <div class="invalid-feedback">
                                        Favor de seleccionar un empresa.
                                    </div>
                                </div>

                                <div class="col-12 mb-2 needs-validation">
                                    <label for="department" class="form-label">Departamento:</label>
                                    <select @change="onChangeInput" class="form-control form-control-sm"
                                        v-model="activeVacancie.departmentId" name="department">
                                        <option value="" selected>Seleccionar departamento...</option>

                                        <template v-if="departments.length">
                                            <option v-for="{ id, nombre } of departments" :value="id">
                                                {{ nombre }}
                                            </option>
                                        </template>
                                    </select>
                                    <div class="invalid-feedback">
                                        Favor de seleccionar un departamento.
                                    </div>
                                </div>

                                <div class="col-12 mb-2">
                                    <label for="description" class="form-label">Descripción de puesto:</label>
                                    <QuillEditor @update:content="updateContent"
                                        :content="decodeURI(activeVacancie.description)" contentType="html"
                                        theme="snow" />
                                    <div class="invalid-feedback">
                                        Favor de ingresar una descripción de la vacante.
                                    </div>
                                </div>

                                <div class="col-12 col-lg-6 mb-2 needs-validation">
                                    <label for="salary" class="form-label">Salario:</label>
                                    <input @change="onChangeInput" v-model="activeVacancie.salary" type="number"
                                        class="form-control form-control-sm" name="salary">
                                    <div class="invalid-feedback">
                                        Favor de ingresar un salario válido.
                                    </div>
                                </div>

                                <div class="col-12 col-lg-6 mb-2 needs-validation">
                                    <label for="workHour" class="form-label">Jornada laboral:</label>
                                    <select @change="onChangeInput" v-model="activeVacancie.workHour"
                                        class="form-control form-control-sm" name="workHour">
                                        <option value="" selected>Seleccionar jornada laboral...</option>
                                        <option value="Tiempo Completo">Tiempo completo</option>
                                        <option value="Medio Tiempo">Medio tiempo</option>
                                        <option value="Por Horas">Por horas</option>
                                        <option value="Practicas">Becas/prácticas</option>
                                    </select>
                                    <div class="invalid-feedback">
                                        Favor de seleccionar un tipo de jornada laboral.
                                    </div>
                                </div>

                                <div class="col-12 col-lg-6 mb-2 needs-validation">
                                    <label for="startDate" class="form-label">Fecha de publicación:</label>
                                    <input @change="onChangeInput" v-model="activeVacancie.startDate" type="date"
                                        :min="getCurrentDate()" class="form-control form-control-sm" name="startDate">
                                    <div class="invalid-feedback">
                                        Favor de seleccionar una fecha válida.
                                    </div>
                                </div>

                                <div class="col-12 col-lg-6 mb-2 needs-validation">
                                    <label for="endDate" class="form-label">Fecha de finalización:</label>
                                    <input @change="onChangeInput" v-model="activeVacancie.endDate" type="date"
                                        :min="getCurrentDate()" class="form-control form-control-sm" name="endDate">
                                    <div class="invalid-feedback">
                                        Favor de seleccionar una fecha válida.
                                    </div>
                                </div>
                            </div>

                        </article>

                        <article class="tab-pane fade" id="questionsTabPane" role="tabpanel"
                            aria-labelledby="questionsTab" tabindex="0">

                            <div class="d-flex align-items-end gap-3 mt-4">
                                <span class="w-100">
                                    <label for="questionType" class="form-label">Tipo de pregunta:</label>
                                    <select v-model="questionSelected" class="form-control form-control-sm"
                                        name="questionType">
                                        <option value="">Seleccionar tipo de pregunta...</option>
                                        <option value="text">Pregunta abierta</option>
                                        <option value="select">Pregunta de opción múltiple</option>
                                    </select>

                                    <template v-if="questionSelected">
                                        <label for="questionText" class="form-label mt-2">Pregunta:</label>
                                        <input type="text" name="questionText" class="form-control form-control-sm">
                                    </template>

                                    <template v-if="questionSelected === 'select'">
                                        <span class="d-flex align-items-center gap-3 mt-2">
                                            <input v-for="(answer, index) in answersNum" type="text" name="answer"
                                                :placeholder="`Respuesta ${index + 1}`"
                                                class="form-control form-control-sm">

                                            <button v-if="answersNum.length < 5" @click="addAnswer"
                                                class="btn-add solid">
                                                <i class="fa-solid fa-plus"></i>
                                            </button>
                                        </span>
                                    </template>
                                </span>

                                <button @click="() => {
                            if (addQuestion(questionSelected)) return;
                            answersNum = [1, 2];
                            questionSelected = '';
                        }" class="btn-add">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>

                            <div id="questionsList" class="row mt-4">
                                <template v-if="activeVacancie.additionalQuestion.length">
                                    <p v-for="({ tipo, label, valores }, index) in activeVacancie.additionalQuestion">
                                        <i class="fa-solid fa-circle-dot green"></i>&nbsp;
                                        <b>
                                            Tipo:
                                        </b>
                                        {{ tipo === 'text' ? 'Abierta' : 'Opción múltiple' }},&nbsp;
                                        <b>
                                            Pregunta:
                                        </b>
                                        {{ label }}
                                        <template v-if="tipo !== 'text' && valores.length">
                                            ,&nbsp;
                                            <b>
                                                Respuestas:
                                            </b>
                                            <template v-for="valor in valores">
                                                {{ valor }},
                                            </template>
                                        </template>

                                        <button @click="deleteQuestion(index)"
                                            class="btn btn-sm btn-danger rounded-5 ms-2">
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                    </p>
                                </template>
                            </div>

                        </article>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="onCloseModal" type="button" class="btn btn-sm btn-outline-primary"
                        data-bs-dismiss="modal">Cancelar</button>

                    <button @click="modalVacancie" type="button" class="btn btn-sm btn-outline-primary">Guardar</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ref } from 'vue';

const props = defineProps(['isSuperAdmin', 'departments', 'companies', 'displayDepartments', 'vacancieTitle', 'activeVacancie', 'modalVacancie', 'updateContent', 'questions', 'addQuestion', 'deleteQuestion']);

const answersNum = ref([1, 2]);
const questionSelected = ref('');

// Ref functions
const addAnswer = ({ target }) => {
    if (answersNum.value.length > 4) return;

    answersNum.value.push([...answersNum.value].pop() + 1);
}

const onCloseModal = ({ target }) => {
    answersNum.value = [1, 2];
    questionSelected.value = '';
}

// General functions
const onChangeInput = ({ target }) => {
    if (!target.value) return;

    target.classList.remove('is-invalid');
}

const getCurrentDate = () => {
    const todayDate = new Date(),
        year = todayDate.getFullYear(),
        month = `${todayDate.getMonth() > 9 ? '' : '0'}${todayDate.getMonth() + 1}`,
        day = `${todayDate.getDate() > 9 ? '' : '0'}${todayDate.getDate()}`;

    return `${year}-${month}-${day}`;
}
</script>