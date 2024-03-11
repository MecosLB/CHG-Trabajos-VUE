import axios from 'axios';

const updateDepartment = async ({ id, idEmpresa, estatus, nombre }) => {
    const formData = new FormData();
    formData.append('idDepartamento', id);
    formData.append('idEmpresa', idEmpresa);
    formData.append('estatus', estatus);
    formData.append('nombre', nombre);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/departamentos/actualizar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export default updateDepartment;