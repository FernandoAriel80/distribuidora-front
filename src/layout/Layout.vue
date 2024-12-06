<script setup>
import CategoryMenu from '@/components/CategoryMenu.vue';
import { useAuth } from '@/composables/UserAuth';
import { useCartStore } from '@/stores/UseCartStore'
import logo from "@/assets/icon/logo.png";
import { ref } from "vue";

const cartStore = useCartStore()
const { logout, user, fetchUser } = useAuth();

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
        <header class=" text-slate-600">
            <nav class="flex items-center justify-between p-4 px-10 mx-auto">
                <div>
                    <img :src="logo" alt="Logo" class="w-40 h-15" />
                </div>

                <div v-if="user?.name" class="flex space-x-6 ml-auto">
                    <router-link class="relative inline-block py-2 px-4 rounded-lg hover:bg-blue-800 hover:text-white" to="/">Inicio</router-link>
                    <h1 class="title relative inline-block py-2 px-4 rounded-lg">{{ user?.name }}</h1>

                    <router-link to="/carrito"
                        class="relative inline-block py-2 px-4 rounded-lg hover:bg-blue-800 hover:text-white">
                        <div class="flex items-center">
                            <span>Carrito</span>
                            <span v-if="cartStore.cartQuantity >= 0"
                                class="absolute top-0 right-0 w-5 h-5 bg-blue-600 text-xs text-white font-bold rounded-full flex items-center justify-center -mt-2 -mr-2">
                                {{ cartStore.cartQuantity }}
                            </span>
                        </div>
                    </router-link>

                    <!-- /////////////////////////////// -->
                    <div class="relative inline-block text-left">
                        <!-- Icono de perfil -->
                        <button @click="toggleMenu"  class="relative inline-block py-2 px-4 rounded-lg hover:bg-blue-800 hover:text-white">
                            Menu
                        </button>

                        <!-- Menú desplegable -->
                        <div v-if="isOpen"
                            class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <ul class="py-2">
                                <li>
                                    <router-link class="block px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white"
                                        to="/perfil">Perfil</router-link>
                                </li>
                                <li>
                                    <div v-if="user?.role === 'admin' || user?.role === 'super_admin'">
                                        <router-link class="block px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white"
                                            to="/menu">Administración</router-link>
                                    </div>
                                </li>
                                <li>
                                    <button @click="logout"
                                        class="block px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white">Cerrar
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

        <main>
            <CategoryMenu />
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
