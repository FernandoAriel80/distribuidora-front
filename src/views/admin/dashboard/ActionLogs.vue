<script setup>
import { ref, onMounted, watch } from "vue";
import api from "@/app";
import SearchInput from "@/components/SearchInput.vue";
import Pagination from "@/components/Pagination.vue";
import { debounce } from "lodash";
import { TOKEN } from "@/config";
import LayoutPc from "@/layout/LayoutPc.vue";
import LayoutMovile from "@/layout/LayoutMovile.vue";

const logs = ref([]);
const search = ref("");
const pagination = ref(null);

const fetchPage = async (url = "/api/admin/action_logs") => {
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
    logs.value = response.data.actionLog.data;
    pagination.value = {
      current_page: response.data.actionLog.current_page,
      last_page: response.data.actionLog.last_page,
      next_page_url: response.data.actionLog.next_page_url,
      prev_page_url: response.data.actionLog.prev_page_url,
    };
  } catch (error) {
    console.error("Error fetching action logs:", error);
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

function formatDate(dateString) {
  const date = new Date(dateString);
  const dateFormatted = date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeFormatted = date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateFormatted} ${timeFormatted}`;
}
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
    <h1 class="text-2xl font-bold mb-4">Acciones de Empleados</h1>
    <h4>Se puede buscar por (nombre, apellido, correo, id pedido)</h4>
    <SearchInput v-model:searchValue="search" />
    <div v-if="logs.length">
      <div class="overflow-x-auto">
        <table class="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-200 p-2">Nombre</th>
              <th class="border border-gray-200 p-2">Apellido</th>
              <th class="border border-gray-200 p-2">Email</th>
              <th class="border border-gray-200 p-2">Acción</th>
              <th class="border border-gray-200 p-2">Descripción</th>
              <th class="border border-gray-200 p-2">ID del Pedido</th>
              <th class="border border-gray-200 p-2">Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td class="border border-gray-200 p-2">{{ log.name }}</td>
              <td class="border border-gray-200 p-2">{{ log.last_name }}</td>
              <td class="border border-gray-200 p-2">{{ log.email }}</td>
              <td class="border border-gray-200 p-2">{{ log.action }}</td>
              <td class="border border-gray-200 p-2">{{ log.description }}</td>
              <td class="border border-gray-200 p-2">#{{ log.payment_id }}</td>
              <td class="border border-gray-200 p-2">{{ formatDate(log.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination :pagination="pagination" :fetchPage="fetchPage" />
    </div>
    <div v-else>
      <h1>No hay Informes</h1>
    </div>
  </div>
</template>
