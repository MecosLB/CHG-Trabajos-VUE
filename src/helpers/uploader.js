import axios from 'axios';

export const uploadFile = async ({ file, extensions }) => {
    const formData = new FormData();

    formData.append('archivo', file);
    formData.append('extensiones', extensions);

    const url = 'https://bolsa-testing.puntochg.com/api/shared/uploader/subir/';
    const { data } = await axios.post(url, formData);
    return data;
}

export const deleteFile = async ({ file }) => {
    const formData = new FormData();

    formData.append('archivo', file);

    const url = 'https://bolsa-testing.puntochg.com/api/shared/uploader/eliminar/';
    const { data } = await axios.post(url, formData);
    return data;
}