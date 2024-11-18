import axios from 'axios';
import { BASE_URL } from "@/config";
//axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Interceptor para agregar el token a cada solicitud
 api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}); 

//api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
export default api;
