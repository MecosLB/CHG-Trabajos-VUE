import axios from 'axios';

const deleteUser = async ({ id, idEmpresa }) => {
    const formData = new FormData();
    formData.append('idUsuario', id);
    formData.append('idEmpresa', idEmpresa);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/usuarios/eliminar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export default deleteUser;