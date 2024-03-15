import axios from 'axios';

export const getReports = async () => {
    const token = localStorage.getItem('token');
    if (!token) return { error: true, mensaje: '' }; 

    const formData = new FormData();

    formData.append('token', token);

    const url = 'https://bolsa-testing.puntochg.com/api/reportes/inicio/';
    const { data } = await axios.post(url, formData);
    return data;
}

export const getVacancies = async (pagination = {}, filters = {}) => {
    const token = localStorage.getItem('token');
    if (!token) return { error: true, mensaje: '' }; 

    const formData = new FormData();

    formData.append('token', token);

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