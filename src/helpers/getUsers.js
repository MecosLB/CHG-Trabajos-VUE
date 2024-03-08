import axios from 'axios';

const getUsers = async ({ estatus = '', nombre = '' }) => {
    const formData = new FormData();
    const filtersObj = {
        estatus: estatus,
        nombre: nombre,
    }
    formData.append('filtros', JSON.stringify(filtersObj));

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/usuarios/consultar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export default getUsers;