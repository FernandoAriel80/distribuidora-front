<script setup>
import { ref, reactive } from 'vue';
import api from '@/app';
import TextInput from '@/components/TextInput.vue';
import FormButton from '@/components/FormButton.vue';
import { useRouter } from 'vue-router';
import { validateForm,validateAddress } from '@/functions/ValidateForm';

const address = ref({
    dni: '',
    phone_number: '',
    gender: '',
    //birth_date: '',
    address: '',
    postal_code: '',
    city: '',
    progress: false,
});

const errors = reactive({
    dni: '',
    phone_number: '',
    gender: '',
    //birth_date: '',
    address: '',
    postal_code: '',
    city: ''
});

const fields = [
    'dni','phone_number', 'gender', 'address', 'postal_code', 'city'
];

const emit = defineEmits(['actionExecuted']);

const router = useRouter();

const submit = async () => {
    try {
        const validate = validateForm(fields, errors, address, validateAddress);
        if (validate) {
            address.value.progress = true;

            const response = await api.post('/api/address/create', {
                dni: address.value.dni,
                phone_number: address.value.phone_number,
                gender: address.value.gender,
                address: address.value.address,
                postal_code: address.value.postal_code,
                city: address.value.city,
            });
            console.log(response.data)
            emit('actionExecuted');
        }
    } catch (error) {
        if (error.response && error.response.data.errors) {
            address.value.errors = error.response.data.errors;
        }
    } finally {
        address.value.progress = false;
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center">
        <form @submit.prevent="submit" class="p-6 rounded-md ring-1 ring-slate-300 max-w-md w-full">
            <label class="block text-3xl font-bold leading-8 text-slate-900 mb-6 text-center">Crear Dirección</label>
            <p>Para finalizar su compra y poder hacer un pedido, tiene que agregar mas detalles a sus datos personales.
            </p>

            <div class="mb-6">
                <TextInput name="DNI" v-model="address.dni" :message="errors.dni" />
                <TextInput name="Número de Teléfono" v-model="address.phone_number" :message="errors.phone_number" />
                <div class="mb-4">
                    <label for="gender" class="block text-sm font-medium text-slate-700">Género</label>
                    <select id="gender" v-model="address.gender" class="w-full p-2 border rounded"
                        :class="{ 'border-red-500': errors.gender }">
                        <option value="" disabled selected>Selecciona un género</option>
                        <option value="hombre">Hombre</option>
                        <option value="mujer">Mujer</option>
                        <option value="otros">Otros</option>
                    </select>
                    <span v-if="errors.gender" class="text-red-500 text-sm">{{ errors.gender }}</span>
                </div>
               <!--  <TextInput name="Fecha de nacimiento" type="date" v-model="address.birth_date"
                    :message="errors.birth_date" /> -->
                <TextInput name="Dirección" v-model="address.address" :message="errors.address" />
                <TextInput name="Código Postal" v-model="address.postal_code" :message="errors.postal_code" />
                <TextInput name="Localidad" v-model="address.city" :message="errors.city" />
            </div>

            <div>
                <FormButton :name="'Guardar Dirección'" :progress="address.progress" />
            </div>
        </form>
    </div>
</template>
