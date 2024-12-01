<script setup>
import { ref, onMounted } from "vue";
import api from "@/app";

const user = ref(null);
const address = ref(null);
const orders = ref([]);

const fetchProfileData = async () => {
    try {
        const response = await api.get('/api/profile/overview', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        user.value = response.data.user;
        address.value = response.data.address;
        orders.value = response.data.orders;
    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
};

onMounted(fetchProfileData);
</script>

<template>
    <div class="max-w-4xl mx-auto p-6 space-y-8">
        <h1 class="text-2xl font-bold mb-4" >PERFIL</h1>
        <div class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Detalles de Usuario</h2>
            <p><span class="font-medium">Nombre:</span> {{ user?.name }}</p>
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
            <div class="overflow-x-auto">
                <table class="w-full border-collapse border border-gray-300">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                                Date</th>
                            <th class="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                                Order ID</th>
                            <th class="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                                Total Products</th>
                            <th class="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                                Total Price</th>
                            <th class="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                                Status</th>
                            <th class="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
                                Delivery Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order.order_id" class="odd:bg-white even:bg-gray-50">
                            <td class="border border-gray-300 px-4 py-2 text-sm">{{ order.created_at }}</td>
                            <td class="border border-gray-300 px-4 py-2 text-sm">{{ order.order_id }}</td>
                            <td class="border border-gray-300 px-4 py-2 text-sm">{{ order.total_products }}</td>
                            <td class="border border-gray-300 px-4 py-2 text-sm">{{ order.total_price }}</td>
                            <td class="border border-gray-300 px-4 py-2 text-sm">{{ order.status }}</td>
                            <td class="border border-gray-300 px-4 py-2 text-sm">{{ order.delivery_status }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
