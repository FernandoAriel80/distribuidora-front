<script setup>
import api from '../../../app';
import { ref, defineProps, watch, onMounted } from 'vue';
import ImagePreview from '../../../components/ImagePreview.vue';
import Pagination from '../../../components/Pagination.vue';
import SearchInput from '../../../components/SearchInput.vue';
import Modal from '../../../components/Modal.vue';
import ModalAsk from '../../../components/ModalAsk.vue';
import CreateProduct from './Create.vue'
import UpdateProduct from './Edit.vue'
import { debounce } from 'lodash';

const props = defineProps({
    categories: {
        type: Object,
        required: true
    },
    types: {
        type: Object,
        required: true,
    },
    searchTerm: String
});

const products = ref([]);
const search = ref(props.searchTerm || '');
const pagination = ref(null);
console.log(products)
async function fetchPage(url = '/api/admin/products') {
    try {
        const response = await api.get(url, /* {
            params: {
                search: search.value,
                category: category.value,
                sort: sort.value,
            },
        },  */
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        products.value = response.data.products.data;
        categories.value = response.data.categories;
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


const searchDebounced = debounce(() => {
    fetchPage(1, search.value);
}, 300);

watch(search, () => {
    searchDebounced();
});

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
    try {
        await api.delete(`/api/products/${currentProduct.value.id}`);
        showAlert.value = false;
        loadProducts();
    } catch (error) {
        console.error('Error eliminando el producto:', error);
    }
};

const closeModalAlert = () => {
    showAlert.value = false;
};

// Crear y actualizar productos (ejecutado desde componentes hijos)
const handleProductCreated = () => {
    closeModalCreate();
    loadProducts();
};

const handleProductUpdated = () => {
    closeModalEdit();
    loadProducts();
};
</script>

<template>
    <div>
        <!-- Botón para cargar un producto y modal de creación -->
        <button @click="openModalCreate" class="px-4 py-2 bg-blue-500 text-white rounded">Cargar Producto</button>
        <Modal :isOpen="showModalCreate" :closeModal="closeModalCreate">
            <CreateProduct :categories="props.categories" :types="props.types" @actionExecuted="handleProductCreated" />
        </Modal>

        <!-- Modal de edición de producto -->
        <div v-if="currentProduct">
            <Modal :isOpen="showModalEdit" :closeModal="closeModalEdit">
                <UpdateProduct :product="currentProduct" :categories="props.categories" :types="props.types"
                    @actionExecuted="handleProductUpdated" />
            </Modal>
        </div>

        <!-- Modal de confirmación de eliminación -->
        <ModalAsk :isOpen="showAlert" :closeNo="closeModalAlert" :closeYes="closeModalAlertYes"
            message="¿Está seguro de eliminar este producto?" />

        <!-- Campo de búsqueda -->
        <SearchInput v-model:searchValue="search" />

        <!-- Lista de productos -->
        <div v-if="products.length">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID
                        </th>
                        <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre</th>
                        <!-- Otras columnas según el diseño original -->
                        <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Editar</th>
                        <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Eliminar</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="product in products" :key="product.id">
                        <td class="px-2 py-3 text-sm text-gray-900">{{ product.catalog_id }}</td>
                        <td class="px-2 py-3 text-sm text-gray-500">{{ product.name }}</td>
                        <!-- Otras celdas de datos del producto -->
                        <td class="px-2 py-3 text-sm text-gray-500">
                            <button @click="openModalEdit(product)"
                                class="bg-blue-500 text-white px-3 py-1 rounded text-xs">Editar</button>
                        </td>
                        <td class="px-2 py-3 text-sm text-gray-500">
                            <button @click="openModalAlert(product.id)"
                                class="bg-red-500 text-white px-3 py-1 rounded text-xs">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Paginación -->
            <!--  <Pagination class="mt-4" :links="pagination.value.links" @page-changed="loadProducts" /> -->
            <Pagination :pagination="pagination" :fetchPage="fetchPage" />
        </div>
        <div v-else>
            <p>No se encontraron productos</p>
        </div>
    </div>
</template>
