<script setup>
import { ref, onMounted } from "vue";
import api from "@/app";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/UseCartStore";
import { BASE_URL } from "@/config";
import logoCart from "@/assets/icon/carrito.png";

const cartStore = useCartStore();

const props = defineProps({
  user: String,
  logout: Function,
  fetchUser: Function,
});
/* 

if (!props.user) {
  props.fetchUser();
} */
const topCategories = ref([]);

const fetchCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    topCategories.value = response.data.topCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const isOpen = ref(false);
const isOpenCategories = ref(false);
const activeCategory = ref(false);
const subCategoriesCurrent = ref([]);
const categotyIDCurrent = ref(null);

const toggleSubcategories = (subcategory, categotyID) => {
  categotyIDCurrent.value = categotyID;
  subCategoriesCurrent.value = subcategory;
  activeCategory.value = !activeCategory.value;
};
const openMenu = () => {
  isOpen.value = !isOpen.value;
  activeCategory.value = false;
  isOpenCategories.value = false;
};

const openCategories = () => {
  isOpenCategories.value = !isOpenCategories.value;
  activeCategory.value = false;
};
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
    name: "product-all-index",
  });
};

const searchQuery = ref("");
const products = ref([]);

const searchProducts = async () => {
  if (searchQuery.value.trim() === "") {
    products.value = [];
    return;
  }
  try {
    const response = await api.get("/api/search", {
      params: { query: searchQuery.value },
    });
    console.log(response.data);
    products.value = response.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const selectProduct = (product) => {
  router.push({
    name: "product-one-index",
    query: { id: product.id },
  });
};
</script>

<template>
  <div class="bg-blue-800 text-slate-200 w-full">
    <div class="flex justify-between mx-2">
      <button @click="openMenu" class="mx-2 rounded-lg p-1 active:bg-blue-600">
        <p class="font-semibold">Menu</p>
      </button>
      <!-- Barra de búsqueda -->
      <div class="w-auto relative text-gray-400 mx-2 p-1">
        <input
          v-model="searchQuery"
          @input="searchProducts"
          type="search"
          placeholder="Buscar productos..."
          class="w-full h-auto p-1 m-1 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM2 8a6 6 0 1 1 11.313 3.03l3.858 3.858a1 1 0 0 1-1.414 1.414l-3.858-3.858A6 6 0 0 1 2 8z"
            clip-rule="evenodd"
          />
        </svg>

        <!-- Resultados de búsqueda -->
        <ul
          v-if="products.length && searchQuery.trim() !== ''"
          class="absolute top-full left-0 w-full bg-white border rounded shadow-lg z-50"
        >
          <li
            v-for="product in products"
            :key="product.id"
            @click="selectProduct(product)"
            class="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
          >
            <img
              :src="`${BASE_URL}/storage/${product.image_url}`"
              alt="Imagen del producto"
              class="w-10 h-10 object-cover"
            />
            <div class="p-1">
              <h2 class="font-bold">{{ product.name }}</h2>
              <p class="mt-2 font-semibold text-green-600">$ {{ product.unit_price }}</p>
            </div>
          </li>
        </ul>
      </div>
      <router-link
        v-if="!props.user"
        class="relative inline-block rounded-lg m-auto mx-2 active:bg-blue-800 active:text-white"
        to="/inicia-sesion"
      >
        Ingresá
      </router-link>
      <router-link
        v-else
        to="/carrito"
        class="relative inline-block rounded-lg m-auto mx-2 active:bg-blue-800 active:text-white"
      >
        <div class="flex items-center p-1">
          <span>
            <div>
              <img :src="logoCart" alt="Logo" class="w-5 h-5" />
            </div>
          </span>
          <span
            v-if="cartStore.cartQuantity >= 0"
            class="absolute right-0 w-4 h-4 bg-white text-xs text-blue-800 font-bold rounded-full flex items-center justify-center -mt-6 -mr-2"
          >
            {{ cartStore.cartQuantity }}
          </span>
        </div>
      </router-link>
    </div>

    <!-- <button @click="openAllProducts" class="mx-10 rounded-lg p-1 hover:bg-blue-600">
      <p class="font-semibold">Todos los productos</p>
    </button>
    <button @click="scrollToFooter" class="mx-10 rounded-lg p-1 hover:bg-blue-600">
      <p class="font-semibold">Contacto</p>
    </button>
    <button @click="scrollToFooter" class="mx-10 rounded-lg p-1 hover:bg-blue-600">
      <p class="font-semibold">Medios de pago</p>
    </button>-->
    <div
      v-if="isOpen"
      class="absolute mt-2 w-48 h-auto bg-blue-600 border border-gray-200 rounded-lg shadow-lg z-50"
    >
      <ul>
        <li>
          <router-link
            class="relative inline-block rounded-lg p-2 active:bg-blue-800 active:text-white"
            to="/"
          >
            Inicio
          </router-link>
        </li>
      </ul>
      <div v-if="props.user">
        <ul>
          <li>
            <router-link
              class="relative inline-block rounded-lg p-2 active:bg-blue-800 active:text-white"
              to="/perfil"
            >
              Perfil
            </router-link>
          </li>
        </ul>
        <ul v-if="props.user?.role != 'cliente'">
          <li>
            <router-link
              class="relative inline-block rounded-lg p-2 active:bg-blue-800 active:text-white"
              to="/menu"
            >
              Administración
            </router-link>
          </li>
        </ul>
      </div>
      <ul>
        <li>
          <router-link
            class="relative inline-block rounded-lg p-2 active:bg-blue-800 active:text-white"
            to="/vista-todos-productos"
          >
            Todos Productos
          </router-link>
        </li>
      </ul>
      <!-- categorias -->
      <ul>
        <li>
          <button
            @click="openCategories"
            class="relative inline-block rounded-lg p-2 active:bg-blue-800 active:text-white"
          >
            Categorias
          </button>
        </li>
      </ul>
      <ul v-if="isOpenCategories">
        <li v-for="category in topCategories" :key="category.id" class="relative group">
          <button
            @click="toggleSubcategories(category.categories, category.id)"
            class="w-auto text-left text-slate-200 py-1 px-4 rounded-lg active:bg-blue-800 active:text-white"
          >
            * {{ category.name }}
          </button>
          <ul
            v-if="activeCategory && categotyIDCurrent == category.id"
            class="bg-blue-500 rounded-lg"
          >
            <li
              v-for="subCategory in subCategoriesCurrent"
              :key="subCategory.id"
              class="w-100"
            >
              <router-link
                :to="{
                  path: '/vista-productos-categoria',
                  query: { id: subCategory.id },
                }"
                class="block py-2 px-4 text-slate-200 rounded-lg active:bg-blue-800 active:text-white"
              >
                - {{ subCategory.name }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
      <ul v-if="props.user">
        <li>
          <button
            @click="props.logout"
            class="relative inline-block rounded-lg p-2 active:bg-blue-800 active:text-white"
          >
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </div>
    <!--  <div class="mt-2" v-if="isOpen">
      <ul >
        <li v-for="category in topCategories" :key="category.id" class="relative group">
          <button
            @click="toggleSubcategories(category.categories, category.id)"
            class="w-auto text-left text-slate-200 py-1 px-4 rounded-lg hover:bg-blue-600"
          >
            {{ category.name }}
          </button>
          <ul
            v-if="activeCategory && categotyIDCurrent == category.id"
            class="flex flex-wrap gap-2 bg-blue-500 rounded-lg"
          >
            <li
              v-for="subCategory in subCategoriesCurrent"
              :key="subCategory.id"
              class="w-100"
            >
              <router-link
                :to="{
                  path: '/vista-productos-categoria',
                  query: { id: subCategory.id },
                }"
                class="block py-2 px-4 text-slate-200 rounded-lg hover:bg-blue-600"
              >
                - {{ subCategory.name }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div> -->
  </div>
</template>
