<script setup>
import { onMounted, ref } from 'vue'
import { BASE_URL } from '@/config';
import { useCartStore } from '@/stores/UseCartStore'
import SuccessMessage from '@/components/SuccessMessage.vue';
import { showMessage, messageAlert } from '@/functions/MessageAlert';
import { debounce } from 'lodash'

const cartStore = useCartStore()

onMounted(() => {
    cartStore.fetchCartItems()
})

const isUpdating = ref(false)

const increaseQuantity = debounce(async (item, quantity, typePrice) => {
    quantity++;
    await cartStore.updateQuantity(item, quantity,typePrice);
}, 300)

const decreaseQuantity = debounce(async (item, quantity, typePrice) => {
    if (quantity > 1) {
        quantity--;
        await cartStore.updateQuantity(item, quantity,typePrice);
    }
}, 300) 

///// message
const successMessage = ref(messageAlert);

function deleteItemMessage() {
    showMessage('Eliminado del carrito.');
}
</script>

<style scoped>
.container {
    max-width: 800px;
}
</style>

<template>
 
    <SuccessMessage v-if="messageAlert" :message="successMessage" />
    <div class="container mx-auto p-6">
        <h1 class="text-2xl font-bold mb-4">Mi Carrito de Compras</h1>

        <div v-if="!cartStore.cartItems" class="text-center py-8">
            <p class="text-gray-500">Tu carrito está vacío.</p>
        </div>

        <div v-else>
            <div v-for="item in cartStore.cartItems" :key="item.id" class="flex items-center border-b py-4">
                <img :src="`${BASE_URL}/storage/${item.product.image_url}`" alt="Product Image"
                    class="w-16 h-16 object-cover rounded mr-4" />
                <div v-if="item.product.stock == 1" class="flex-1">
                    <h3 class="text-lg font-semibold">{{ item.product.name }}</h3>
                    <p v-if="item.product.type_id == 1" class="text-gray-500">Precio: ${{ item.type_price == 'unit'? item.product.unit_price:item.product.bulk_unit_price }}</p>
                    <p v-if="item.product.type_id == 2" class="text-gray-500">Precio: ${{ item.product.unit_price }}</p>
                    <p class="text-gray-500">Subtotal: ${{ item.total }}</p>
                    <p v-if="item.product.type_id == 1" class="text-gray-500">Tipo de precio: {{  item.type_price == 'unit'? 'unico x1': 'bulto x'+item.product.bulk_unit  }}</p>
                </div>
                <div v-else class="flex-1">
                    <h3 class="text-lg font-semibold line-through">{{ item.product.name }}</h3>
                    <p v-if="item.product.type_id == 1" class="text-gray-500 line-through">Precio: ${{item.type_price == 'unit'? item.product.unit_price:item.product.bulk_unit_price }}</p>
                    <p v-if="item.product.type_id == 2" class="text-gray-500 line-through">Precio: ${{ item.product.unit_price }}</p>
                    <p class="text-gray-500 line-through">Subtotal: ${{ item.total }}</p>
                    <p v-if="item.product.type_id == 1" class="text-gray-500 line-through">Tipo de precio: {{  item.type_price == 'unit'? 'unico x1': 'bulto x'+item.product.bulk_unit }}</p>
                </div>
                <div v-if="item.product.stock == 1" class="flex items-center space-x-2">
                    <button @click="decreaseQuantity(item, item.quantity,item.type_price)" :disabled="item.quantity <= 1 || isUpdating"
                        class="px-2 py-1 bg-gray-200 rounded disabled:bg-gray-100 disabled:text-gray-400">
                        -
                    </button>
                    <span>{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item, item.quantity,item.type_price)" :disabled="isUpdating"
                        class="px-2 py-1 bg-gray-200 rounded disabled:bg-gray-100 disabled:text-gray-400">
                        +
                    </button>
                </div>
                <div v-else>
                    <h1 class="px-2 py-1 bg-red-200"> No hay stock</h1>
                </div>

                <button @click="cartStore.removeItem(item),deleteItemMessage()" class="text-red-500 ml-4">Eliminar</button>
            </div>

            <div class="mt-6 text-right">
                <h3 class="text-xl font-bold">Total: ${{ cartStore.cartTotal }}</h3>
            </div>
        </div>
    </div>
</template>