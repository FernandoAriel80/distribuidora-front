<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/app";
import { BASE_URL } from "@/config";
import Pagination from "./Pagination.vue";

const props = defineProps({
    category: {
        type: String,
        required: true,
    },
    itemsPerPage: {
        type: Number,
        default: 5,
    },
});

const products = ref([]);
const startIndex = ref(0);
const loading = ref(true);
const pagination = ref(null);

const fetchProducts = async () => {
    try {
        loading.value = true;
        const response = await api.get("/api/", {
            params: {
                category: props.category,
                limit: props.itemsPerPage,
                offset: startIndex.value,
            },
        });
        console.log(response.data)
        products.value = response.data.products;
        pagination.value = {
            current_page: response.data.products.current_page,
            last_page: response.data.products.last_page,
            next_page_url: response.data.products.next_page_url,
            prev_page_url: response.data.products.prev_page_url,
        };
    } catch (error) {
        console.error("Error al cargar productos:", error);
    } finally {
        loading.value = false;
    }
};

// Computed para obtener los productos actuales
const visibleProducts = computed(() =>
    products.value.slice(startIndex.value, startIndex.value + props.itemsPerPage)
);

// Navegación
const nextPage = () => {
    if (startIndex.value + props.itemsPerPage < products.value.length) {
        startIndex.value += props.itemsPerPage;
    }
};

const prevPage = () => {
    if (startIndex.value - props.itemsPerPage >= 0) {
        startIndex.value -= props.itemsPerPage;
    }
};

// Cargar productos al montar el componente
onMounted(fetchProducts);
</script>

<template>
    <div class="my-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 capitalize">{{ category }}</h2>

        <div v-if="loading" class="text-center">Cargando productos...</div>

        <div v-else>
            <!-- Contenedor de productos en hilera -->
            <div class="flex space-x-4 overflow">
                <div v-for="product in visibleProducts" :key="product.id"
                    class="bg-white shadow-lg rounded-lg p-4 w-60 flex-shrink-0">
                    <img :src="`${BASE_URL}/storage/${product.image_url}`" alt="Producto" class="w-full h-40 object-cover rounded-lg mb-2" />
                    <h3 class="text-sm font-bold text-gray-800">{{ product.name }}</h3>
                    <p class="text-gray-600 text-sm">{{ product.price }}</p>
                </div>
            </div>

            <!-- Botones de navegación -->
            <div class="flex justify-between mt-4">
                <button @click="prevPage" :disabled="startIndex === 0"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:text-gray-500">
                    Anterior
                </button>
                <button @click="nextPage" :disabled="startIndex + itemsPerPage >= products.value"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:text-gray-500">
                    Siguiente
                </button>
            </div>
        </div>
    </div>
</template>
