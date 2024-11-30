<script setup>
import { ref, onMounted } from 'vue';
import api from '@/app';
import { TOKEN } from '@/config';

const orders = ref([]);

async function fetchOrders() {
  try {
    const response = await api.get('/api/payment_orders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
      }
    });
    console.log(response.data)
    orders.value = response.data.orders;
  } catch (error) {
    console.error('Error al cargar el carrito:', error);
  }
}

onMounted(fetchOrders);
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold">Pedidos Clientes</h2>
    <div v-for="order in orders" :key="order.id" class="p-4 bg-gray-100 mt-4 rounded">
      <h3 class="text-xl">Pedido #{{ order.id }}</h3>
      <p><strong>Estado:</strong> {{ order.status }}</p>

      <div v-for="product in order.products" :key="product.id" class="flex justify-between my-2">
        <span>{{ product.title }} (x{{ product.quantity }})</span>
        <span>${{ product.unit_price * product.quantity }}</span>
      </div>
    </div>
  </div>
</template>