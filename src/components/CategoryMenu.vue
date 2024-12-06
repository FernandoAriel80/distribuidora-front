<script setup>
import { ref, onMounted } from 'vue';
import api from '@/app';

// Estado para almacenar las categorías
const topCategories = ref([]);


// Obtener las categorías y subcategorías desde la API
const fetchCategories = async () => {
    try {
        const response = await api.get('/api/categories');
        console.log(response.data.topCategories);
        topCategories.value = response.data.topCategories;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

const isOpen = ref(false);
const activeCategory = ref(false);
const subCategoriesCurrent = ref([]);
const categotyIDCurrent = ref(null)
// Función para alternar la visibilidad de las subcategorías
const toggleSubcategories = (subcategory, categotyID) => {
    categotyIDCurrent.value = categotyID;
    subCategoriesCurrent.value = subcategory;
    activeCategory.value = !activeCategory.value;
};
const openCategories = () => {
    isOpen.value = !isOpen.value
    activeCategory.value = false;
}

// Ejecutar la llamada a la API cuando el componente se monta
onMounted(fetchCategories);
</script>

<template>
    <div class="bg-blue-700 text-white mb-4 mx-6 p-1 px-10 rounded-lg ">
        <button @click="openCategories" class="mx-auto rounded-lg p-1 hover:bg-blue-600 ">
            <p class="font-semibold">Categorías</p>
        </button>
        <div class="mt-4" v-if="isOpen">
            <ul>
                <li v-for="category in topCategories" :key="category.id" class="relative group">
                    <button @click="toggleSubcategories(category.categories, category.id)"
                        class="w-auto text-left text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                        {{ category.name }}
                    </button>
                    <ul v-if="activeCategory && categotyIDCurrent == category.id"
                        class="flex flex-wrap gap-2 bg-blue-500 rounded-lg ">
                        <li v-for="subCategory in subCategoriesCurrent" :key="subCategory.id"
                            class="w-100 sm:w-1/2 md:w-1/3 lg:w-1/4">
                            <router-link :to="`/products/${subCategory.id}`"
                                class="block py-2 px-4 text-white rounded-lg hover:bg-blue-600">
                                - {{ subCategory.name }}
                            </router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
    <!--   <div class="bg-gray-800 text-white p-4">
        <div class="flex justify-between items-center">
            <h1 class="text-xl font-semibold">Categorías</h1>
        </div>
        <div class="mt-4">
            <ul>
                <li v-for="category in categories" :key="category.id" class="relative group">
                    <button @click="toggleSubcategories(category.id)"
                        class="w-full text-left text-white py-2 px-4 hover:bg-gray-700">
                        {{ category.name }}
                    </button>

                    <ul v-show="activeCategory === category.id" class="absolute left-0 top-0 bg-gray-700 w-full">
                        <li v-for="subCategory in category.subCategories" :key="subCategory.id">
                            <router-link :to="`/products/${subCategory.id}`"
                                class="block py-2 px-4 text-white hover:bg-gray-600">
                                {{ subCategory.name }}
                            </router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div> -->
</template>

<style scoped>
/* Personalización de la barra */
</style>