<script setup>
import { ref, onMounted } from 'vue';
import api from '@/app';
import { useRouter } from 'vue-router';

const topCategories = ref([]);

const fetchCategories = async () => {
    try {
        const response = await api.get('/api/categories');
        topCategories.value = response.data.topCategories;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

const isOpen = ref(false);
const activeCategory = ref(false);
const subCategoriesCurrent = ref([]);
const categotyIDCurrent = ref(null)

const toggleSubcategories = (subcategory, categotyID) => {
    categotyIDCurrent.value = categotyID;
    subCategoriesCurrent.value = subcategory;
    activeCategory.value = !activeCategory.value;
};
const openCategories = () => {
    isOpen.value = !isOpen.value
    activeCategory.value = false;
}

const scrollToFooter = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight, 
    behavior: "smooth",
  });
};

onMounted(fetchCategories);

const router = useRouter();

const openAllProducts = () => {
    router.push({
        name: 'product-all-index',
      });
};
</script>

<template>
    <div class="bg-blue-800 text-slate-200 mb-4 mx-6 p-1 px-10 rounded-lg ">
        <button @click="openCategories" class="mx-10 rounded-lg p-1 hover:bg-blue-600 ">
            <p class="font-semibold ">Categorías</p>
        </button>
        <button @click="openAllProducts" class="mx-10 rounded-lg p-1 hover:bg-blue-600 ">
            <p class="font-semibold ">Todos los productos</p>
        </button>
        <button @click="scrollToFooter" class="mx-10 rounded-lg p-1 hover:bg-blue-600 ">
            <p class="font-semibold ">Contacto</p>
        </button>
        <button @click="scrollToFooter" class="mx-10 rounded-lg p-1 hover:bg-blue-600 ">
            <p class="font-semibold ">Medios de pago</p>
        </button>
        <div class="mt-2" v-if="isOpen">
            <ul>
                <li v-for="category in topCategories" :key="category.id" class="relative group">
                    <button @click="toggleSubcategories(category.categories, category.id)"
                        class="w-auto text-left text-slate-200 py-1 px-4 rounded-lg hover:bg-blue-600">
                        {{ category.name }}
                    </button>
                    <ul v-if="activeCategory && categotyIDCurrent == category.id"
                        class="flex flex-wrap gap-2 bg-blue-500 rounded-lg ">
                        <li v-for="subCategory in subCategoriesCurrent" :key="subCategory.id"
                            class="w-100">
                            <router-link  :to="{ path: '/vista-productos-categoria', query: { id: subCategory.id } }"
                                class="block py-2 px-4 text-slate-200 rounded-lg hover:bg-blue-600">
                                - {{ subCategory.name }}
                            </router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
