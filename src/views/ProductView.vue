<script setup>
import { ref, onMounted, watch } from "vue";
import api from "@/app";
import { useRoute } from "vue-router";
import { BASE_URL } from "@/config";
import { useCartStore } from "@/stores/UseCartStore";
import SuccessMessage from "@/components/SuccessMessage.vue";
import { showMessage, messageAlert } from "@/functions/MessageAlert";
import { debounce } from "lodash";
import LayoutPc from "@/layout/LayoutPc.vue";
import LayoutMovile from "@/layout/LayoutMovile.vue";

const cartStore = useCartStore();
const product = ref(null);
const route = useRoute();

const fetchProduct = async () => {
  const productId = route.query.id;
  try {
    const response = await api.get("/api/search/show/" + productId);
    console.log(response.data);
    product.value = response.data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

onMounted(() => {
  fetchProduct();
});

onMounted(() => {
  cartStore.fetchCartItems();
});
watch(() => route.query.id, fetchProduct);

const currentIdMessage = ref();

const addProductToCart = debounce(async (productId, typePrice) => {
  await cartStore.addToCart(productId, typePrice);
  cartStore.fetchCartItems();
  currentIdMessage.value = productId;
  addCartMessage();
}, 300);

///// message
const successMessage = ref(messageAlert);

function addCartMessage() {
  showMessage("Agregado al carrito.");
}

///validad numero
const isNumber = (value) => {
  return !isNaN(value) && typeof value === "number";
};
// Función para formatear números
const formatNumber = (value) => {
  return new Intl.NumberFormat("es-AR", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(value);
};
</script>
<template>
  <div class="hidden sm:block">
    <!-- Layout para PC -->
    <LayoutPc />
  </div>
  <div class="sm:hidden">
    <!-- Layout para móviles -->
    <LayoutMovile />
  </div>

  <div class="p-4">
    <div
      v-if="product"
      class="max-w-md mx-auto bg-white shadow-lg rounded overflow-hidden"
    >
      <div class="h-100">
        <div class="relative">
          <img
            :src="`${BASE_URL}/storage/${product.image_url}`"
            alt="Imagen del producto"
            class="w-full h-72 object-cover rounded-t-lg"
          />
          <div
            v-if="product.percent_off > 0"
            class="absolute top-2 left-2 bg-red-500 text-white px-1 py-0.5 rounded text-xs"
          >
            {{ product.percent_off }}% OFF
          </div>
        </div>
        <div class="p-2">
          <h2 class="text-sm font-semibold text-gray-800 mb-1">{{ product.name }}</h2>
          <div class="p-2">
            <p class="text-sm break-words text-gray-500">
              {{ product.description }}
            </p>
          </div>

          <div v-if="product.offer" class="flex items-center justify-between mb-2">
            <span v-if="product.type.id == 1" class="text-gray-800 font-bold text-xs"
              >Unidad: $
              <p class="line-through">{{ formatNumber(product.old_price) }}</p>
            </span>
            <span v-if="product.type.id == 2" class="text-gray-800 font-bold text-xs"
              >Kg: $
              <p class="line-through">{{ formatNumber(product.old_price) }}</p>
            </span>
            <div>
              <span class="text-green-600 font-bold text-xs">
                Oferta Unidad: ${{ formatNumber(product.price_offer) }}</span
              >
              <br />
              <span
                v-if="product.bulk_unit_price"
                class="text-green-600 font-bold text-xs"
              >
                Oferta por Bulto: ${{ formatNumber(product.bulk_unit_price) }}</span
              >
            </div>
          </div>
          <div v-else class="flex items-center justify-between mb-2">
            <span v-if="product.type.id == 1" class="text-gray-800 font-bold text-xs"
              >Unidad: ${{ formatNumber(product.unit_price) }}</span
            >
            <span v-if="product.type.id == 2" class="text-gray-800 font-bold text-xs"
              >Kg: ${{ formatNumber(product.unit_price) }}</span
            >
            <span v-if="product.bulk_unit_price" class="text-gray-800 font-bold text-xs"
              >Bulto: ${{ formatNumber(product.bulk_unit_price) }}</span
            >
          </div>
          <div v-if="product.stock == 0" class="flex items-center justify-between mb-2">
            <span class="text-red-500 text-xs">Sin stock</span>
          </div>
          <div v-if="product.type.id == 1" class="p-2">
            <label class="flex items-center text-sm">
              <input
                type="radio"
                v-model="product.catalog_id"
                value="unit"
                class="mr-1.5 h-3 w-3"
              />
              x1 Unidad
            </label>
            <label class="flex items-center text-sm">
              <input
                type="radio"
                v-model="product.catalog_id"
                value="bulk"
                class="mr-1.5 h-3 w-3"
              />
              x{{ product.bulk_unit }} Bulto
            </label>
          </div>
        </div>
      </div>

      <div class="p-2 mt-auto">
        <button
          @click="
            addProductToCart(
              product.id,
              isNumber(product.catalog_id) ? 'unit' : product.catalog_id
            )
          "
          :disabled="product.stock == 0"
          class="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold transition-colors disabled:bg-gray-100 disabled:text-gray-400"
        >
          Agregar
        </button>
      </div>
      <SuccessMessage
        class="fixed bottom-40 left-1/2 transform -translate-x-1/2"
        v-if="currentIdMessage == product.id"
        :message="successMessage"
      />
    </div>
  </div>
</template>
