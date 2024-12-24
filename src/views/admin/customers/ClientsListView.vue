<script setup>
import { ref, onMounted, watch } from "vue";
import api from "@/app";
import SearchInput from "@/components/SearchInput.vue";
import Pagination from "@/components/Pagination.vue";
import { debounce } from "lodash";
import { TOKEN } from "@/config";
import LayoutPc from "@/layout/LayoutPc.vue";
import LayoutMovile from "@/layout/LayoutMovile.vue";

const clients = ref([]);
const search = ref("");
const pagination = ref(null);

const fetchPage = async (url = "/api/admin/customers") => {
  try {
    const response = await api.get(
      url,
      {
        params: {
          search: search.value,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
        },
      }
    );
    console.log(response.data);
    clients.value = response.data.clients.data;
    pagination.value = {
      current_page: response.data.clients.current_page,
      last_page: response.data.clients.last_page,
      next_page_url: response.data.clients.next_page_url,
      prev_page_url: response.data.clients.prev_page_url,
    };
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
};

onMounted(() => {
  fetchPage();
});
watch([search], () => {
  searchDebounced();
});

const searchDebounced = debounce(() => {
  fetchPage();
}, 300);
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
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Clientes</h1>
    <h4>Se puede buscar por (nombre, apellido, dni)</h4>
    <SearchInput v-model:searchValue="search" />
    <div v-if="clients.length">
      <div class="overflow-x-auto">
        <table class="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-200 p-2">Nombre</th>
              <th class="border border-gray-200 p-2">Apellido</th>
              <th class="border border-gray-200 p-2">Correo</th>
              <th class="border border-gray-200 p-2">DNI</th>
              <th class="border border-gray-200 p-2">Numero Telefono</th>
              <th class="border border-gray-200 p-2">Genero</th>
              <th class="border border-gray-200 p-2">Direccion</th>
              <th class="border border-gray-200 p-2">Departamento</th>
              <th class="border border-gray-200 p-2">Ciudad</th>
              <th class="border border-gray-200 p-2">Codigo postal</th>
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
                {{ client.address?.phone_number || "N/A" }}
              </td>
              <td class="border border-gray-200 p-2">
                {{ client.address?.gender || "N/A" }}
              </td>
              <td class="border border-gray-200 p-2">
                {{ client.address?.address || "N/A" }}
              </td>
              <td class="border border-gray-200 p-2">
                {{ client.address?.department || "N/A" }}
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
      <Pagination :pagination="pagination" :fetchPage="fetchPage" />
    </div>
    <div v-else>
      <h1>No hay Clientes</h1>
    </div>
  </div>
</template>
