// src/composables/useAuth.js
import { ref, computed } from 'vue';
import api from '../app';
import { TOKEN } from '@/config';

const user = ref(null);

const fetchUser = async () => {
    try {
        if (localStorage.getItem(TOKEN) != null) {
            const response = await api.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
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
                Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
            }
        });
        localStorage.removeItem(TOKEN);
        user.value = null;
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};

const cartItems = ref([])

const fetchCart = async () => {
    try {
        const response = await api.get('/api/cart', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
            }
        })
        cartItems.value = response.data.items
        console.log(response.data.items)
    } catch (error) {
        console.error('Error al cargar el carrito:', error)
    }
}

// Computed para obtener la cantidad total de elementos en el carrito
const cartQuantity = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})


export function useAuth() {
    return { user,cartQuantity ,fetchUser, fetchCart, logout };
}
