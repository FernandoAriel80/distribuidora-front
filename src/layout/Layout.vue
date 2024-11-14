<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../app';
import { useAuth } from '../composables/UserAuth';
const { user, logout } = useAuth();

const router = useRouter();
const route = useRoute();

const cart_quantity = ref(0);
const isAuthenticated = ref(false); 

</script>

<template>
    <div>
        <header class="bg-green-500 text-white">
            <nav class="flex items-center justify-between p-4 max-w-screen-lg mx-auto">
                <div>
                    <h1>LOGO</h1>
                </div>

                <div v-if="user?.name" class="flex space-x-6 ml-auto">
                    <router-link to="/">Inicio</router-link>
                    <h1 class="title">{{ user?.name }}</h1>

                    <router-link to="/cart" class="bg-blue-500 text-white">
                        <div>{{ cart_quantity }} Carrito</div>
                    </router-link>

                    <button  @click="logout" class="nav-link">Cerrar Sesión</button>

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
