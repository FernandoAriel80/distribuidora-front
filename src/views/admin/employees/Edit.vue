<script setup>
import { ref, reactive } from 'vue';
import api from '@/app';
import { TOKEN } from '@/config';
import TextInput from '@/components/TextInput.vue';
import FormButton from '@/components/FormButton.vue';
import { validateForm, validateRegisterEmpleado } from '@/functions/ValidateForm';

const props = defineProps({
    employees: {
        type: Object,
        required: true,
    },
});
const form = ref({
    name: props.employees.name == null ? '' : props.employees.name,
    last_name: props.employees.last_name == null ? '' : props.employees.last_name,
    email: props.employees.email == null ? '' : props.employees.email,
    password: '',
    password_confirmation: '',
});

const errors = reactive({
    name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const fields = [
    'name',
    'last_name',
    'email',
    'password',
    'password_confirmation',
];


const emit = defineEmits(['actionExecuted']);

const submit = async () => {
    const result = validateForm(fields, errors, form, validateRegisterEmpleado);
    try {
        if (result) {
            const response = await api.put('/api/admin/employees/edit/'+ props.employees.id,
                {
                    name: form.value.name,
                    last_name: form.value.last_name,
                    email: form.value.email,
                    password: form.value.password,
                    password_confirmation: form.value.password_confirmation,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(TOKEN)}`
                    }
                });
            emit('actionExecuted');
            console.log(response.data);
        }
    } catch (error) {
        console.error('Error al actualizar empleado:', error);
    }
};
</script>
<template>

    <div class="min-h-screen flex items-center justify-center">
        <form @submit.prevent="submit" class="p-6 rounded-md ring-1 ring-slate-300 max-w-md w-full">
            <label class="block text-3xl font-bold leading-8 text-slate-900 mb-6 text-center">Registrar</label>

            <div class="mb-6">
                <TextInput name="Nombre" v-model="form.name" :message="errors.name" />
                <TextInput name="Apellido" v-model="form.last_name" :message="errors.last_name" />
                <TextInput name="Correo" type="email" v-model="form.email" :message="errors.email" />
                <TextInput name="Contraseña" type="password" v-model="form.password" :message="errors.password" />
                <TextInput name="Confirmar Contraseña" type="password" v-model="form.password_confirmation"
                    :message="errors.password_confirmation" />
                <div>
                    <FormButton :name="'Registrar'" />
                </div>
            </div>
        </form>
    </div>
</template>