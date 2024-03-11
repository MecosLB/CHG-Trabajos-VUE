import axios from 'axios';

const getDepartments = async ({ estatus = '', nombre = '' }) => {
    const formData = new FormData();
    const filtersObj = {
        estatus: estatus,
        nombre: nombre,
    }
    formData.append('filtros', JSON.stringify(filtersObj));

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/departamentos/consultar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export default getDepartments;