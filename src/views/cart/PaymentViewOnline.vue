<script setup>
import MercadoPagoButton from './components/MercadoPagoButton.vue';
import OtherButton from './components/OtherButton.vue';
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/UseCartStore'

const cartStore = useCartStore()

onMounted(() => {
  cartStore.fetchCartItems()
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-8 flex w-2/3 max-w-4xl">
      <div class="flex-1 pr-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Métodos de Pago Online</h2>
        <p class="text-gray-600">
          Por favor, selecciona uno de los métodos de pago disponibles para continuar con tu compra. Asegúrate de
          verificar los detalles antes de proceder.<br>
          Los botones pueden tardar...
        </p>
      </div>
      <div class="flex-1 grid grid-cols-1 gap-4">
        <MercadoPagoButton />
        <OtherButton />
        <OtherButton />
        <OtherButton />
      </div>
    </div>
  </div>
</template>
