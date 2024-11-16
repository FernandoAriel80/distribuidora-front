<script setup>
import TextInput from '../../../components/TextInput.vue';
import FormButton from '../../../components/FormButton.vue';
import FormSelect from '../../../components/FormSelect.vue';
import api from '../../../app'
import { onMounted, ref } from 'vue';

const form = ref({
    catalog_id: '',
    name: '',
    description: '',
    unit_price: '',
    bulk_unit_price: '',
    bulk_unit: '',
    percent_off: null,
    offer: false,
    price_offer: '',
    old_price: '',
    stock: true,
    image_url: '',
    category_id: '',
    type_id: '',
});

const categories = ref([]);
const types = ref([]);

const fetchPage = async (url = '/api/admin/products/create') => {
    try {
        const response = await api.get(url,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        categories.value = response.data.categories;
        types.value = response.data.types;
    } catch (error) {
        console.error('Error al obtener category y type:', error);
    }
}

onMounted(() => {
    fetchPage();
});

const emit = defineEmits(['actionExecuted']);
const change = (e) => {
    form.image_url = e.target.files[0];
};


const submit = async () => {
    try {
        const response = await api.post('/api/admin/products/create', {
                catalog_id: form.value.catalog_id,
                name: form.value.name,
                description: form.value.description,
                unit_price: form.value.unit_price,
                bulk_unit_price: form.value.bulk_unit_price,
                bulk_unit: form.value.bulk_unit,
                percent_off: form.value.percent_off,
                offer: form.value.offer, 
                price_offer: form.value.price_offer,
                old_price: form.value.old_price,
                stock: form.value.stock,
                image_url: form.value.image_url,
                category_id: form.value.category_id,
                type_id: form.value.type_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }); 
        emit('actionExecuted');
    } catch (error) {
        console.error('Error al crear producto:', error);
    }
};

</script>

<template>
    <div class="w-full max-w-4xl mx-auto">
        <form @submit.prevent="submit" class="p-4 rounded-md ring-1 ring-slate-300">
            <label class="block text-3xl font-bold leading-8 text-slate-900 mb-6 text-center">Cargar Producto</label>
            <div>
                <div class="p-3 bg-green-500">
                    <div>
                        <label for="stock"> ¿Tiene stock?</label>
                        <input type="checkbox" id="stock" class="m-2" v-model="form.stock" />
                        <label for="offer"> ¿Esta en oferta?</label>
                        <input type="checkbox" id="offer" class="m-2" v-model="form.offer" />
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <TextInput name="ID producto" v-model="form.catalog_id" />
                <TextInput name="Nombre producto" v-model="form.name" />
                <formSelect name="Undiad de medida" v-model="form.type_id" :datas="types" />
                <formSelect name="Seleccione Categoria" v-model="form.category_id" :datas="categories" />
                <div v-if="form.offer">
                    <TextInput name="Porcentaje de descuento (no obligatorio)" v-model="form.percent_off" />
                    <TextInput name="Precio oferta" v-model="form.price_offer" />
                </div>
                <div v-else-if="(!form.offer && form.type_id == 1)">
                    <TextInput name="Precio por unidad" v-model="form.unit_price" />
                    <TextInput name="Precio unico por bulto" v-model="form.bulk_unit_price" />
                    <TextInput name="Cantidad de unidad por bulto" v-model="form.bulk_unit" />
                </div>
                <div v-else-if="!form.offer">
                    <TextInput name="Precio" v-model="form.unit_price" />
                </div>
            </div>
            <div class="">

                <div class="m-1">
                    <label class="block text-sm font-medium leading-6 text-slate-900">Descripcion</label>
                    <textarea id="largeText" v-model="form.description" rows="6" class="mt-1 block w-full p-2 
                        border border-gray-300 rounded-md shadow-sm
                      focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Escribe aquí una descripción detallada..."></textarea>
                    <!--  <small class="error" v-if="form.errors.price_offer">{{ form.errors.description }}</small> -->
                </div>

                <div class="flex flex-col space-y-2 m-1">
                    <label for="image_url" class="text-sm font-medium text-gray-700">Foto producto</label>
                    <input type="file" id="image_url" @input="change"
                        class="text-sm p-2 border border-gray-300 rounded-md" />
                    <!--   <p class="text-red-500 text-sm">{{ form.errors.image_url }}</p> -->
                </div>
            </div>
            <div>
                <FormButton :name="'Guardar'" class=" max-w-[200px] ml-auto" />
            </div>
        </form>
    </div>

</template>