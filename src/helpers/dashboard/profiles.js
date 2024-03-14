import axios from "axios";

export const getProfiles = async () => {
    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/perfiles/consultar/');
        return data;
    } catch (error) {
        console.warn(error);
    }
}