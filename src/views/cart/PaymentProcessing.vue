<script setup>
import { onMounted } from 'vue';
import api from '@/app';
import { TOKEN } from '@/config';
import { useRouter } from "vue-router";
import { useCartStore } from '@/stores/UseCartStore'
import Layout from '@/layout/LayoutPc.vue';


const urlParams = new URLSearchParams(window.location.search);
const status = urlParams.get('collection_status');
const paymentId = urlParams.get('collection_id');
const preferenceId = urlParams.get('preference_id');
const cartStore = useCartStore()
const router = useRouter();

onMounted(() => {
    cartStore.fetchCartItems()
})

async function fetchOrders() {
  try {
    const response = await api.post('/api/payment_mercado_pago_orders',
    {
      paymentId:paymentId,
      preferenceId:preferenceId,
    }, 
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
      }
    });
    if (response.data.status == 'success') {
      cartStore.removeAllCartOnline();
      router.push("/perfil");
    }
  } catch (error) {
    console.error('Error al cargar el carrito:', error);
  }
}

onMounted(fetchOrders);

</script>
<template>
  <Layout/>
  <div class="flex justify-center items-center h-screen">
    <div v-if="status == 'approved'" class="p-6 rounded-lg shadow-lg text-center border bg-green-100 text-green-700 border-green-500">
      <h1 class="text-2xl font-bold mb-2"> ¡Pago exitoso! </h1>
      <p class="text-lg">Tu pago se procesó correctamente. Gracias por tu compra.</p>
    </div>
    <div v-if="status == 'pending'" class="p-6 rounded-lg shadow-lg text-center border bg-yellow-100 text-yellow-700 border-yellow-500">
      <h1 class="text-2xl font-bold mb-2">Pago pendiente</h1>
      <p class="text-lg">Tu pago está siendo procesado. Recibirás una actualización pronto.</p>
    </div>
    <div v-if="status == ''" class="p-6 rounded-lg shadow-lg text-center border bg-red-100 text-red-700 border-red-500">
      <h1 class="text-2xl font-bold mb-2">El pago falló</h1>
      <p class="text-lg">Ocurrió un problema con tu pago. Por favor, inténtalo de nuevo.</p>
    </div>
  </div>
</template>