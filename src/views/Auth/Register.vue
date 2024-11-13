<script setup>
import { ref } from 'vue';
import api from '../../app';
import TextInput from '../../components/TextInput.vue';
import FormButton from '../../Components/FormButton.vue';
import { useRouter } from 'vue-router'; 

const form = ref({
  name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: '',
  errors: {},
  progress: false, 
});

const router = useRouter();

const submit = async () => {
  form.value.errors = {};

  if (form.value.password !== form.value.password_confirmation) {
    form.value.errors.password_confirmation = 'Las contraseñas no coinciden';
    return;
  }

  try {

    form.value.progress = true;

    const response = await api.post('/api/register', {
      name: form.value.name,
      last_name: form.value.last_name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
    });

    router.push({ name: 'login' }); 
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

  <div class="min-h-screen flex items-center justify-center">
    <form @submit.prevent="submit" class="p-6 rounded-md ring-1 ring-slate-300 max-w-md w-full">
      <label class="block text-3xl font-bold leading-8 text-slate-900 mb-6 text-center">Registrarse</label>
      
      <div class="mb-6">
        <TextInput 
          name="Nombre" 
          v-model="form.value.name" 
          :message="form.value.errors.name" 
        />
        <TextInput 
          name="Apellido" 
          v-model="form.value.last_name" 
          :message="form.value.errors.last_name" 
        />
        <TextInput 
          name="Correo" 
          type="email" 
          v-model="form.value.email" 
          :message="form.value.errors.email" 
        />
        <TextInput 
          name="Contraseña" 
          type="password" 
          v-model="form.value.password" 
          :message="form.value.errors.password" 
        />
        <TextInput 
          name="Confirmar Contraseña" 
          type="password" 
          v-model="form.value.password_confirmation" 
          :message="form.value.errors.password_confirmation" 
        />

        <div>
          <p class="text-slate-600 mb-2">
            ¿Ya tienes cuenta? 
            <router-link to="/login" class="text-link text-blue-400">Iniciar Sesión</router-link>
          </p>
          <FormButton :name="'Registrarse'" :progress="form.value.progress" />
        </div>
      </div>
    </form>
  </div>
</template>

