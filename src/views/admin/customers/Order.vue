<script setup>
import { ref, onMounted,watch } from "vue";
import api from "@/app";
import { TOKEN } from "@/config";
import SearchInput from '@/components/SearchInput.vue';
import Pagination from '@/components/Pagination.vue';
import { debounce } from 'lodash';
import Layout from "@/layout/LayoutPc.vue";

const orders = ref([]);
const search = ref('');
const pagination = ref(null);
const currenlyProducts = ref([]);
const showModal = ref(false);

const fetchPage = async (url ='/api/admin/orders') => {
  try {
    const response = await api.get(url, {
            params: {
                search: search.value,
            },
        },
        {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem(TOKEN)}` 
            },
        });
    console.log(response.data.orders)
    orders.value = response.data.orders.data;
    pagination.value = {
            current_page: response.data.orders.current_page,
            last_page: response.data.orders.last_page,
            next_page_url: response.data.orders.next_page_url,
            prev_page_url: response.data.orders.prev_page_url,
        };
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

const updateOrderStatus = async (orderId, status, deliveryStatus) => {
  try {
    await api.put('/api/admin/orders/' + orderId,
      { status: status, delivery_status: deliveryStatus },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN)}` },
      }
    );
    fetchPage();
  } catch (error) {
    console.error("Error updating order:", error);
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

const fetchOrderProducts = async (products) => {
  currenlyProducts.value = products;
  showModal.value = true;
};

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
  <Layout/>
  <div class="max-w-8xl mx-6 p-3">
    <h1 class="text-2xl font-bold mb-3">Lista de Pedidos</h1>
    <h4>Se puede buscar por (id pedido, nombre, apellido, dni)</h4>
    <SearchInput v-model:searchValue="search" />
    <div v-if="orders.length">
      <div class="overflow-x-auto">
        <table class="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-200 p-2">Fecha y Hora</th>
              <th class="border border-gray-200 p-2">ID Pedido</th>
              <th class="border border-gray-200 p-2">Precio Total</th>
              <th class="border border-gray-200 p-2">Nombre Apellido</th>
              <th class="border border-gray-200 p-2">DNI</th>
              <th class="border border-gray-200 p-2">Metodo de Pago</th>
              <th class="border border-gray-200 p-2">N. Tarjeta</th>
              <th class="border border-gray-200 p-2">Nombre Tarjeta</th>
              <th class="border border-gray-200 p-2">Estado</th>
              <th class="border border-gray-200 p-2">Estado de Entrega</th>
              <th class="border border-gray-200 p-2">Productos</th>
              <th class="border border-gray-200 p-2">Cambia Estado</th>
              <th class="border border-gray-200 p-2">Cambia Estado de Entrega</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td class="border border-gray-200 p-2">{{ formatDate(order.hour_and_date) }}</td>
              <td class="border border-gray-200 p-2">#{{ order.payment_id }}</td>
              <td class="border border-gray-200 p-2">${{ formatNumber(order.total) }}</td>
              <td class="border border-gray-200 p-2">{{ order.name }} {{ order.last_name }}</td>
              <td class="border border-gray-200 p-2">{{ order.dni }}</td>
              <td class="border border-gray-200 p-2">{{ order.type_card }}</td>
              <td class="border border-gray-200 p-2">{{ order.card_last_numb ? '***-' + order.card_last_numb : 'Sin Tarjeta'
                }}
              </td>
              <td class="border border-gray-200 p-2">{{ order.card_name_user ? order.card_name_user : 'Sin Tarjeta'
                }}
              </td>
              <td v-if="order.status == 'Pagado'" class="border border-gray-200 p-2 text-green-500">{{ order.status }}
              </td>
              <td v-if="order.status == 'Pendiente'" class="border border-gray-200 p-2 text-orange-500">{{ order.status }}
              </td>
              <td v-if="order.status == 'Cancelado'" class="border border-gray-200 p-2 text-red-500">{{ order.status }}
              </td>
              <td v-if="order.delivery_status == 'Listo'" class="border border-gray-200 p-2  text-green-500">{{
                order.delivery_status }}</td>
              <td v-if="order.delivery_status == 'Revision'" class="border border-gray-200 p-2  text-orange-500">{{
                order.delivery_status }}</td>
              <td v-if="order.delivery_status == 'Entregado'" class="border border-gray-200 p-2  text-blue-500">{{
                order.delivery_status }}</td>
              <td class="border border-gray-200 p-2 text-blue-500 cursor-pointer"
                @click="fetchOrderProducts(order.order_items)">
                Ver
              </td>
              <td class="border border-gray-200 p-2">
                <select v-model="order.status" class="border p-1"
                  @change="updateOrderStatus(order.id, order.status, order.delivery_status)">
                  <option value="Pagado">Pagado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </td>
              <td class="border border-gray-200 p-2">
                <select v-model="order.delivery_status" class="border p-1"
                  @change="updateOrderStatus(order.id, order.status, order.delivery_status)">
                  <option value="Listo">Listo</option>
                  <option value="Revision">Revisión</option>
                  <option value="Entregado">Entregado</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination :pagination="pagination" :fetchPage="fetchPage" />
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
                  <span class="text-sm font-medium text-gray-500">Cantidad: x{{ item.quantity }}</span>
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
</template>
