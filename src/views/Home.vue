<script setup>
import Layout from '@/layout/Layout.vue';
import banner1 from '@/assets/image/distribuidoraInicio.png'
import banner2 from '@/assets/image/banner1.png'
import ProductRow from "@/components/ProductRow.vue";
import ProductAllRow from '@/components/ProductAllRow.vue';
import banner_fondo_3 from '@/assets/image/fondo_banner3.png';
import banner_fondo_2 from '@/assets/image/fondo_banner2.png';

const navidad = 'navidad';
</script>
<template>
   <Layout />
   <div class="sm:mx-10 font-sans">
      <div>
         <img :src="banner1" alt="Banner" class="w-full h-50" />
      </div>
      <div class="relative bg-gradient-to-r from-orange-500 to-red-600 text-white mt-4">
         <div class="absolute inset-0">
            <img :src="banner_fondo_2" alt="fondo Banner" class="w-full h-full object-cover opacity-50" />
         </div>
         <div class="relative container mx-auto px-4 py-16 text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-4">¡Descuentos exclusivos!</h1>
            <p class="text-lg md:text-2xl mb-6">Hasta 40% de descuento en productos seleccionados.</p>
         </div>
      </div>

      <h4 class="text-slate-600 text-2xl w-full sans-serif">Productos en Oferta</h4>
      <ProductAllRow />
      <div>
         <img :src="banner2" alt="Banner" class="w-full h-64" />
      </div>
      <h4 class="text-slate-600 text-2xl w-full sans-serif">Bebidas</h4>
      <ProductRow :category="10" />
      
      <div class="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
         <div class="absolute inset-0">
            <img :src="banner_fondo_3" alt="fondo Banner" class="w-full h-full object-cover opacity-50" />
         </div>
         <div class="relative container mx-auto px-4 py-16 text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-4">¡Descubre nuestras ofertas exclusivas!</h1>
            <p class="text-lg md:text-2xl mb-6">Descuentos en productos por mayor.</p>
         </div>
      </div>

      <h4 class="text-slate-600 text-2xl w-full sans-serif">Fideos y Pastas</h4>
      <ProductRow :category="8" />
   </div>

</template>