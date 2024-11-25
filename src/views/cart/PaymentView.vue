<template>
  <div id="wallet_container"></div>
</template>

<script setup>
import { mp } from '@/composables/MercadoPago';
import { ref, onMounted } from 'vue';
import api from '@/app';
import { TOKEN } from '@/config';

const preferenceId = ref(null);

const products = [
  {
    id: 1,
    title: 'Producto_1',
    quantity: 1,
    unit_price: 1000,
  },
  {
    id: 2,
    title: 'Producto_2',
    quantity: 2,
    unit_price: 1500,
  },
  {
    id: 3,
    title: 'Producto_3',
    quantity: 3,
    unit_price: 2000,
  },
];

const fetchPreferenceId = async () => {
  console.log(products);
  try {
    const response = await api.post(
      '/api/process_payment',
      { products },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
        }
      }
    );
    preferenceId.value = response.data.preference;
    console.log(response.data);

    if (preferenceId.value) {
      mp.bricks().create("wallet", "wallet_container", {
        initialization: {
          preferenceId: preferenceId.value.id,
          redirectMode: 'modal'
        },
        customization: {
          texts: {
            valueProp: 'smart_option',
          },
        },
      });
    } else {
      console.error("No se obtuvo un preferenceId válido.");
    }
  } catch (error) {
    console.error("Error al obtener la preferencia de pago:", error);
  }
};

onMounted(fetchPreferenceId);
</script>

<style></style>
