<script setup>
import { mp } from "@/stores/MercadoPago";
import { ref, onMounted } from "vue";
import api from "@/app";
import { TOKEN } from "@/config";
import { useCartStore } from '@/stores/UseCartStore'

const cartStore = useCartStore()

onMounted(() => {
  cartStore.fetchCartItems()
})

const isLoading = ref(true);
const preferenceId = ref(null);

const fetchPreferenceId = async () => {
  try {
    const response = await api.post(
      "/api/process_mercado_pago_payment",
      { products: cartStore.formattedItems },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
        },
      }
    );
    console.log(response.data.preference)
    preferenceId.value = response.data.preference;

    if (preferenceId.value) {
      mp.bricks().create("wallet", "wallet_container", {
        initialization: {
          preferenceId: preferenceId.value.id,
          redirectMode: "modal",
        },
        customization: {
          texts: {
            valueProp: "smart_option",
          },
        },
      });
    } else {
      console.error("No se obtuvo un preferenceId válido.");
    }
  } catch (error) {
    console.error("Error al obtener la preferencia de pago:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPreferenceId);
</script>
<template>
  <div class="flex justify-center items-center min-h-[100px]">
    <div v-if="isLoading" class="flex justify-center items-center space-x-2">
      <div class="loader"></div>
      <span class="text-gray-500">Cargando Mercado Pago...</span>
    </div>
    <div v-else id="wallet_container" class="w-full"></div>
  </div>
</template>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>