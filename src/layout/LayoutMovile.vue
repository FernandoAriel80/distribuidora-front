<script setup>
import CategoryMenuMovile from "@/head/CategoryMenuMovile.vue";
import { useAuth } from "@/composables/UserAuth";
import { useCartStore } from "@/stores/UseCartStore";
import logo from "@/assets/icon/La_viejita_navidad.png";
import logoHome from "@/assets/icon/casa.png";
import logoCart from "@/assets/icon/carrito.png";
import logoUser from "@/assets/icon/usuario.png";
import logoInicia from "@/assets/icon/inicio-de-sesion.png";
import { useRouter } from "vue-router";
import { ref } from "vue";
import api from "@/app";
import { BASE_URL } from "@/config";

const router = useRouter();
const cartStore = useCartStore();
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
    <header class="text-slate-600">
      <nav class="flex flex-col items-center p-2 mx-auto space-y-4">
        <!-- Logo -->
        <div>
          <img :src="logo" alt="Logo" class="h-20" />
        </div>

       
      </nav>
    </header>

    <main>
      <CategoryMenuMovile :user="user" :logout="logout" :fetchUser="fetchUser"/>
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
