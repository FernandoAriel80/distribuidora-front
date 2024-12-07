<script setup>
import Layout from '@/layout/Layout.vue';
import banner1 from '@/assets/image/banner1.png'
import ProductRow from "@/components/ProductRow.vue";
</script>
<template>
   <Layout />
   <div class="mx-20">
      <div>
         <img :src="banner1" alt="Banner" class="w-full h-50" />
      </div>
      <ProductRow category="Café" :itemsPerPage="5" />

      <div>
         <img :src="banner1" alt="Banner" class="w-full h-50" />
      </div>


      <div>
         <img :src="banner1" alt="Banner" class="w-full h-50" />
      </div>
      <h1>Home</h1>

   </div>
</template>