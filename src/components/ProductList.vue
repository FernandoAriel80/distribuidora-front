<template>
    <div>
        <h1>Lista de Productos</h1>
        <ul>
            <li v-for="product in products" :key="product.id">
                {{ product.name }} - ${{ product.price }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from './api';

const products = ref([]);

const fetchProducts = async () => {
    try {
        const response = await api.get('/products');
        products.value = response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

onMounted(fetchProducts);
</script>
