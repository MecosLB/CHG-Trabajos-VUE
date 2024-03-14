import axios from 'axios';

export const getReports = async () => {
    const formData = new FormData();

    const url = 'https://bolsa-testing.puntochg.com/api/reportes/inicio/';
    const { data } = await axios.post(url, formData);
    return data;
}

export const getVacancies = async (pagination = {}, filters = {}) => {
    const formData = new FormData();

    if (Object.keys(pagination).length > 0) {
        formData.append('pagina', pagination.page);
        formData.append('registrosPorPagina', pagination.results);
    }

    if (Object.keys(filters).length ) {
        formData.append('filtros', JSON.stringify(filters));
    }

    const url = 'https://bolsa-testing.puntochg.com/api/vacantes/consultar/';
    const { data } = await axios.post(url, formData);
    return data;
}