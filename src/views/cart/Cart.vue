<script setup>
import { ref, onMounted, computed } from 'vue'
import { TOKEN } from '@/config';
import api from '@/app';

// Variables reactivas para almacenar el carrito y la imagen por defecto
const cartItems = ref([])
const defaultImage = 'image_url/default.jpg'

// Obtener los elementos del carrito al montar el componente
const fetchCartItems = async () => {
    try {
        const response = await api.get('/api/cart',
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
                }
            },
        )
        cartItems.value = response.data.items
        console.log(response.data.items)
    } catch (error) {
        console.error('Error al cargar el carrito:', error)
    }
}

// Función para actualizar la cantidad de un producto en el carrito
const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return
    try {
        const response = await api.post('/api/cart/create',
            {
                product_id: item.product.id,
                quantity: newQuantity - item.quantity
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
                }
            },
        )
        console.log(response.data)
        fetchCartItems();
    } catch (error) {
        console.error('Error al actualizar la cantidad:', error)
    }
}

// Función para eliminar un producto del carrito
const removeItem = async (item) => {
    try {
        await api.delete('/api/cart/'+item.id,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
                }
            },
        )
        fetchCartItems();
    } catch (error) {
        console.error('Error al eliminar el producto:', error)
    }
}

// Calcular el total del carrito
const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + Number(item.total), 0);
});
// Montar los datos del carrito al cargar el componente
onMounted(() => {
    fetchCartItems()
})
</script>

<style scoped>
.container {
    max-width: 800px;
}
</style>

<template>
    <div class="container mx-auto p-6">
        <h1 class="text-2xl font-bold mb-4">Mi Carrito de Compras</h1>

        <!-- Verificar si el carrito está vacío -->
        <div v-if="cartItems.length === 0" class="text-center py-8">
            <p class="text-gray-500">Tu carrito está vacío.</p>
        </div>

        <!-- Lista de productos en el carrito -->
        <div v-else>
            <div v-for="item in cartItems" :key="item.id" class="flex items-center border-b py-4">
                <!-- <img :src="item.product.image || defaultImage" alt="Product Image"
                    class="w-16 h-16 object-cover rounded mr-4" /> -->
                <div class="flex-1">
                    <h3 class="text-lg font-semibold">{{ item.product.name }}</h3>
                    <p class="text-gray-500">Precio: ${{ item.product.unit_price }}</p>
                    <p class="text-gray-500">Subtotal: ${{ item.total }}</p>
                </div>

                <!-- Control de cantidad -->
                <div class="flex items-center space-x-2">
                    <button @click="updateQuantity(item, item.quantity - 1)"
                        class="px-2 py-1 bg-gray-200 rounded">-</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="updateQuantity(item, item.quantity + 1)"
                        class="px-2 py-1 bg-gray-200 rounded">+</button>
                </div>

                <!-- Botón para eliminar -->
                <button @click="removeItem(item)" class="text-red-500 ml-4">Eliminar</button>
            </div>

            <!-- Total -->
            <div class="mt-6 text-right">
                <h3 class="text-xl font-bold">Total: ${{ cartTotal }}</h3>
            </div>
        </div>
    </div>
</template>