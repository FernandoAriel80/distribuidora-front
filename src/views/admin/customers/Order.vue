<template>
    <div>
      <h2 class="text-2xl font-bold">Mis Pedidos</h2>
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
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const orders = ref([]);
  
  async function fetchOrders() {
    const response = await fetch('/api/orders');
    orders.value = await response.json();
  }
  
  onMounted(fetchOrders);
  </script>
