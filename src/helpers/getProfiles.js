import axios from 'axios';

const getProfiles = async () => {
    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/perfiles/consultar/');
        return data;
    } catch (error) {
        console.warn(error);
    }
}

export default getProfiles;