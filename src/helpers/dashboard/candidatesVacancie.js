import axios from "axios";

export const getCandidatesVacancie = async (vacancieId = '', { page = 1, results = 6 }, filters = {}) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('pagina', page);
    formData.append('registrosPorPagina', results);
    formData.append('filtros', JSON.stringify(filters));
    formData.append('token', token);
    formData.append('idVacante', vacancieId);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/vacantes-candidatos/consultar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const viewCandidateVacancie = async ({ id }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('idCandidato', id);
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/vacantes-candidatos/visualizar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const discardCandidateVacancie = async ({ id }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('idCandidato', id);
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/vacantes-candidatos/descartar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const deleteCandidateVacancie = async ({ id }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('idCandidato', id);
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/vacantes-candidatos/eliminar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const selectCandidateVacancie = async ({ id }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('idCandidato', id);
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/vacantes-candidatos/seleccionar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const finalistCandidateVacancie = async ({ id }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('idCandidato', id);
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/vacantes-candidatos/finalizar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}
