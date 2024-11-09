import axios from 'axios';

const api = axios.create({
    baseURL: 'https://distribuidora-back-production.up.railway.app/',
});

export default api;
