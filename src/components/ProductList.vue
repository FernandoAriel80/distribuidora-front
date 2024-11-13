<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
});
</script>

<template>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.name }}
      </li>
    </ul>
  </template>
  
