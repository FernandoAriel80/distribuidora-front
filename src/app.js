import axios from 'axios';

const api = axios.create({
    baseURL: 'http://distribuidora-back-production.up.railway.app/api',
});

export default api;
