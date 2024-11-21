<script setup>
import api from '@/app';
import { BASE_URL } from '@/config';
import { ref, defineProps, watch, onMounted } from 'vue';
import ImagePreview from '@/components/ImagePreview.vue';
import Pagination from '@/components/Pagination.vue';
import SearchInput from '@/components/SearchInput.vue';
import Modal from '@/components/Modal.vue';
import ModalAsk from '@/components/ModalAsk.vue';
import CreateProduct from './Create.vue'
import EditProduct from './Edit.vue'
import { debounce } from 'lodash';

const products = ref([]);
const search = ref('');
const pagination = ref(null);
const loading = ref(true);

const fetchPage = async (url = '/api/admin/products') => {
    try {
        const response = await api.get(url, {
            params: {
                search: search.value,
            },
        },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        loading.value = false;
        products.value = response.data.products.data;
        pagination.value = {
            current_page: response.data.products.current_page,
            last_page: response.data.products.last_page,
            next_page_url: response.data.products.next_page_url,
            prev_page_url: response.data.products.prev_page_url,
        };
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

onMounted(() => {
    fetchPage();
});

watch([search], () => {
    searchDebounced();
});

const searchDebounced = debounce(() => {
    fetchPage();
}, 300);


const showModalCreate = ref(false);
const showModalEdit = ref(false);
const showAlert = ref(false);
const currentProduct = ref(null);

const openModalCreate = () => showModalCreate.value = true;
const closeModalCreate = () => showModalCreate.value = false;

const openModalEdit = (product) => {
    currentProduct.value = product;
    showModalEdit.value = true;
};
const closeModalEdit = () => showModalEdit.value = false;

const openModalAlert = (id) => {
    currentProduct.value = { id };
    showAlert.value = true;
};

const closeModalAlertYes = async () => {
    const url = '/api/admin/products/' + currentProduct.value.id
    console.log(url)
    try {
        const response = await api.delete(url,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            },
        );
        console.log(response.data)
        showAlert.value = false;
        fetchPage();
    } catch (error) {
        console.error('Error eliminando el producto:', error);
    }
};



const handleProductCreated = () => {
    closeModalCreate();
    fetchPage();
};

const closeModalAlert = () => {
    showAlert.value = false;
};
const handleProductUpdated = () => {
    closeModalEdit();
    fetchPage();
};
</script>

<template>
    <div class="mr-5 ml-5">

        <button @click="openModalCreate" class="px-4 py-2 bg-blue-500 text-white rounded">Cargar Producto</button>
        <Modal :isOpen="showModalCreate" :closeModal="closeModalCreate">
            <CreateProduct @actionExecuted="handleProductCreated" />
        </Modal>

        <div v-if="currentProduct">
            <Modal :isOpen="showModalEdit" :closeModal="closeModalEdit">
                <EditProduct @actionExecuted="handleProductUpdated" :products="currentProduct" />
            </Modal>
        </div>

        <ModalAsk :isOpen="showAlert" :closeNo="closeModalAlert" :closeYes="closeModalAlertYes"
            message="¿Está seguro de eliminar este producto?" />

        <div v-if="loading" class="m-10">
            <h1>CARGANDO CONTENIDO.....</h1>
        </div>
        <div v-else >
             <h1 class="text-2xl font-bold mb-4">Lista de Empleados</h1>
            <SearchInput v-model:searchValue="search" />
            <div v-if="products.length">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cod. Barras
                                </th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre</th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Descripción</th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cantidad de unidades</th>

                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio por Bulto</th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio por Unidad</th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    % Off
                                </th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio Oferta</th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio Anterior</th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Imagen</th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría</th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Editar</th>
                                <th
                                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Eliminar</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="product in products" :key="product.id">
                                <td class="px-2 py-3 text-sm text-gray-900">{{ product.catalog_id }}</td>
                                <td class="px-2 py-3 text-sm text-gray-900">{{ product.barcode }}</td>
                                <td class="px-2 py-3 text-sm text-gray-500">{{ product.name }}</td>
                                <td class="px-2 py-3 text-sm text-gray-500">{{ product.description }}</td>
                                <td class="px-2 py-3 text-sm text-gray-500">{{ product.bulk_unit }}</td>
                                <td class="px-2 py-3 text-sm text-gray-500">{{ product.bulk_unit_price }}</td>
                                <td class="px-2 py-3 text-sm text-gray-500">{{ product.unit_price }}</td>
                                <td class="px-2 py-3 text-sm text-gray-500">
                                    {{ product.percent_off === null ? product.percent_off : '%' + product.percent_off }}
                                </td>
                                <td class="px-2 py-3 text-sm text-gray-500">{{ product.price_offer }}</td>
                                <td class="px-2 py-3 text-sm text-gray-500">{{ product.old_price }}</td>
                                <td class="px-2 py-3 text-sm text-gray-500">
                                    {{ product.stock === 1 ? 'SI' : 'NO' }}</td>
                                <td class="px-2 py-3 text-sm text-gray-500 w-auto h-auto overflow-hidden text-center">
                                    <ImagePreview class="w-16 h-16 max-w-16 max-h-16 object-contain"
                                        :src="`${BASE_URL}/storage/${product.image_url}`" alt="Imagen del producto" />
                                </td>

                                <td class="px-2 py-3 text-sm text-gray-500">{{ product.category.name }}</td>
                                <td class="px-2 py-3 text-sm text-gray-500">{{ product.type.name }}</td>
                                <td class="px-2 py-3 text-sm text-gray-500">
                                    <button @click="openModalEdit(product)"
                                        class="bg-blue-500 text-white px-3 py-1 rounded text-xs">
                                        Editar
                                    </button>
                                </td>
                                <td class="px-2 py-3 text-sm text-gray-500">
                                    <button @click="openModalAlert(product.id)"
                                        class="bg-red-500 text-white px-3 py-1 rounded text-xs">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :pagination="pagination" :fetchPage="fetchPage" />
            </div>
            <div v-else>
                <p>No se encontraron productos</p>
            </div>
        </div>
    </div>
</template>
