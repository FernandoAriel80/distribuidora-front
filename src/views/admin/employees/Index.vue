<script setup>
import api from '@/app';
import { ref, watch, onMounted } from 'vue';
import SearchInput from '@/components/SearchInput.vue';
import Modal from '@/components/Modal.vue';
import ModalAsk from '@/components/ModalAsk.vue';
import CreateEmployees from './Create.vue'
import EditEmployees from './Edit.vue'
import { debounce } from 'lodash';

const employees = ref([]);
const search = ref('');
const pagination = ref(null);
const loading = ref(true);

const fetchPage = async (url = '/api/admin/employees') => {
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
        employees.value = response.data.employees;
        pagination.value = {
            current_page: response.data.employees.current_page,
            last_page: response.data.employees.last_page,
            next_page_url: response.data.employees.next_page_url,
            prev_page_url: response.data.employees.prev_page_url,
        };
    } catch (error) {
        console.error('Error al obtener empleados:', error);
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

////

const showModalCreate = ref(false);
const showModalEdit = ref(false);
const showAlert = ref(false);
const currentEmployee = ref(null);

const openModalCreate = () => showModalCreate.value = true;
const closeModalCreate = () => showModalCreate.value = false;

const openModalEdit = (product) => {
    currentEmployee.value = product;
    showModalEdit.value = true;
};
const closeModalEdit = () => showModalEdit.value = false;

const openModalAlert = (id) => {
    currentEmployee.value = { id };
    showAlert.value = true;
};
const closeModalAlertYes = async () => {
    const url = '/api/admin/employees/' + currentEmployee.value.id
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


function formatDate(dateString) {
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const timeFormatted = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    return `${dateFormatted} ${timeFormatted}`;
}
</script>
<template>
    <div>
        <button @click="openModalCreate" class="px-4 py-2 bg-blue-500 text-white rounded">Crear empleado</button>
        <Modal :isOpen="showModalCreate" :closeModal="closeModalCreate">
            <CreateEmployees @actionExecuted="handleProductCreated" />
        </Modal>
    </div>
    <div v-if="currentEmployee">
        <Modal :isOpen="showModalEdit" :closeModal="closeModalEdit">
            <EditEmployees :employees="currentEmployee" @actionExecuted="handleProductUpdated" />
        </Modal>
    </div>
    <div>
        <ModalAsk :isOpen="showAlert" :closeNo="closeModalAlert" :closeYes="closeModalAlertYes"
            message="¿Está seguro de eliminar este empleado?" />
    </div>
    <div v-if="loading" class="m-10">
        <h1>CARGANDO CONTENIDO.....</h1>
    </div>
    <div v-else class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Lista de Empleados</h1>

        <SearchInput v-model:searchValue="search" />

        <div v-if="employees.length" class="mr-10 ml-10">
            <div class="overflow-x-auto w-full max-w-6xl">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Apellido
                            </th>
                            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Correo</th>
                            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Creado
                            </th>
                            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Actualizado
                            </th>
                            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actualizar
                            </th>
                            <th class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Eliminar
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="empolyee in employees" :key="empolyee.id">
                            <td class="px-2 py-3 text-sm text-gray-900">{{ empolyee.name }}</td>
                            <td class="px-2 py-3 text-sm text-gray-900">{{ empolyee.last_name }}</td>
                            <td class="px-2 py-3 text-sm text-gray-500">{{ empolyee.email }}</td>
                            <td class="px-2 py-3 text-sm text-gray-500">{{ formatDate(empolyee.created_at) }}</td>
                            <td class="px-2 py-3 text-sm text-gray-500">{{ formatDate(empolyee.updated_at) }}</td>
                            <td class="px-4 py-3 text-sm text-gray-500">
                                <button @click="openModalEdit(empolyee)"
                                    class="bg-blue-500 text-white px-3 py-1 rounded text-xs">
                                    Editar
                                </button>
                            </td>

                            <td class="px-4 py-3 text-sm text-gray-500">
                                <button @click="openModalAlert(empolyee.id)"
                                    class="bg-red-500 text-white px-3 py-1 rounded text-xs">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>     
        </div>
        <div v-else>
            <p> empleado no encontrado</p>
        </div>
    </div>

</template>