<script setup>
import { ref, onMounted } from "vue";
import api from "@/app";
import Layout from "@/layout/LayoutPc.vue";
import { TOKEN } from "@/config";

const currentMonth = ref(0);
const lastMonth = ref(0);
const topBestProductsCurrentMonth = ref([]);
const topBestProductsLastMonth = ref([]);
const topWorstProductsCurrentMonth = ref([]);
const topWorstProductsLastMonth = ref([]);
const topProductsAllYear = ref([]);
const topProductsYear = ref([]);

const fetchDashboardData = async () => {
  try {
    const response = await api.get("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN)}` },
    });

    currentMonth.value = response.data.currentMonth;
    lastMonth.value = response.data.lastMonth;
    topBestProductsCurrentMonth.value = response.data.topBestProductsCurrentMonth;
    topBestProductsLastMonth.value = response.data.topBestProductsLastMonth;
    topWorstProductsCurrentMonth.value = response.data.topWorstProductsCurrentMonth;
    topWorstProductsLastMonth.value = response.data.topWorstProductsLastMonth;
    topProductsAllYear.value = response.data.topProductsAllYear;
    topProductsYear.value = response.data.topProductsYear;

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

onMounted(() => {
  fetchDashboardData();
});

// Función para formatear números
const formatNumber = (value) => {
  return new Intl.NumberFormat("es-AR", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(value);
};

</script>
<template>
  <Layout />
  <div class="mx-6">
    <div class="p-6 border-2 border-gray-300 mb-6">
      <h3 class="text-2xl font-bold text-blue-600 mb-4 text-center">Ganancias Total Por Mes</h3>
      <div class="flex justify-between gap-6 p-6 rounded-lg">
        <div class="w-1/2 bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <h3 class="text-2xl font-bold text-blue-600 mb-4 text-center">Mes Anterior</h3>
          <ul class="space-y-3">
            <li class="flex justify-between items-center bg-blue-50 p-3 rounded-md shadow-sm">
              <span class="text-lg font-semibold text-gray-700"> Total: </span>
              <span class="text-lg font-bold text-blue-600">${{ formatNumber(lastMonth) }}</span>
            </li>
          </ul>
        </div>
        <div class="w-1/2 bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <h3 class="text-2xl font-bold text-green-600 mb-4 text-center">Este Mes</h3>
          <ul class="space-y-3">
            <li class="flex justify-between items-center bg-green-50 p-3 rounded-md shadow-sm">
              <span class="text-lg font-semibold text-gray-700"> Total: </span>
              <span class="text-lg font-bold text-green-600">${{ formatNumber(currentMonth) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- /////////////////////////////////////////////////////////////////////////////////// -->
    <div class="p-6 border-2 border-gray-300 mb-6">
      <h3 class="text-2xl font-bold text-blue-600 mb-4 text-center">Productos Más Vendidos Por Mes</h3>
      <div class="flex justify-between gap-6 p-6 rounded-lg">
        <div class="w-1/2 bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <h3 class="text-2xl font-bold text-blue-600 mb-4 text-center">Mes Anterior</h3>
          <ul class="space-y-3">
            <li v-for="item in topBestProductsLastMonth" :key="item.name"
              class="flex justify-between items-center bg-blue-50 p-3 rounded-md shadow-sm">
              <span class="text-lg font-semibold text-gray-700">{{ item.name }}</span>
              <span class="text-lg font-bold text-blue-600">{{ item.total_quantity }}</span>
            </li>
          </ul>
        </div>
        <div class="w-1/2 bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <h3 class="text-2xl font-bold text-green-600 mb-4 text-center">Este Mes</h3>
          <ul class="space-y-3">
            <li v-for="item in topBestProductsCurrentMonth" :key="item.name"
              class="flex justify-between items-center bg-green-50 p-3 rounded-md shadow-sm">
              <span class="text-lg font-semibold text-gray-700">{{ item.name }}</span>
              <span class="text-lg font-bold text-green-600">{{ item.total_quantity }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- ////////////////////// -->
    <div class="p-6 border-2 border-gray-300 mb-6">
      <h3 class="text-2xl font-bold text-blue-600 mb-4 text-center">Productos Menos Vendidos Por Mes</h3>
      <div class="flex justify-between gap-6 p-6 rounded-lg">
        <div class="w-1/2 bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <h3 class="text-2xl font-bold text-blue-600 mb-4 text-center">Mes Anterior</h3>
          <ul class="space-y-3">
            <li v-for="item in topWorstProductsCurrentMonth" :key="item.name"
              class="flex justify-between items-center bg-blue-50 p-3 rounded-md shadow-sm">
              <span class="text-lg font-semibold text-gray-700">{{ item.name }}</span>
              <span class="text-lg font-bold text-blue-600">{{ item.total_quantity }}</span>
            </li>
          </ul>
        </div>
        <div class="w-1/2 bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <h3 class="text-2xl font-bold text-green-600 mb-4 text-center">Este mes</h3>
          <ul class="space-y-3">
            <li v-for="item in topWorstProductsLastMonth" :key="item.name"
              class="flex justify-between items-center bg-green-50 p-3 rounded-md shadow-sm">
              <span class="text-lg font-semibold text-gray-700">{{ item.name }}</span>
              <span class="text-lg font-bold text-green-600">{{ item.total_quantity }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- /////////////////////////////////////////////////////////////// -->
    <div class="p-6 border-2 border-gray-300 mb-6">
      <h3 class="text-2xl font-bold text-blue-600 mb-4 text-center">Productos Más Vendidos Por Año</h3>
      <div class="flex justify-between gap-6 p-6 rounded-lg">
        <div class="w-1/2 bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <h3 class="text-2xl font-bold text-blue-600 mb-4 text-center">Todos los Años</h3>
          <ul class="space-y-3">
            <li v-for="item in topProductsAllYear" :key="item.name"
              class="flex justify-between items-center bg-blue-50 p-3 rounded-md shadow-sm">
              <span class="text-lg font-semibold text-gray-700">{{ item.name }}</span>
              <span class="text-lg font-bold text-blue-600">{{ item.total_quantity }}</span>
            </li>
          </ul>
        </div>
        <div class="w-1/2 bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <h3 class="text-2xl font-bold text-green-600 mb-4 text-center">Este año</h3>
          <ul class="space-y-3">
            <li v-for="item in topProductsYear" :key="item.name"
              class="flex justify-between items-center bg-green-50 p-3 rounded-md shadow-sm">
              <span class="text-lg font-semibold text-gray-700">{{ item.name }}</span>
              <span class="text-lg font-bold text-green-600">{{ item.total_quantity }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

</template>
