<script setup>
import { ref, onMounted } from "vue";
import api from "@/app";
import Layout from "@/layout/Layout.vue";

// Lista de clientes
const clients = ref([]);

// Cargar clientes desde la API
const fetchClients = async () => {
  try {
    const response = await api.get("/api/admin/clients", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log(response.data)
    clients.value = response.data.clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  fetchClients();
});
</script>

<template>
  <Layout/>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Clients List</h1>
    <div class="overflow-x-auto">
      <table class="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-200 p-2">Name</th>
            <th class="border border-gray-200 p-2">Last Name</th>
            <th class="border border-gray-200 p-2">Email</th>
            <th class="border border-gray-200 p-2">DNI</th>
            <th class="border border-gray-200 p-2">Gender</th>
            <th class="border border-gray-200 p-2">Address</th>
            <th class="border border-gray-200 p-2">City</th>
            <th class="border border-gray-200 p-2">Postal Code</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id">
            <td class="border border-gray-200 p-2">{{ client.name }}</td>
            <td class="border border-gray-200 p-2">{{ client.last_name }}</td>
            <td class="border border-gray-200 p-2">{{ client.email }}</td>
            <td class="border border-gray-200 p-2">
              {{ client.address?.dni || "N/A" }}
            </td>
            <td class="border border-gray-200 p-2">
              {{ client.address?.gender || "N/A" }}
            </td>
            <td class="border border-gray-200 p-2">
              {{ client.address?.address || "N/A" }}
            </td>
            <td class="border border-gray-200 p-2">
              {{ client.address?.city || "N/A" }}
            </td>
            <td class="border border-gray-200 p-2">
              {{ client.address?.postal_code || "N/A" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
