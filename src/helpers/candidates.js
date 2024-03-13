import axios from "axios";

export const getCandidates = async ({ page = 1, results = 6 }, filters = {}) => {
    const formData = new FormData();
    formData.append('pagina', page);
    formData.append('registrosPorPagina', results);
    formData.append('filtros', JSON.stringify(filters));

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/candidatos/consultar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const viewCandidate = async ({ id }) => {
    const formData = new FormData();
    formData.append('idCandidato', id);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/candidatos/visualizar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const discardCandidate = async ({ id }) => {
    const formData = new FormData();
    formData.append('idCandidato', id);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/candidatos/descartar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const deleteCandidate = async ({ id }) => {
    const formData = new FormData();
    formData.append('idCandidato', id);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/candidatos/eliminar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}