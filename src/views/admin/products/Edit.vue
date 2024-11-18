<script setup>
import TextInput from '@/components/TextInput.vue';
import FormButton from '@/components/FormButton.vue';
import FormSelect from '@/components/FormSelect.vue';
import ImagePreview from '@/components/ImagePreview.vue';
import { BASE_URL } from '@/config'
import { validateForm, validateProduct } from '@/functions/ValidateForm';
import api from '@/app'
import { onMounted, ref, reactive } from 'vue';

const props = defineProps({
    products: {
        type: Object,
        required: true,
    },
});

const form = ref({
    catalog_id: props.products.catalog_id == null? '' : props.products.catalog_id,
    barcode: props.products.barcode == null? '' : props.products.barcode,
    name: props.products.name == null? '' : props.products.name,
    description: props.products.description == null? '' : props.products.description,
    unit_price: props.products.unit_price == null? '' : props.products.unit_price,
    bulk_unit_price: props.products.bulk_unit_price == null? '' : props.products.bulk_unit_price,
    bulk_unit: props.products.bulk_unit == null? '' : props.products.bulk_unit,
    percent_off: props.products.percent_off == null? '' : props.products.percent_off,
    offer: props.products.offer === 1 ? true : false,
    price_offer: props.products.price_offer == null? '' : props.products.price_offer,
    old_price: props.products.old_price == null? '' : props.products.old_price,
    stock: props.products.stock === 1 ? true : false,
    image_url: '',
    image_aux: props.products.image_url,
    category_id: props.products.category_id == null? '' : props.products.category_id,
    type_id: props.products.type_id == null? '' : props.products.type_id,
});

const errors = reactive({
    catalog_id: '',
    barcode: '',
    name: '',
    description: '',
    unit_price: '',
    bulk_unit_price: '',
    bulk_unit: '',
    percent_off: '',
    offer: false,
    price_offer: '',
    stock: true,
    image_url: '',
    category_id: '',
    type_id: '',
});

const fields = [
    'catalog_id',
    'barcode',
    'name',
    'category_id',
    'type_id',
    'unit_price',
    'description',
    'bulk_unit_price',
    'bulk_unit',
    'percent_off',
    'offer',
    'price_offer',
    'stock',
    'image_url',
];


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
const srcImg = ref(props.products.image_url);

const change = (e) => {
    if (form.value.image_url == undefined || form.value.image_url == "") {
        form.value.image_url = e.target.files[0];
        srcImg.value = URL.createObjectURL(e.target.files[0]);
    } else {
        form.value.image_url = e.target.files[0];
        srcImg.value = URL.createObjectURL(e.target.files[0]);
    }
};

const submit = async () => {
    const result = validateForm(fields, errors, form, validateProduct);
    try {
        if (result) {
            console.log('mando formulario')
            const formData = new FormData();
            formData.append('catalog_id', form.value.catalog_id);
            formData.append('barcode', form.value.barcode);
            formData.append('name', form.value.name);
            formData.append('description', form.value.description);
            formData.append('unit_price', form.value.unit_price);
            formData.append('bulk_unit_price', form.value.bulk_unit_price);
            formData.append('bulk_unit', form.value.bulk_unit);
            formData.append('percent_off', form.value.percent_off);
            formData.append('offer', form.value.offer);
            formData.append('price_offer', form.value.price_offer);
            formData.append('old_price', form.value.old_price);
            formData.append('stock', form.value.stock);
            formData.append('image_url', form.value.image_url);
            formData.append('image_aux', form.value.image_aux);
            formData.append('category_id', form.value.category_id);
            formData.append('type_id', form.value.type_id);

            const response = await api.post('/api/admin/products/edit/'+props.products.id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            emit('actionExecuted');
            console.log(response.data);
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
    }
};

</script>

<template>
    <div class="w-full max-w-4xl mx-auto">
        <form @submit.prevent="submit" class="p-4 rounded-md ring-1 ring-slate-300">
            <label class="block text-3xl font-bold leading-8 text-slate-900 mb-6 text-center">Editar Producto</label>
            <div>
                <div class="p-3 bg-green-500">
                    <div>
                        <label for="stock"> ¿Tiene stock?</label>
                        <input type="checkbox" id="stock" class="m-2" v-model="form.stock" />
                        <label for="offer"> ¿Está en oferta?</label>
                        <input type="checkbox" id="offer" class="m-2" v-model="form.offer" />
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <TextInput name="ID producto" v-model="form.catalog_id" :message="errors.catalog_id" />
                <TextInput name="Código de barras" v-model="form.barcode" :message="errors.barcode" />
                <TextInput name="Nombre producto" v-model="form.name" :message="errors.name" />
                <FormSelect name="Unidad de medida" v-model="form.type_id" :datas="types" :message="errors.type_id" />
                <FormSelect name="Seleccione Categoría" v-model="form.category_id" :datas="categories"
                    :message="errors.category_id" />

                <div v-if="form.offer">
                    <TextInput name="Porcentaje de descuento (no obligatorio)" v-model="form.percent_off" />
                    <TextInput name="Precio oferta" v-model="form.price_offer" />
                    <TextInput v-if="form.type_id == 1" name="Precio único por bulto en oferta"
                        v-model="form.bulk_unit_price" :message="errors.bulk_unit_price" />
                </div>
                <div v-else-if="(!form.offer && form.type_id == 1)">
                    <TextInput name="Precio por unidad" v-model="form.unit_price" :message="errors.unit_price" />
                    <TextInput name="Precio único por bulto" v-model="form.bulk_unit_price"
                        :message="errors.bulk_unit_price" />
                    <TextInput name="Cantidad de unidad por bulto" v-model="form.bulk_unit"
                        :message="errors.bulk_unit" />
                </div>
                <div v-else-if="!form.offer">
                    <TextInput name="Precio" v-model="form.unit_price" :message="errors.unit_price" />
                </div>
            </div>
            <div class="">

                <div class="m-1">
                    <label class="block text-sm font-medium leading-6 text-slate-900">Descripción</label>
                    <textarea id="largeText" v-model="form.description" rows="6"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Escribe aquí una descripción detallada..."></textarea>
                    <p class="text-red-500 text-sm">{{ errors.description }}</p>
                </div>

                <div class="flex flex-col space-y-2 m-1">
                    <div v-if="props.products.image_url == srcImg">
                        <ImagePreview class="mb-2 w-32 h-32" :src="`${BASE_URL}/storage/${srcImg}`"
                            alt="Imagen del producto" />
                    </div>
                    <div v-else>
                        <ImagePreview class="mb-2 w-32 h-32" :src="srcImg" alt="Imagen del producto" />
                    </div>
                    <div class="flex flex-col space-y-2 m-1">
                        <label for="image_url" class="text-sm font-medium text-gray-700">Foto producto</label>
                        <input type="file" id="image_url" @change="change"
                            class="text-sm p-2 border border-gray-300 rounded-md" />
                        <p class="text-red-500 text-sm">{{ errors.image_url }}</p>
                    </div>
                </div>
            </div>
            <div>
                <FormButton :name="'Actualizar'" class="max-w-[200px] ml-auto" />
            </div>
        </form>
    </div>
</template>
