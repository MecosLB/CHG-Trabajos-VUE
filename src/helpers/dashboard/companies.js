import axios from 'axios';

export const activeCompany = async (company = {}) => {
    const formData = new FormData();

    company.estatus = 'Activo';

    const { id } = company;

    formData.append('idEmpresa', id);
    formData.append('datos', JSON.stringify(company));

    const url = 'https://bolsa-testing.puntochg.com/api/empresas/actualizar/';
    const { data } = await axios.post(url, formData);
    return data;
}

export const addCompany = async (company = {}) => {
    const formData = new FormData();

    const { estatus, nombre, landing, correo, telefono, logotipo, calle, noInterior, noExterior, codigoPostal, colonia, municipio, estado } = company;

    let numeros = '';
    
    if ((noInterior !== '') && (noExterior !== '')) {
        numeros = noInterior + '-' + noExterior;
    }

    if ((noInterior !== '') && (noExterior == '')) {
        numeros = noInterior;
    }

    if ((noInterior == '') && (noExterior !== '')) {
        numeros = '-' + noExterior;
    }

    const address = [calle, numeros, codigoPostal, colonia, municipio, estado];
    const direccion = address.join(',');

    formData.append('datos', JSON.stringify({
        estatus: estatus,
        landing: landing,
        nombre: nombre,
        direccion: direccion,
        correo: correo,
        telefono: telefono
    }));

    formData.append('archivoLogotipo', logotipo);

    const url = 'https://bolsa-testing.puntochg.com/api/empresas/crear/';
    const { data } = await axios.post(url, formData);
    return data;
}

export const deleteCompany = async (company = {}) => {
    const formData = new FormData();

    const { id } = company;

    formData.append('idEmpresa', id);

    const url = 'https://bolsa-testing.puntochg.com/api/empresas/eliminar/';
    const { data } = await axios.post(url, formData);
    return data;
}

export const getCompanies = async (pagination = {}, filters = {}) => {
    const formData = new FormData();

    if (Object.keys(pagination).length > 0) {
        formData.append('pagina', pagination.page);
        formData.append('registrosPorPagina', pagination.results);
    }

    if (Object.keys(filters).length ) {
        formData.append('filtros', JSON.stringify(filters));
    }

    const url = 'https://bolsa-testing.puntochg.com/api/empresas/consultar/';
    const { data } = await axios.post(url, formData);
    return data;
}

export const suspendCompany = async (company = {}) => {
    const formData = new FormData();

    company.estatus = 'Suspendido';

    const { id } = company;

    formData.append('idEmpresa', id);
    formData.append('datos', JSON.stringify(company));

    const url = 'https://bolsa-testing.puntochg.com/api/empresas/actualizar/';
    const { data } = await axios.post(url, formData);
    return data;
}

export const updateInfoCompany = async (id, company = {}) => {
    const formData = new FormData();

    const { estatus, nombre, landing, correo, telefono, logotipo, calle, noInterior, noExterior, codigoPostal, colonia, municipio, estado } = company;

    let numeros = '';
    
    if ((noInterior !== '') && (noExterior !== '')) {
        numeros = noInterior + '-' + noExterior;
    }

    if ((noInterior !== '') && (noExterior == '')) {
        numeros = noInterior;
    }

    if ((noInterior == '') && (noExterior !== '')) {
        numeros = '-' + noExterior;
    }

    const address = [calle, numeros, codigoPostal, colonia, municipio, estado];
    const direccion = address.join(',');

    formData.append('idEmpresa', id);

    formData.append('datos', JSON.stringify({
        estatus: estatus,
        landing: landing,
        nombre: nombre,
        direccion: direccion,
        correo: correo,
        telefono: telefono
    }));

    if (logotipo !== '') {
        formData.append('archivoLogotipo', logotipo);
    }

    const url = 'https://bolsa-testing.puntochg.com/api/empresas/actualizar/';
    const { data } = await axios.post(url, formData);
    return data;
}