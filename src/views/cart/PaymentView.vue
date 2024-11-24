<template>
    <div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Resumen de Compra</h1>
  
      <!-- Lista de productos en el carrito -->
      <div v-for="product in products" :key="product.id" class="flex justify-between items-center mb-4">
        <div>
          <p class="text-lg font-medium text-gray-700">{{ product.title }}</p>
          <p class="text-sm text-gray-500">Cantidad: {{ product.quantity }}</p>
        </div>
        <p class="text-lg font-semibold text-gray-800">${{ product.quantity * product.unit_price }}</p>
      </div>
  
      <hr class="my-4" />
  
      <!-- Total de la compra -->
      <div class="flex justify-between items-center">
        <span class="text-xl font-bold text-gray-800">Total</span>
        <span class="text-xl font-bold text-blue-600">${{ total }}</span>
      </div>
  
      <!-- Botón para realizar el pago -->
      <button
        @click="initiatePayment"
        class="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Pagar con Mercado Pago
      </button>
  
      <!-- Mensaje de error -->
      <p v-if="error" class="text-red-500 text-center mt-4">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const products = ref([]); // Lista de productos en el carrito
  const total = ref(0); // Monto total de la compra
  const error = ref(null); // Mensaje de error si falla la API
  
  // Cargar los productos del carrito al montar el componente
  onMounted(() => {
    // Esto es solo un ejemplo. Asegúrate de reemplazarlo con tu lógica para cargar el carrito.
    products.value = [
      { id: 1, title: 'Producto 1', quantity: 2, unit_price: 500 },
      { id: 2, title: 'Producto 2', quantity: 1, unit_price: 1500 },
    ];
    
    // Calcular el total de la compra
    total.value = products.value.reduce((acc, product) => acc + product.quantity * product.unit_price, 0);
  });
  
  // Función para iniciar el pago
  async function initiatePayment() {
    try {
      // Llamada a la API para generar la preferencia de pago
      const response = await fetch('https://tu-api-url.com/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: products.value }),
      });
  
      if (!response.ok) throw new Error('Error al iniciar el pago');
  
      const data = await response.json();
      
      // Redirigir a la página de pago de Mercado Pago
      window.location.href = data.init_point;
    } catch (err) {
      error.value = 'Ocurrió un problema al procesar el pago. Por favor, intenta de nuevo.';
      console.error(err);
    }
  }
  </script>
  
  <style scoped>
  /* Estilos adicionales para mejorar la presentación */
  </style>
  