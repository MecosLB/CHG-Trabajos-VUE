import axios from "axios";

export const getProfiles = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('token', token);

    try {
        const { data } = await axios.post('https://bolsa-testing.puntochg.com/api/perfiles/consultar/', formData);
        return data;
    } catch (error) {
        console.warn(error);
    }
}