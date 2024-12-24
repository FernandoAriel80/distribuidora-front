<script setup>
import { ref, onMounted } from 'vue';
import api from '@/app';
import { BASE_URL } from '@/config';
import SuccessMessage from '@/components/SuccessMessage.vue';
import { showMessage, messageAlert } from '@/functions/MessageAlert';
import { useCartStore } from '@/stores/UseCartStore'
import { debounce } from 'lodash'

const props = defineProps({
    category: {
        type: Number,
        required: true,
    },
    filter: {
        type: Number,
        required: true,
    }
});

const cartStore = useCartStore();
const products = ref([]);
const pagination = ref({
    current_page: 1,
    last_page: 1,
});

const perPage = props.filter;
const loading = ref(true)
const fetchProducts = async () => {

    try {
        const response = await api.get('/api/',
            {
                params: {
                    category: props.category,
                    page: pagination.value.current_page,
                    per_page: perPage,
                },
            }
        );
        console.log(response.data.products.data)
        products.value = response.data.products.data;
        pagination.value = {
            current_page: response.data.products.current_page,
            last_page: response.data.products.last_page,
        };
        loading.value = false
    } catch (error) {
        console.error(error);
    }
};

const nextPage = () => {
    if (pagination.value.current_page < pagination.value.last_page) {
        pagination.value.current_page++;
        fetchProducts();
    }
};

const prevPage = () => {
    if (pagination.value.current_page > 1) {
        pagination.value.current_page--;
        fetchProducts();
    }
};


onMounted(() => {
    fetchProducts();
});

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
    <div class="relative my-4">
        <div class="flex overflow-hidden py-2 px-6 bg-gray-100 rounded-2xl">
            <div v-if="loading">
                <h1>CARGANDO CONTENIDO......</h1>
            </div>
            <div v-else v-for="product in products" :key="product.id" class="p-2 m-1 bg-white rounded-2xl">
                <div class="max-w-52 h-100 "  @click="selectProduct(product)">
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
                            <span v-if="product.type.id == 1" class="text-gray-800 font-bold text-xs">Unidad: $
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
                                <span v-if="product.bulk_unit_price" class="text-green-600 font-bold text-xs">
                                    Oferta por Bulto: ${{
                                        formatNumber(product.bulk_unit_price) }}</span>
                            </div>
                        </div>
                        <div v-else class="flex items-center justify-between mb-2">
                            <span v-if="product.type.id == 1" class="text-gray-800 font-bold text-xs">Unidad:
                                ${{
                                    formatNumber(product.unit_price) }}</span>
                            <span v-if="product.type.id == 2" class="text-gray-800 font-bold text-xs">Kg:
                                ${{
                                    formatNumber(product.unit_price) }}</span>
                            <span v-if="product.bulk_unit_price" class="text-gray-800 font-bold text-xs">Bulto:
                                ${{
                                    formatNumber(product.bulk_unit_price) }}</span>
                        </div>
                        <div v-if="product.stock == 0" class="flex items-center justify-between mb-2">
                            <span class="text-red-500 text-xs">Sin stock</span>
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
                <SuccessMessage class="fixed bottom-40 left-1/2 transform -translate-x-1/2 z-50"
                    v-if="currentIdMessage" :message="successMessage" />
            </div>
        </div>
        <!-- Botón Prev -->
        <div class="absolute top-1/2 -translate-y-1/2 left-2 z-10">
            <button @click="prevPage" :disabled="pagination.current_page === 1"
                class="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                < </button>
        </div>

        <!-- Botón Next -->
        <div class="absolute top-1/2 -translate-y-1/2 right-2 z-10">
            <button @click="nextPage" :disabled="pagination.current_page === pagination.last_page"
                class="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                >
            </button>
        </div>
    </div>
</template>

<style scoped>
/* .overflow-hidden {
    max-width: 100%;
} */
</style>
