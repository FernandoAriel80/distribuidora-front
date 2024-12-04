<script setup>
import { useAuth } from '@/composables/UserAuth';
import { useCartStore } from '@/stores/UseCartStore'
import logo from "@/assets/logo.png";
import { ref } from "vue";

const cartStore = useCartStore()
const { logout, user,fetchUser  } = useAuth();

if (user.value == null) {
  fetchUser();
}
// Controlar la visibilidad del menú desplegable
const isOpen = ref(false);

// Alternar visibilidad del menú
const toggleMenu = () => {
    isOpen.value = !isOpen.value;
};


</script>

<template>
    <div>
        <header class="bg-blue-500 text-white">
            <nav class="flex items-center justify-between p-4 max-w-screen-lg mx-auto">
                <div>
                    <img :src="logo" alt="Logo" class="w-40 h-15" />
                </div>

                <div v-if="user?.name" class="flex space-x-6 ml-auto">
                    <router-link to="/">Inicio</router-link>
                    <h1 class="title">{{ user?.name }}</h1>

                    <router-link to="/carrito" class="bg-blue-500 text-white">
                        <div>{{ cartStore.cartQuantity }} Carrito</div>
                    </router-link>
                    <!-- /////////////////////////////// -->
                    <div class="relative inline-block text-left">
                        <!-- Icono de perfil -->
                        <button @click="toggleMenu" class="flex items-center focus:outline-none">
                            Menu
                        </button>

                        <!-- Menú desplegable -->
                        <div v-if="isOpen"
                            class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <ul class="py-2">
                                <li>
                                    <router-link class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        to="/perfil">Perfil</router-link>
                                </li>
                                <!-- <li>
                                    <a href="/cart" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        Cart
                                    </a>
                                </li> -->
                                <li>
                                    <div v-if="user?.role === 'admin' || user?.role === 'super_admin'">
                                        <router-link class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            to="/menu">Administración</router-link>
                                    </div>
                                </li>
                                <li>
                                    <button @click="logout"
                                        class="nav-link block px-4 py-2 text-gray-700 hover:bg-gray-100">Cerrar
                                        Sesión</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- //////////////////////////////// -->
                </div>

                <div v-else class="space-x-6 ml-auto">
                    <router-link to="/">Inicio</router-link>
                    <router-link to="/inicia-sesion">Iniciar Sesión</router-link>
                </div>
            </nav>
        </header>

        <main class="p-4">
            <slot />
        </main>
    </div>


</template>

<style>
/* Opcional: Ocultar el menú al hacer clic fuera */
html {
    height: 100%;
}
</style>
