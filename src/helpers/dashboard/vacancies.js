import axios from "axios";

export const createVacancie = async ({ position, companyId, departmentId, description, salary, workHour, startDate, endDate, additionalQuestion }) => {
    const token = localStorage.getItem('token');
    const { id: companyIdUser } = JSON.parse(localStorage.company);
    const formData = new FormData();
    const dataObj = {
        idDepartamento: departmentId,
        estatus: startDate <= getCurrentDate() ? 'Activo' : 'Pendiente',
        titulo: position,
        salario: salary,
        descripcion: encodeURI(description),
        jornada: workHour,
        fechaPublicacion: startDate,
        fechaCaducidad: endDate,
        preguntas: JSON.stringify(additionalQuestion),
    }

    formData.append('idEmpresa', isSuperAdmin() ? companyId : companyIdUser);
    formData.append('datos', JSON.stringify(dataObj));
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/vacantes/crear/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const getVacancies = async ({ page = 1, results = 6 }, filters = {}) => {
    const { id: companyIdUser } = JSON.parse(localStorage.company);

    if (!isSuperAdmin())
        filters = {
            ...filters,
            idEmpresa: companyIdUser,
        }

    const formData = new FormData();
    formData.append('pagina', page);
    formData.append('registrosPorPagina', results);
    formData.append('filtros', JSON.stringify(filters));

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/vacantes/consultar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const updateVacancie = async ({ id, position, status, companyId, departmentId, description, salary, workHour, startDate, endDate, additionalQuestion }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    const dataObj = {
        idDepartamento: departmentId,
        estatus: status,
        titulo: position,
        salario: salary,
        descripcion: encodeURI(description),
        jornada: workHour,
        fechaPublicacion: startDate,
        fechaCaducidad: endDate,
        preguntas: JSON.stringify(additionalQuestion),
    }

    formData.append('idVacante', id);
    formData.append('idEmpresa', companyId);
    formData.append('datos', JSON.stringify(dataObj));
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/vacantes/actualizar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export const updateStatusVacancie = async ({ id }, status) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('idVacante', id);
    formData.append('estatus', status);
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/vacantes/estatus/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}

// General functions
const isSuperAdmin = ({ profile } = JSON.parse(localStorage.user)) => {
    return profile === 'Super Administrador';
}

const getCurrentDate = () => {
    const todayDate = new Date(),
        year = todayDate.getFullYear(),
        month = `${todayDate.getMonth() > 9 ? '' : '0'}${todayDate.getMonth() + 1}`,
        day = `${todayDate.getDate() > 9 ? '' : '0'}${todayDate.getDate()}`;

    return `${year}-${month}-${day}`;
}