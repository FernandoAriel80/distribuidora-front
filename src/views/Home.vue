<script setup>
import Layout from '@/layout/Layout.vue';
import banner1 from '@/assets/image/distribuidoraInicio.png'
import banner2 from '@/assets/image/banner1.png'
import ProductRow from "@/components/ProductRow.vue";
import ProductAllRow from '@/components/ProductAllRow.vue';

const navidad = 'navidad';
</script>
<template>
   <Layout />
   <div class="sm:mx-10 font-sans">
      <div>
         <img :src="banner1" alt="Banner" class="w-full h-50" />
      </div>
      <h4 class="text-slate-600 text-2xl w-full sans-serif">Productos en Oferta</h4>
      <ProductAllRow/>
      <div>
         <img :src="banner2" alt="Banner" class="w-full h-50" />
      </div>
      <h4 class="text-slate-600 text-2xl w-full sans-serif">Bebidas</h4>
      <ProductRow :category="10" />
      <div>
         <img :src="banner1" alt="Banner" class="w-full h-50" />
      </div>
      <h4 class="text-slate-600 text-2xl w-full sans-serif">Fideos y Pastas</h4>
      <ProductRow :category="1" />
   </div>

</template>