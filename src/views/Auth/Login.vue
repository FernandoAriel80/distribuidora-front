<script setup>
import { ref } from 'vue';
import api from '../../app';
import TextInput from '../../components/TextInput.vue';
import FormButton from '../../Components/FormButton.vue';
import { useRouter } from 'vue-router'; 
import { useAuth } from '../../composables/UserAuth';

const form = ref({
  email: '',
  password: '',
  remember: false,
  errors: {},
  progress: false, 
});
const { fetchUser } = useAuth();
const router = useRouter();

const submit = async () => {
    form.value.errors = {}; 
    
    try {
        form.value.progress = true;     
        const response = await api.post('/api/login', {
        email: form.value.email,
        password: form.value.password,
        remember: form.value.remember,
    });
    localStorage.setItem('token', response.data.token);
    await fetchUser();
    alert('Inicio de sesión exitoso');
    router.push({ name: 'home' });
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
      <label class="block text-3xl font-bold leading-8 text-slate-900 mb-6 text-center">Iniciar Sesión</label>
      <div class="mb-6">
        <TextInput 
          name="Correo" 
          type="email" 
          v-model="form.email" 
          :message="form.errors.email" 
        />
        <TextInput 
          name="Contraseña" 
          type="password" 
          v-model="form.password" 
          :message="form.errors.password" 
        />

        <div>
          <input 
            type="checkbox" 
            v-model="form.remember" 
            id="remember" 
          />
          <label for="remember"> Recordar cuenta</label>
        </div>

        <div>
          <p class="text-slate-600 mb-2">
            ¿Aún no tienes cuenta? 
            <router-link to="/register" class="text-link text-blue-400">Regístrate</router-link>
          </p>
          <FormButton :name="'Iniciar Sesión'" :progress="form.progress" />
        </div>
      </div>
    </form>
  </div>
</template>

