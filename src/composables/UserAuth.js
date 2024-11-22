// src/composables/useAuth.js
import { ref } from 'vue';
import api from '../app';

const user = ref(null);

const fetchUser = async () => {
    try {
     if (localStorage.getItem('token') != null ) {
        const response = await api.get('/api/user', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        user.value = response.data;
     }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
    }
};

const logout = async () => {
    try {
        await api.post('/api/logout', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        localStorage.removeItem('token');
        user.value = null;
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};

export function useAuth() {
    return { user, fetchUser, logout };
}
