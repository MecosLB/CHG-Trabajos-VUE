import axios from 'axios';

const getCompanies = async () => {
    const formData = new FormData();
    const url = 'https://bolsa-testing.puntochg.com/api/empresas/consultar/';
    const { data } = await axios.post(url, formData);
    return data;
}

export default getCompanies;