<script setup>
import { ref, onMounted } from "vue";
import api from "@/app";

const user = ref(null);
const address = ref(null);
const orders = ref([]);
const currenlyProducts = ref([]);
const showModal = ref(false);

const fetchProfileData = async () => {
    try {
        const response = await api.get('/api/profile/overview', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        console.log(response.data)
        user.value = response.data.user;
        address.value = response.data.address;
        orders.value = response.data.orders;
    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
};

const fetchOrderProducts = async (products) => {
    currenlyProducts.value = products;
    showModal.value = true;
};


onMounted(fetchProfileData);


function formatDate(dateString) {
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const timeFormatted = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    return `${dateFormatted} ${timeFormatted}`;
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
    <div class="max-w-4xl mx-auto p-6 space-y-8">
        <h1 class="text-2xl font-bold mb-4">PERFIL</h1>
        <div class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Detalles de Usuario</h2>
            <p><span class="font-medium">Nombre:</span> {{ user?.name }}</p>
            <p><span class="font-medium">Apellido:</span> {{ user?.last_name }}</p>
            <p><span class="font-medium">Mail:</span> {{ user?.email }}</p>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Address</h2>
            <p><span class="font-medium">DNI:</span> {{ address?.dni }}</p>
            <p><span class="font-medium">Genero:</span> {{ address?.gender }}</p>
            <p><span class="font-medium">Direccion:</span> {{ address?.address }}</p>
            <p><span class="font-medium">Localidad:</span> {{ address?.city }}</p>
            <p><span class="font-medium">Codigo Postal:</span> {{ address?.postal_code }}</p>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Orders</h2>
            <div v-if="orders.length" class="overflow-x-auto">
                <table class="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-200 p-2">Fecha y Hora</th>
                            <th class="border border-gray-200 p-2">ID Pedido</th>
                            <th class="border border-gray-200 p-2">Precio Total</th>
                            <th class="border border-gray-200 p-2">Nombre Apellido</th>
                            <th class="border border-gray-200 p-2">N. Tarjeta</th>
                            <th class="border border-gray-200 p-2">Productos</th>
                            <th class="border border-gray-200 p-2">Estado</th>
                            <th class="border border-gray-200 p-2">Estado de Entrega</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order.id">
                            <td class="border border-gray-200 p-2">{{ formatDate(order.hour_and_date) }}</td>
                            <td class="border border-gray-200 p-2">#{{ order.payment_id }}</td>
                            <td class="border border-gray-200 p-2">${{ formatNumber(order.total) }}</td>
                            <td class="border border-gray-200 p-2">{{ order.name }} {{ order.last_name }}</td>
                            <td class="border border-gray-200 p-2">{{ order.card_last_numb ? '***-'+order.card_last_numb
                                : 'Sin Tarjeta'
                                }}
                            </td>
                            <td class="border border-gray-200 p-2 text-blue-500 cursor-pointer"
                                @click="fetchOrderProducts(order.order_items)">
                                Ver
                            </td>
                            <td v-if="order.status == 'Pagado'" class="border border-gray-200 p-2 text-green-500">{{
                                order.status }}
                            </td>
                            <td v-if="order.delivery_status == 'Listo'"
                                class="border border-gray-200 p-2  text-green-500">{{
                                    order.delivery_status }}</td>
                            <td v-if="order.status == 'Pendiente'" class="border border-gray-200 p-2 text-orange-500">{{
                                order.status }}
                            </td>
                            <td v-if="order.delivery_status == 'Revision'"
                                class="border border-gray-200 p-2  text-orange-500">{{
                                    order.delivery_status }}</td>
                            <td v-if="order.status == 'Cancelado'" class="border border-gray-200 p-2 text-red-500">{{
                                order.status }}
                            </td>
                            <td v-if="order.delivery_status == 'Entregado'"
                                class="border border-gray-200 p-2  text-blue-500">{{
                                    order.delivery_status }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <h1>No hay Pedidos</h1>
            </div>
            <!-- Modal para mostrar productos -->
            <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white p-6 rounded-lg w-1/2">
                    <h2 class="text-xl font-bold mb-4">Productos</h2>
                    <ul>
                        <li v-for="item in currenlyProducts" :key="item.id" class="border-b py-2">
                            <ul class="pl-4">
                                <li class="p-4 bg-white rounded-lg shadow-md border mb-4">
                                    <div class="flex justify-between items-center">
                                        <h3 class="text-lg font-semibold text-gray-800">{{ item.name }}</h3>
                                        <span class="text-sm font-medium text-gray-500">Cantidad: x{{ item.quantity
                                            }}</span>
                                    </div>
                                    <div class="mt-2">
                                        <p class="text-sm text-gray-600">
                                            <span class="font-medium">Precio:</span> ${{ formatNumber(item.unit_price) }}
                                        </p>
                                        <p class="text-sm text-gray-600">
                                            <span class="font-medium">Subtotal:</span> ${{ formatNumber(item.sub_total) }}
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <button @click="showModal = false" class="bg-red-500 text-white px-4 py-2 rounded mt-4">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
