<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../app';

const router = useRouter();
const route = useRoute();

const cart_quantity = ref(0);
const user = ref(null);
const isAuthenticated = ref(false); 

onMounted(async () => {
    try {
        const response = await api.get('/api/user');
        user.value = response.data.user;
        isAuthenticated.value = true;

        // Petición para obtener datos del carrito (si existe)
     /*    const cartResponse = await api.get('/api/cart');
        cart_quantity.value = cartResponse.data.cart.length; */
    } catch (error) {
        console.error('Error fetching user or cart data:', error);
        isAuthenticated.value = false;
    }
});

const logout = async () => {
    try {
        await api.post('/api/logout');
        isAuthenticated.value = false;
        user.value = null;
        cart_quantity.value = 0;
        router.push({ name: 'login' });
    } catch (error) {
        console.error('Error logging out:', error);
    }
};
</script>

<template>
    <div>
        <header class="bg-green-500 text-white">
            <nav class="flex items-center justify-between p-4 max-w-screen-lg mx-auto">
                <div>
                    <h1>LOGO</h1>
                </div>

                <div v-if="isAuthenticated" class="flex space-x-6 ml-auto">
                    <router-link to="/">Inicio</router-link>
                    <h1 class="title">{{ user?.name }}</h1>

                    <router-link to="/cart" class="bg-blue-500 text-white">
                        <div>{{ cart_quantity }} Carrito</div>
                    </router-link>

                    <button @click="logout" class="nav-link">Cerrar Sesión</button>

                    <div v-if="user?.role === 'admin' || user?.role === 'super_admin'">
                        <router-link to="/admin">Administración</router-link>
                    </div>
                </div>

                <div v-else class="space-x-6 ml-auto">
                    <router-link to="/">Inicio</router-link>
                    <router-link to="/login">Iniciar Sesión</router-link>
                </div>
            </nav>
        </header>

        <main class="p-4">
            <slot />
        </main>
    </div>
</template>
