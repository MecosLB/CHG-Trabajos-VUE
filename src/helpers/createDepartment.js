import axios from 'axios';

const createDepartment = async ({ idPerfil, idEmpresa, nombre, correo, contrasena }) => {
    const formData = new FormData();
    formData.append('idPerfil', idPerfil);
    formData.append('idEmpresa', idEmpresa);
    formData.append('estatus', 'Activo');
    formData.append('nombre', nombre);
    formData.append('correo', correo);
    formData.append('contrasena', contrasena);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/usuarios/crear/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export default createDepartment;