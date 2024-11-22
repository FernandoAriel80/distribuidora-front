<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/UserAuth';
const { logout } = useAuth();

const props = defineProps({
    user: Object
})
const router = useRouter();
const route = useRoute();

const cart_quantity = ref(0);
const isAuthenticated = ref(false); 

</script>

<template>
    <div>
        <header class="bg-blue-500 text-white">
            <nav class="flex items-center justify-between p-4 max-w-screen-lg mx-auto">
                <div>
                    <h1>LOGO</h1>
                </div>

                <div v-if="props.user?.name" class="flex space-x-6 ml-auto">
                    <router-link to="/">Inicio</router-link>
                    <h1 class="title">{{ props.user?.name }}</h1>

                    <router-link to="/cart" class="bg-blue-500 text-white">
                        <div>{{ cart_quantity }} Carrito</div>
                    </router-link>

                    <button  @click="logout" class="nav-link">Cerrar Sesión</button>

                    <div v-if="props.user?.role === 'admin' || props.user?.role === 'super_admin'">
                        <router-link to="/menu">Administración</router-link>
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
