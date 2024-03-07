import axios from 'axios';

const getCompanies = async (pagination = {}) => {
    const formData = new FormData();

    if (Object.keys(pagination).length > 0) {
        formData.append('pagina', pagination.page);
        formData.append('registrosPorPagina', pagination.results);
    }

    const url = 'https://bolsa-testing.puntochg.com/api/empresas/consultar/';
    const { data } = await axios.post(url, formData);
    return data;
}

export default getCompanies;