import axios from 'axios';

const updateUser = async ({ id, idPerfil, idEmpresa, estatus, nombre, contrasena = '' }) => {
    const formData = new FormData();
    formData.append('idUsuario', id);
    formData.append('idPerfil', idPerfil);
    formData.append('idEmpresa', idEmpresa);
    formData.append('estatus', estatus);
    formData.append('nombre', nombre);

    if (contrasena)
        formData.append('contrasena', contrasena);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/usuarios/actualizar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export default updateUser;