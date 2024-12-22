<script setup>
import { ref, watch, onMounted } from 'vue';
import api from '@/app';
import { useRoute } from 'vue-router';
import { BASE_URL } from '@/config';
import SearchInput from '@/components/SearchInput.vue';
import SuccessMessage from '@/components/SuccessMessage.vue';
import { showMessage, messageAlert } from '@/functions/MessageAlert';
import { useCartStore } from '@/stores/UseCartStore'
import { debounce } from 'lodash'
import Layout from '@/layout/LayoutPc.vue';
import Pagination from '@/components/Pagination.vue';

const cartStore = useCartStore();
const products = ref([]);
const loading = ref(true);
const search = ref('');
const pagination = ref(null);
const sort = ref('rel');

const fetchPage = async (url = '/api/getAll') => {
    try {

        const response = await api.get(url,
            {
                params: {
                    search: search.value,
                    sort: sort.value,
                },
            }
        );
        loading.value = false;
        products.value = response.data.products.data;
        pagination.value = {
            current_page: response.data.products.current_page,
            last_page: response.data.products.last_page,
            next_page_url: response.data.products.next_page_url,
            prev_page_url: response.data.products.prev_page_url,
        };
    } catch (error) {
        console.error('Error fetching productos:', error);
    }
};

onMounted(() => {
    fetchPage();
});

watch([search, sort], () => {
    searchDebounced();
});

const searchDebounced = debounce(() => {
    fetchPage();
}, 300);



onMounted(() => {
    cartStore.fetchCartItems()
})

import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/UserAuth';

const router = useRouter();
const selectProduct = (product) => {
    router.push({
        name: 'product-one-index',
        query: { id: product.id }
    });
};

const currentIdMessage = ref();
const currentUser = useAuth(); 
const addProductToCart = debounce(async (productId, typePrice) => {
    if (currentUser.user.value) {
        await cartStore.addToCart(productId, typePrice);
        cartStore.fetchCartItems();
        currentIdMessage.value = productId;
        addCartMessage();      
    }else{
        window.location.href= '/inicia-sesion'
    }
   
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
// Función para formatear números
const formatNumber = (value) => {
    return new Intl.NumberFormat("es-AR", {
        style: "decimal",
        minimumFractionDigits: 0,
    }).format(value);
};

</script>
<template>
    <Layout />
    <div class="mx-10 sm:mx-10 p-4">
        <h1 class="text-2xl font-bold mb-4 text-gray-800">Productos Disponibles</h1>
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
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-full">
                        <div v-for="product in products" :key="product.id"
                            class="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col justify-between w-full">
                            <div class="w-auto h-100 " @click="selectProduct(product)">
                                <div class="relative">
                                    <img :src="`${BASE_URL}/storage/${product.image_url}`" alt="Imagen del producto"
                                        class="w-60 h-60 object-cover rounded-t-lg">
                                    <div v-if="product.percent_off > 0"
                                        class="absolute top-2 left-2 bg-red-500 text-white px-1 py-0.5 rounded text-xs">
                                        {{ product.percent_off }}% OFF
                                    </div>
                                </div>
                                <div class="p-2 min-h-40">
                                    <h2 class="text-sm font-semibold text-gray-800 mb-1">{{ product.name }}</h2>
                                    <div class="p-2">
                                        <p class="text-sm break-words text-gray-500">
                                            {{ product.description }}
                                        </p>
                                    </div>

                                    <div v-if="product.offer" class="flex items-center justify-between mb-2">
                                        <span v-if="product.type.id == 1"
                                            class="text-gray-800 font-bold text-xs">Unidad: $
                                            <p class="line-through">{{
                                                formatNumber(product.old_price) }}</p>
                                        </span>
                                        <span v-if="product.type.id == 2" class="text-gray-800 font-bold text-xs">Kg: $
                                            <p class="line-through">{{
                                                formatNumber(product.old_price) }}</p>
                                        </span>
                                        <div>
                                            <span class="text-green-600 font-bold text-xs"> Oferta Unidad: ${{
                                                formatNumber(product.price_offer) }}</span>
                                            <br>
                                            <span v-if="product.bulk_unit_price"
                                                class="text-green-600 font-bold text-xs">
                                                Oferta por Bulto: ${{
                                                    formatNumber(product.bulk_unit_price) }}</span>
                                        </div>
                                    </div>
                                    <div v-else class="flex items-center justify-between mb-2">
                                        <span v-if="product.type.id == 1"
                                            class="text-gray-800 font-bold text-xs">Unidad:
                                            ${{
                                                formatNumber(product.unit_price) }}</span>
                                        <span v-if="product.type.id == 2" class="text-gray-800 font-bold text-xs">Kg:
                                            ${{
                                                formatNumber(product.unit_price) }}</span>
                                        <span v-if="product.bulk_unit_price"
                                            class="text-gray-800 font-bold text-xs">Bulto:
                                            ${{
                                                formatNumber(product.bulk_unit_price) }}</span>
                                    </div>
                                    <div v-if="product.stock == 0" class="flex items-center justify-between mb-2">
                                        <span class="text-red-500 text-xs">Sin stock</span>
                                    </div>
                                    <div v-if="product.type.id == 1" class="p-2">
                                        <label class="flex items-center text-sm">
                                            <input type="radio" v-model="product.catalog_id" value="unit"
                                                class="mr-1.5 h-3 w-3" />
                                            x1 Unidad
                                        </label>
                                        <label class="flex items-center text-sm">
                                            <input type="radio" v-model="product.catalog_id" value="bulk"
                                                class="mr-1.5 h-3 w-3" />
                                            x{{ product.bulk_unit }} Bulto
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class=" p-2 mt-auto">
                                <button
                                    @click="addProductToCart(product.id, isNumber(product.catalog_id) ? 'unit' : product.catalog_id)"
                                    :disabled="product.stock == 0"
                                    class="w-full bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold transition-colors  disabled:bg-gray-100 disabled:text-gray-400">
                                    Agregar
                                </button>
                            </div>

                            <SuccessMessage class="fixed bottom-40 left-1/2 transform -translate-x-1/2"
                                v-if="currentIdMessage == product.id" :message="successMessage" />
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
</template>