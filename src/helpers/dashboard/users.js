import axios from "axios";

export const createUser = async ({ idPerfil, idEmpresa, nombre, correo, contrasena }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('idPerfil', idPerfil);
    formData.append('idEmpresa', idEmpresa);
    formData.append('estatus', 'Activo');
    formData.append('nombre', nombre);
    formData.append('correo', correo);
    formData.append('contrasena', contrasena);
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/usuarios/crear/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const getUsers = async ({ estatus = '', nombre = '' }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    const filtersObj = {
        estatus: estatus,
        nombre: nombre,
    }
    formData.append('filtros', JSON.stringify(filtersObj));
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/usuarios/consultar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const updateUser = async ({ id, idPerfil, idEmpresa, estatus, nombre, contrasena = '' }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('idUsuario', id);
    formData.append('idPerfil', idPerfil);
    formData.append('idEmpresa', idEmpresa);
    formData.append('estatus', estatus);
    formData.append('nombre', nombre);
    formData.append('token', token);

    if (contrasena)
        formData.append('contrasena', contrasena);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/usuarios/actualizar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const deleteUser = async ({ id, idEmpresa }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('idUsuario', id);
    formData.append('idEmpresa', idEmpresa);
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/usuarios/eliminar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}