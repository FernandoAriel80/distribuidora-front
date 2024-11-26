<script setup>
import { mp } from "@/stores/MercadoPago";
import { ref, onMounted } from "vue";
import api from "@/app";
import { TOKEN } from "@/config";

const isLoading = ref(true);
const preferenceId = ref(null);
const products = ref([]);

const fetchCartItems = async () => {
  try {
    const response = await api.get("/api/cart", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
      },
    });

    if (response.data.items) {
      const formattedItems = response.data.items.map((item) => {
        let unitPrice = 0;

        if (item.product.type_id === 1) {
          unitPrice =
            item.type_price === "unit"
              ? item.product.unit_price
              : item.product.bulk_unit_price;
        } else if (item.product.type_id === 2) {
          unitPrice = item.product.unit_price;
        }

        return {
          id: item.id,
          title: item.product.name,
          quantity: item.quantity,
          unit_price: unitPrice,
          stock: item.product.stock,
        };
      });
      return formattedItems;
    }
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
  }
};

const loadAndFilterCartItems = async () => {
  const cartItems = await fetchCartItems();
  if (cartItems) {
    const filteredItems = cartItems.filter((item) => item.quantity > 0);
    products.value = filteredItems;
  }
};

const fetchPreferenceId = async () => {
  try {
    await loadAndFilterCartItems();

    const response = await api.post(
      "/api/process_payment",
      { products: products.value },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
        },
      }
    );

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