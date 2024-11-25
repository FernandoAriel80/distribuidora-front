<template>
  <div id="wallet_container"></div>
</template>

<script setup>
import { mp } from '@/stores/MercadoPago';
import { ref, onMounted } from 'vue';
import api from '@/app';
import { TOKEN } from '@/config';

const fetchCartItems = async () => {
  try {
    const response = await api.get('/api/cart', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
      }
    });

    if (response.data.items) {
      const formattedItems = response.data.items.map((item) => {
        let unitPrice = 0;

        if (item.product.type_id === 1) {
          unitPrice = item.type_price === 'unit'
            ? item.product.unit_price
            : item.product.bulk_unit_price;
        } else if (item.product.type_id === 2) {
          unitPrice = item.product.unit_price;
        }

        return {
          id: item.id,
          title: item.product.name,
          quantity: item.quantity,
          unit_price: unitPrice
        };
      });
      return formattedItems;
    }
  } catch (error) {
    console.error('Error al cargar el carrito:', error);
  }
};

const preferenceId = ref(null);
const products = ref([]); 

const loadAndFilterCartItems = async () => {
  const cartItems = await fetchCartItems();
  if (cartItems) {
    const filteredItems = cartItems.filter(item => item.quantity > 0); 
    products.value = filteredItems;
  }
};

const fetchPreferenceId = async () => {
  try {

    await loadAndFilterCartItems();

    const response = await api.post(
      '/api/process_payment',
      { products: products.value }, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
        }
      }
    );

    console.log(response.data)
    preferenceId.value = response.data.preference;
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
