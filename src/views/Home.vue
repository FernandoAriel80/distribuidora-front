
<template>
  <div id="app">
      <Layout/>
      <ProductList />
  </div>
</template>

<script setup>
import ProductList from '../components/ProductList.vue';
import Layout from '@/layout/Layout.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
/*   color: #2c3e50; */
  margin-top: 60px;
}
</style>
