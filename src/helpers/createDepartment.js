import axios from 'axios';

const createDepartment = async ({ idEmpresa, nombre }) => {
    const formData = new FormData();
    formData.append('idEmpresa', idEmpresa);
    formData.append('estatus', 'Activo');
    formData.append('nombre', nombre);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/departamentos/crear/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export default createDepartment;