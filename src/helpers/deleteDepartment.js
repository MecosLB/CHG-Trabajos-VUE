import axios from 'axios';

const deleteDepartment = async ({ id, idEmpresa }) => {
    const formData = new FormData();
    formData.append('idDepartamento', id);
    formData.append('idEmpresa', idEmpresa);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/departamentos/eliminar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export default deleteDepartment;