<script setup>
/* import { ref, onMounted } from "vue";
import axios from "axios";
import { DoughnutChart, BarChart } from "vue-chart-3";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const dashboardData = ref({
  topProductsLastMonth: [],
  earningsComparison: {
    currentMonth: 0,
    lastMonth: 0,
  },
  topProductsYear: [],
});

// Gráficos
const doughnutData = ref({});
const barData = ref({});

const fetchDashboardData = async () => {
  try {
    const response = await axios.get("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    dashboardData.value = response.data;

    // Preparar datos para el gráfico de los productos más vendidos en el mes
    doughnutData.value = {
      labels: dashboardData.value.topProductsLastMonth.map((item) => item.name),
      datasets: [
        {
          data: dashboardData.value.topProductsLastMonth.map((item) => item.total_sold),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        },
      ],
    };


    barData.value = {
      labels: ["Last Month", "Current Month"],
      datasets: [
        {
          label: "Earnings",
          data: [
            dashboardData.value.earningsComparison.lastMonth,
            dashboardData.value.earningsComparison.currentMonth,
          ],
          backgroundColor: ["#4BC0C0", "#FF6384"],
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

onMounted(() => {
  fetchDashboardData();
}); */
</script>
<template>
    <!-- 
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

    <div class="mb-8">
      <h2 class="text-lg font-bold mb-4">Top 5 Products Last Month</h2>
      <DoughnutChart :data="doughnutData" :options="{ responsive: true }" />
    </div>

    <div class="mb-8">
      <h2 class="text-lg font-bold mb-4">Earnings Comparison (Last vs Current Month)</h2>
      <BarChart :data="barData" :options="{ responsive: true }" />
    </div>

    <div>
      <h2 class="text-lg font-bold mb-4">Top Products This Year</h2>
      <table class="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-200 p-2">Product Name</th>
            <th class="border border-gray-200 p-2">Total Sold</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in dashboardData.topProductsYear" :key="product.name">
            <td class="border border-gray-200 p-2">{{ product.name }}</td>
            <td class="border border-gray-200 p-2">{{ product.total_sold }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div> -->
  <h1>AUN EN FACE DE PRUEBAS</h1>
</template>
