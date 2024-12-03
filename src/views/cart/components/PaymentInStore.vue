<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/UseCartStore'
import api from '@/app';
import { TOKEN } from '@/config';

const cartStore = useCartStore()
const router = useRouter();

onMounted(() => {
    cartStore.fetchCartItems()
})

const confirmPurchase = async () => {
    try {
        const response = await api.post('/api/payment_in_store_orders',
            {
                preferenceItems: cartStore.formattedItems,
                preferenceTotal: cartStore.cartTotal,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
                }
            });
        console.log(response.data)
        if (response.data.status == 'aprovated') {
            cartStore.removeAllCart(response.data.cart_id);
            router.push("/perfil");
        } 
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
    }
};
const goBackToCart = () => {
    router.push({ name: 'cart' });
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
    <div class="container mx-auto p-6 max-w-4xl">
        <div class="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            <div class="space-y-4">
                <h2 class="text-2xl font-semibold text-blue-600">Pago Presencial en el Local</h2>

                <div class="p-4 border border-gray-300 rounded-lg">
                    <h3 class="text-xl font-bold">Dirección y Horarios</h3>
                    <p class="mt-2">Visítanos en nuestra tienda para completar tu compra:</p>
                    <p class="font-semibold mt-2">Dirección: Calle Ficticia 123, Ciudad Ficticia, País Ficticio</p>
                    <p>Horario de atención: Lunes a Viernes, de 10:00 AM a 6:00 PM</p>
                    <p class="mt-2">¡Te esperamos en nuestro local para ayudarte con tu compra!</p>
                </div>
            </div>

            <div class="space-y-4">
                <h3 class="text-2xl font-semibold text-blue-600">Resumen de tu Compra</h3>

                <div class="p-4 border border-gray-300 rounded-lg">
                    <h4 class="text-lg font-bold">Productos en tu carrito:</h4>
                    <div v-for="item in cartStore.formattedItems" :key="item.id"
                        class="flex justify-between py-2 border-b">
                        <div class="flex-1">
                            <p class="font-semibold">{{ item.title }}</p>
                            <p class="text-gray-500">Cantidad: {{ item.quantity }}</p>
                            <p class="text-gray-500">Precio: ${{ formatNumber(item.unit_price) }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-gray-600">Subtotal: ${{ formatNumber(item.total) }}</p>
                        </div>
                    </div>
                </div>

                <div class="p-4 border-t-2 border-gray-300 mt-4">
                    <div class="flex justify-between text-lg font-semibold">
                        <p>Total</p>
                        <p>${{ formatNumber(cartStore.cartTotal) }}</p>
                    </div>
                    <button @click="confirmPurchase"
                        class="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Confirmar Compra
                    </button>
                    <button @click="goBackToCart"
                        class="w-full mt-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                        Volver al Carrito
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>
