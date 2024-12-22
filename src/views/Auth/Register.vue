<script setup>
import { ref, reactive } from 'vue';
import api from '@/app';
import TextInput from '@/components/TextInput.vue';
import FormButton from '@/components/FormButton.vue';
import { useRouter } from 'vue-router';
import { validateForm, validateRegister } from '@/functions/ValidateForm';
import Layout from '@/layout/Layout.vue';

const form = ref({
  name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: '',
  progress: false,
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

const router = useRouter();

const submit = async () => {

  try {
    const validate = validateForm(fields, errors, form, validateRegister);
    if (validate) {
      form.value.progress = true;

      const response = await api.post('/api/register', {
        name: form.value.name,
        last_name: form.value.last_name,
        email: form.value.email,
        password: form.value.password,
        password_confirmation: form.value.password_confirmation,
      });

      router.push({
        name: 'login',
        query: { message: 'El registro se completó con éxito. Por favor, inicia sesión.' }
      });
    }

  } catch (error) {
    if (error.response && error.response.data.errors) {
      form.value.errors = error.response.data.errors;
    }
  } finally {
    form.value.progress = false;
  }
};

</script>

<template>
  <Layout/>
  <div class="min-h-screen flex items-center justify-center">
    <form @submit.prevent="submit" class="p-6 rounded-md ring-1 ring-slate-300 max-w-md w-full">
      <label class="block text-3xl font-bold leading-8 text-slate-900 mb-6 text-center">Registrarse</label>

      <div class="mb-6">
        <TextInput name="Nombre" v-model="form.name" :message="errors.name" />
        <TextInput name="Apellido" v-model="form.last_name" :message="errors.last_name" />
        <TextInput name="Correo" type="email" v-model="form.email" :message="errors.email" />
        <TextInput name="Contraseña" type="password" v-model="form.password" :message="errors.password" />
        <TextInput name="Confirmar Contraseña" type="password" v-model="form.password_confirmation"
          :message="errors.password_confirmation" />

        <div>
          <p class="text-slate-600 mb-2">
            ¿Ya tienes cuenta?
            <router-link to="/inicia-sesion" class="text-link text-blue-400">Iniciar Sesión</router-link>
          </p>
          <FormButton :name="'Registrarse'" :progress="form.progress" />
        </div>
      </div>
    </form>
  </div>
</template>
