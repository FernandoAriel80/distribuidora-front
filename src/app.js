import axios from 'axios';

const api = axios.create({
    baseURL: 'http://distribuidora-back-production.up.railway.app',
});

export default api;
