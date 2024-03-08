import axios from 'axios';

export const getCompanies = async (pagination = {}) => {
    const formData = new FormData();

    if (Object.keys(pagination).length > 0) {
        formData.append('pagina', pagination.page);
        formData.append('registrosPorPagina', pagination.results);
    }

    const url = 'https://bolsa-testing.puntochg.com/api/empresas/consultar/';
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