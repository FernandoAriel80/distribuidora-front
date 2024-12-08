<script setup>
import CategoryMenu from '@/components/CategoryMenu.vue';
import { useAuth } from '@/composables/UserAuth';
import { useCartStore } from '@/stores/UseCartStore'
import logo from "@/assets/icon/La_viejita_navidad.png";
import { useRouter } from 'vue-router';
import { ref } from "vue";
import api from '@/app';
import { BASE_URL } from '@/config';

const router = useRouter();
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

const searchQuery = ref("");
const products = ref([]);

const searchProducts = async () => {
    if (searchQuery.value.trim() === "") {
        products.value = [];
        return;
    }

    try {
        const response = await api.get("/api/search", {
            params: { query: searchQuery.value },
        });
        console.log(response.data)
        products.value = response.data.products;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

const selectProduct = (product) => {
    router.push({
        name: 'product-one-index',
        query: { id: product.id }
    });
};

</script>

<template>
    <div>
        <header class=" text-slate-600">
            <nav class="flex items-center justify-between p-2 px-10 mx-auto">
                <div>
                    <img :src="logo" alt="Logo" class="w-44 h-full" />
                </div>

                <!-- search -->
                <div class="md:mx-20 relative p-4 w-3/5">
                    <input v-model="searchQuery" @input="searchProducts" type="search" placeholder="Buscar productos..."
                        class="md:w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
                    <ul v-if="products.length && searchQuery.trim() !== ''"
                        class="md:w-96 absolute top-full left-0 w-full bg-white border rounded shadow-lg z-50">
                        <li v-for="product in products" :key="product.id" @click="selectProduct(product)"
                            class="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer">
                            <img :src="`${BASE_URL}/storage/${product.image_url}`" alt="Imagen del producto"
                                class="w-10 h-10 object-cover" />
                            <div class="p-1">
                                <h2 class="font-bold">{{ product.name }}</h2>
                                <p class="mt-2 font-semibold text-green-600">$ {{ product.unit_price }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <!--  search end-->

                <div v-if="user?.name" class="flex space-x-4 ml-auto">
                    <router-link class="relative inline-block py-2 px-4 rounded-lg hover:bg-blue-800 hover:text-white"
                        to="/">Inicio</router-link>
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
                        <button @click="toggleMenu"
                            class="relative inline-block py-2 px-4 rounded-lg hover:bg-blue-800 hover:text-white">
                            Menu
                        </button>

                        <!-- Menú desplegable -->
                        <div v-if="isOpen"
                            class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <ul class="py-2">
                                <li>
                                    <router-link
                                        class="block px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white"
                                        to="/perfil">Perfil</router-link>
                                </li>
                                <li>
                                    <div v-if="user?.role === 'admin' || user?.role === 'super_admin'">
                                        <router-link
                                            class="block px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white"
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
