import axios from 'axios';

export const login = async (user = {}) => {
    try {
        const { id } = JSON.parse(localStorage.getItem('company'));

        const formData = new FormData();

        formData.append('idEmpresa', id);
        formData.append('correo', user.email);
        formData.append('contrasena', user.password);

        const url = 'https://bolsa-testing.puntochg.com/api/session/login/';
        const { data } = await axios.post(url, formData);

        const { error, mensaje, usuario, token } = data;

        if (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { error: true, message: mensaje };
        } 

        localStorage.setItem('token', token);
        localStorage.setItem('user', usuario);

        return { error: false, message: '' };
    } catch (error) {
        return { error: true, message: error };   
    }
}

export const validateLanding = async ({ landing }) => {
    try {
        const formData = new FormData();

        formData.append('landing', landing);

        const url = 'https://bolsa-testing.puntochg.com/api/session/landing/';
        const { data } = await axios.post(url, formData);
        
        const { error, mensaje, idEmpresa, nombreEmpresa } = data;

        if (error) {
            localStorage.clear();
            return { error: true, message: mensaje };
        }

        localStorage.setItem('company', JSON.stringify({
            id: idEmpresa,
            name: nombreEmpresa
        }));

        return { error: false, message: '' };
    } catch (error) {
        return { error: true, message: error };   
    }
}

export const validateCompany = async () => {
    try {
        const company = localStorage.getItem('company');
        if (!company) return { error: true, message: '', company: {} };
        else return { error: false, message: '', company: company };
    } catch (error) {
        return { error: true, message: error, company: {} };   
    }
}

export const validateSession = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return { error: true, message: '' };
        else return { error: false, message: '' };
    } catch (error) {
        return { error: true, message: error };   
    }
}

export const logout = async () => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));

        const formData = new FormData();

        formData.append('token', token);

        const url = 'https://bolsa-testing.puntochg.com/api/session/logout/';
        const { data } = await axios.post(url, formData);

        if (!data.error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { error: false, message: '' };
        } else {
            return { error: true, message: data.mensaje };
        }
    } catch (error) {
        return { error: true, message: error };
    }
}