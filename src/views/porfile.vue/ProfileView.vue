<script setup>
import { ref, onMounted } from "vue";
import DataProfileView from "./components/DataProfileView.vue";
import UpdateProfileView from "./components/UpdateProfileView.vue";
import { useCartStore } from "@/stores/UseCartStore";
import { useAuth } from "@/composables/UserAuth";
import LayoutPc from "@/layout/LayoutPc.vue";
import LayoutMovile from "@/layout/LayoutMovile.vue";

const { user, fetchUser } = useAuth();

if (user.value == null) {
  fetchUser();
}

const cartStore = useCartStore();
onMounted(() => {
  cartStore.fetchCartItems();
});

// Controla qué vista se muestra
const currentView = ref("dataProfile");

// Función para cambiar la vista
const setView = (view) => {
  currentView.value = view;
};
</script>

<template>
  <div class="hidden sm:block">
    <!-- Layout para PC -->
    <LayoutPc />
  </div>
  <div class="sm:hidden">
    <!-- Layout para móviles -->
    <LayoutMovile />
  </div>
  <div class="flex max-w-8xl mx-auto p-6 space-x-4">
    <div class="flex flex-col space-y-4 w-1/4">
      <button
        @click="setView('dataProfile')"
        :class="[
          'w-full py-2 px-4 rounded text-white',
          currentView === 'dataProfile' ? 'bg-blue-500' : 'bg-gray-500',
        ]"
      >
        Datos Generales
      </button>
      <button
        v-if="user?.role != 'admin'"
        @click="setView('updateProfile')"
        :class="[
          'w-full py-2 px-4 rounded text-white',
          currentView === 'updateProfile' ? 'bg-blue-500' : 'bg-gray-500',
        ]"
      >
        Actualizar datos
      </button>
    </div>
    <div class="flex-grow bg-white shadow-md rounded-lg p-6">
      <component
        :is="currentView === 'dataProfile' ? DataProfileView : UpdateProfileView"
      />
    </div>
  </div>
</template>
