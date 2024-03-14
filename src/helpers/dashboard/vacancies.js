import axios from "axios";

export const getVacancies = async ({ page = 1, results = 6 }, filters = {}) => {
    const formData = new FormData();
    formData.append('pagina', page);
    formData.append('registrosPorPagina', results);
    formData.append('filtros', JSON.stringify(filters));

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/vacantes/consultar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}