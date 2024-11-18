<<<<<<< HEAD
<template>
    <div>
        <h1>Lista de Productos</h1>
        <ul>
            <li v-for="product in products.products" :key="product.id">
                {{ product.name }} - ${{ product.price }}
            </li>
        </ul>
    </div>
</template>

=======
>>>>>>> rama1
<script setup>
import { defineProps } from 'vue';

<<<<<<< HEAD
const products = ref([]);

const fetchProducts = async () => {
    try {
        const response = await api.get('/api/products');
       
        products.value = response.data;
        console.log( products.value.products);
    } catch (error) {
        console.error('Error fetching productsaa:', error);
    }
   
};

onMounted(fetchProducts);
=======
const props = defineProps({
  products: {
    type: Array,
    required: true
  }
});
>>>>>>> rama1
</script>

<template>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.name }}
      </li>
    </ul>
  </template>
  
