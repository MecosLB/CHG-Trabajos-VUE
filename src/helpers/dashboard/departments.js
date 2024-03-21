import axios from "axios";

export const createDepartment = async ({ idEmpresa, nombre }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('idEmpresa', idEmpresa);
    formData.append('estatus', 'Activo');
    formData.append('nombre', nombre);
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/departamentos/crear/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const getDepartments = async ({ estatus = '', nombre = '', idEmpresa = '' }) => {
    const formData = new FormData();
    const filtersObj = {
        estatus: estatus,
        nombre: nombre,
        idEmpresa: idEmpresa,
    }
    formData.append('filtros', JSON.stringify(filtersObj));

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/departamentos/consultar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const updateDepartment = async ({ id, idEmpresa, estatus, nombre }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('idDepartamento', id);
    formData.append('idEmpresa', idEmpresa);
    formData.append('estatus', estatus);
    formData.append('nombre', nombre);
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/departamentos/actualizar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const deleteDepartment = async ({ id, idEmpresa }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('idDepartamento', id);
    formData.append('idEmpresa', idEmpresa);
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/departamentos/eliminar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}