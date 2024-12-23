<script setup>
import { onMounted, ref, computed } from "vue";
import { BASE_URL } from "@/config";
import api from "@/app";
import { useCartStore } from "@/stores/UseCartStore";
import { useAuth } from "@/composables/UserAuth";
import Modal from "@/components/Modal.vue";
import Createaddress from "@/views/Auth/Address.vue";
import SuccessMessage from "@/components/SuccessMessage.vue";
import { showMessage, messageAlert } from "@/functions/MessageAlert";
import { debounce } from "lodash";
import router from "@/router";
import LayoutPc from "@/layout/LayoutPc.vue";
import LayoutMovile from "@/layout/LayoutMovile.vue";

const cartStore = useCartStore();
const currentUser = useAuth();

onMounted(() => {
  cartStore.fetchCartItems();
});

const isUpdating = ref(false);

const increaseQuantity = debounce(async (item, quantity, typePrice) => {
  quantity++;
  await cartStore.updateQuantity(item, quantity, typePrice);
}, 300);

const decreaseQuantity = debounce(async (item, quantity, typePrice) => {
  if (quantity > 1) {
    quantity--;
    await cartStore.updateQuantity(item, quantity, typePrice);
  }
}, 300);

const successMessage = ref(messageAlert);

function deleteItemMessage() {
  showMessage("Eliminado del carrito.");
}
function createAddressMessage() {
  showMessage("La dirección se ha guardado con éxito.");
}

const isOutOfStock = computed(() => {
  return cartStore.cartItems.some((item) => item.product.stock === 0);
});

// Función para formatear números
const formatNumber = (value) => {
  return new Intl.NumberFormat("es-AR", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(value);
};

// Modal

const showModalCreate = ref(false);
const openModalCreate = () => (showModalCreate.value = true);
const closeModalCreate = () => (showModalCreate.value = false);

const hasAddress = async () => {
  try {
    const response = await api.get("/api/address");
    console.log(response.data);
    if (!response.data.exist) {
      openModalCreate();
    } else {
      router.push("/metodo-pago");
    }
  } catch (error) {
    console.error("Error al cargar los datos de direccion:", error);
  }
};

const handleCreated = () => {
  closeModalCreate();
  createAddressMessage();
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
  <SuccessMessage v-if="messageAlert" :message="successMessage" />
  <div class="container mx-auto p-6 max-w-4xl">
    <h1 class="text-2xl font-bold mb-4 text-center">Mi Carrito de Compras</h1>

    <div v-if="cartStore.cartItems == ''" class="text-center py-8">
      <p class="text-gray-500">Tu carrito está vacío.</p>
    </div>

    <div v-else>
      <div
        v-for="item in cartStore.cartItems"
        :key="item.id"
        class="flex items-center border-b py-4 space-x-4"
      >
        <img
          :src="`${BASE_URL}/storage/${item.product.image_url}`"
          alt="Product Image"
          class="w-16 h-16 object-cover rounded"
        />
        <div v-if="item.product.stock == 1" class="flex-1">
          <h3 class="text-lg font-semibold">{{ item.product.name }}</h3>
          <p v-if="item.product.type_id == 1" class="text-gray-500">
            Precio: ${{
              item.type_price == "unit"
                ? formatNumber(item.product.unit_price)
                : formatNumber(item.product.bulk_unit_price)
            }}
          </p>
          <p v-if="item.product.type_id == 2" class="text-gray-500">
            Precio: ${{ formatNumber(item.product.unit_price) }}
          </p>
          <p class="text-gray-500">Subtotal: ${{ formatNumber(item.total) }}</p>
          <p v-if="item.product.type_id == 1" class="text-gray-500">
            Tipo de precio:
            {{
              item.type_price == "unit" ? "unico x1" : "bulto x" + item.product.bulk_unit
            }}
          </p>
        </div>
        <div v-else class="flex-1">
          <h3 class="text-lg font-semibold line-through">{{ item.product.name }}</h3>
          <p v-if="item.product.type_id == 1" class="text-gray-500 line-through">
            Precio: ${{
              item.type_price == "unit"
                ? formatNumber(item.product.unit_price)
                : formatNumber(item.product.bulk_unit_price)
            }}
          </p>
          <p v-if="item.product.type_id == 2" class="text-gray-500 line-through">
            Precio: ${{ formatNumber(item.product.unit_price) }}
          </p>
          <p class="text-gray-500 line-through">
            Subtotal: ${{ formatNumber(item.total) }}
          </p>
          <p v-if="item.product.type_id == 1" class="text-gray-500 line-through">
            Tipo de precio:
            {{
              item.type_price == "unit" ? "unico x1" : "bulto x" + item.product.bulk_unit
            }}
          </p>
        </div>
        <div v-if="item.product.stock == 1" class="flex items-center space-x-2">
          <button
            @click="decreaseQuantity(item, item.quantity, item.type_price)"
            :disabled="item.quantity <= 1 || isUpdating"
            class="px-2 py-1 bg-gray-200 rounded disabled:bg-gray-100 disabled:text-gray-400"
          >
            -
          </button>
          <span>{{ item.quantity }}</span>
          <button
            @click="increaseQuantity(item, item.quantity, item.type_price)"
            :disabled="isUpdating"
            class="px-2 py-1 bg-gray-200 rounded disabled:bg-gray-100 disabled:text-gray-400"
          >
            +
          </button>
        </div>
        <div v-else>
          <h1 class="px-2 py-1 bg-red-200">No hay stock</h1>
        </div>

        <button
          @click="cartStore.removeItem(item), deleteItemMessage()"
          class="text-red-500 ml-4"
        >
          Eliminar
        </button>
      </div>

      <div class="mt-6 text-right">
        <h3 class="text-xl font-bold">Total: ${{ formatNumber(cartStore.cartTotal) }}</h3>
      </div>
      <button
        v-if="currentUser.user.value?.role != 'admin'"
        @click="hasAddress"
        :disabled="isOutOfStock"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        Finalizar Compra
      </button>
      <Modal :isOpen="showModalCreate" :closeModal="closeModalCreate">
        <Createaddress @actionExecuted="handleCreated" />
      </Modal>
    </div>
  </div>
</template>
