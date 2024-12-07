<script setup>
import { ref, watch, onMounted } from 'vue';
import api from '@/app';
import { BASE_URL } from '@/config';
import SearchInput from '@/components/SearchInput.vue';
import Pagination from '@/components/Pagination.vue';
import SuccessMessage from '@/components/SuccessMessage.vue';
import { showMessage,messageAlert } from '@/functions/MessageAlert';
import { useCartStore } from '@/stores/UseCartStore'
import { debounce } from 'lodash'

const cartStore = useCartStore();
const products = ref([]);
const categories = ref([]);
const message = ref('');
const search = ref('');
const category = ref('');
const sort = ref('rel');
const loading = ref(true);
const pagination = ref(null);

const fetchPage = async (url = '/api/') => {
   try {
      const response = await api.get(url, {
         params: {
            search: search.value,
            category: category.value,
            sort: sort.value,
         },
      });
      products.value = response.data.products.data;
      categories.value = response.data.categories;
      pagination.value = {
         current_page: response.data.products.current_page,
         last_page: response.data.products.last_page,
         next_page_url: response.data.products.next_page_url,
         prev_page_url: response.data.products.prev_page_url,
      };
      loading.value = false;
   } catch (error) {
      console.error('Error al obtener productos:', error);
   }
}

onMounted(() => {
   fetchPage();
});

watch([search, sort, category], () => {
   fetchPage();
});

onMounted(() => {
   cartStore.fetchCartItems()
})

const currentIdMessage = ref();

const addProductToCart = debounce(async (productId,typePrice) => {
   await cartStore.addToCart(productId,typePrice);
   cartStore.fetchCartItems();
   currentIdMessage.value = productId;
   addCartMessage();
}, 300) 

///// message
const successMessage = ref(messageAlert);

function addCartMessage() {
    showMessage('Agregado al carrito.');
}

///validad numero
const isNumber = (value) => {
      return !isNaN(value) && typeof value === 'number';
    }
</script>

<template>
   <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4 text-gray-800">Productos Disponibles</h1>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
         <aside class="md:col-span-1">
            <div class="bg-white shadow-md p-4 rounded-md max-w-xs w-48">
               <h2 class="text-sm font-semibold mb-2">Filtrar por categoría</h2>
               <ul class="space-y-1">
                  <li>
                     <label class="flex items-center text-sm">
                        <input type="radio" v-model="category" value="" class="mr-1.5 h-3 w-3" />
                        Ninguno
                     </label>
                  </li>
                  <li v-for="categoryItem in categories" :key="categoryItem.id">
                     <label class="flex items-center text-sm">
                        <input type="radio" v-model="category" :value="categoryItem.name" class="mr-1.5 h-3 w-3" />
                        {{ categoryItem.name }}
                     </label>
                  </li>
               </ul>
            </div>
         </aside>

         <section class="md:col-span-3">
            <div>
               <SearchInput v-model:searchValue="search" />
               <select v-model="sort" class="border p-2 mb-4 rounded">
                  <option value="rel">Relevante</option>
                  <option value="lPrice">Precio: Más barato</option>
                  <option value="hPrice">Precio: Más caro</option>
               </select>
            </div>
            <div v-if="loading">
               <h1>CARGANDO CONTENIDO......</h1>
            </div>
            <div v-else>
               <div v-if="products.length > 0">
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-full">
                     <div v-for="product in products" :key="product.id"
                        class="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col justify-between w-full">
                        <div>
                           <div class="relative">
                              <img :src="`${BASE_URL}/storage/${product.image_url}`" alt="Imagen del producto"
                                 class="w-full h-60 object-cover rounded-t-lg">
                              <div v-if="product.percent_off > 0"
                                 class="absolute top-2 left-2 bg-red-500 text-white px-1 py-0.5 rounded text-xs">
                                 {{ product.percent_off }}% OFF
                              </div>
                           </div>
                           <div class="p-2">
                              <h2 class="text-sm font-semibold text-gray-800 mb-1">{{ product.name }}</h2>
                              <p class="text-gray-500 text-xs mb-1">{{ product.description }}</p>
                              <div v-if="product.offer" class="flex items-center justify-between mb-2">
                                 <span v-if="product.type.id == 1" class="text-gray-800 font-bold text-xs">Unidad: $<p
                                       class="line-through">{{ product.old_price }}</p></span>
                                 <span v-if="product.type.id == 2" class="text-gray-800 font-bold text-xs">Kg: $<p
                                       class="line-through">{{ product.old_price }}</p></span>
                                 <div>
                                    <span class="text-green-600 font-bold text-xs"> Oferta Unidad: ${{
                                       product.price_offer }}</span>
                                    <br>
                                    <span v-if="product.bulk_unit_price" class="text-green-600 font-bold text-xs">
                                       Oferta por Bulto: ${{
                                          product.bulk_unit_price }}</span>
                                 </div>
                              </div>
                              <div v-else class="flex items-center justify-between mb-2">
                                 <span v-if="product.type.id == 1" class="text-gray-800 font-bold text-xs">Unidad: ${{
                                    product.unit_price }}</span>
                                 <span v-if="product.type.id == 2" class="text-gray-800 font-bold text-xs">Kg: ${{
                                    product.unit_price }}</span>
                                 <span v-if="product.bulk_unit_price" class="text-gray-800 font-bold text-xs">Bulto: ${{
                                    product.bulk_unit_price }}</span>
                              </div>
                              <div v-if="product.stock == 0" class="flex items-center justify-between mb-2">
                                 <span class="text-red-500 text-xs">Sin stock</span>
                              </div>
                           </div>
                        </div>

                        <div v-if="product.type.id == 1" class="p-2">
                           <label class="flex items-center text-sm">
                              <input type="radio" v-model="product.catalog_id" value="unit" class="mr-1.5 h-3 w-3" />
                              x1 Unidad
                           </label>
                           <label class="flex items-center text-sm">
                              <input type="radio" v-model="product.catalog_id" value="bulk" class="mr-1.5 h-3 w-3" />
                              x{{ product.bulk_unit }} Bulto
                           </label>
                        </div>

                        <div class="p-2 mt-auto">
                           <button @click="addProductToCart(product.id,isNumber(product.catalog_id) ? 'unit' : product.catalog_id)" :disabled="product.stock == 0"
                              class="w-full bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold transition-colors  disabled:bg-gray-100 disabled:text-gray-400">
                              Añadir
                           </button>
                        </div>
                        <!-- Mensaje de éxito, visible solo si successMessage tiene valor -->
                        <SuccessMessage v-if="currentIdMessage == product.id" :message="successMessage" />
                     </div>
                  </div>

                  <Pagination :pagination="pagination" :fetchPage="fetchPage" />
               </div>
               <div v-else>
                  <h1>No hay productos</h1>
               </div>
            </div>

         </section>
      </div>
   </div>
</template>
