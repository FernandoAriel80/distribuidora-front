<script setup>
import { ref, reactive } from 'vue';
import { TOKEN } from '@/config';
import api from '@/app';
import TextInput from '@/components/TextInput.vue';
import FormButton from '@/components/FormButton.vue';
import SuccessMessage from '@/components/SuccessMessage.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import { validateForm, validateLogin } from '@/functions/ValidateForm';
import { showMessage, messageAlert } from '@/functions/MessageAlert';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/UserAuth';

const form = ref({
  email: '',
  password: '',
  remember: false,
  progress: false,
});

const errors = reactive({
  email: '',
  password: '',
});

const fields = [
  'email',
  'password',
];

const { fetchUser } = useAuth();
const router = useRouter();

const submit = async () => {

  try {
    const validate = validateForm(fields, errors, form, validateLogin);
    if (validate) {
      form.value.progress = true;
      const response = await api.post('/api/login', {
        email: form.value.email,
        password: form.value.password,
        remember: form.value.remember,
      });
      if (response.data.token != null) {
        if (localStorage.getItem(TOKEN) == null) {
          localStorage.setItem(TOKEN, response.data.token);
        }
        await fetchUser();
        router.push({ name: 'home' });
      }else{
        errorMessage.value = messageAlert;
        showMessage(response.data.message)
      }

    }
  } catch (error) {
    if (error.response && error.response.data.errors) {
      form.value.errors = error.response.data.errors;
    }
  } finally {
    form.value.progress = false;
  }
};

///// message

const successMessage = ref(messageAlert);
const errorMessage = ref('');

import { useRoute } from 'vue-router';
import Layout from '@/layout/Layout.vue';

const route = useRoute();
const message = route.query.message;

if (message) {
  showMessage(message)
}
</script>

<template>
  <Layout/>
  <!-- Mensaje de éxito, visible solo si successMessage tiene valor -->
  <SuccessMessage v-if="messageAlert" :message="successMessage" />
  <ErrorMessage v-if="messageAlert" :message="errorMessage" />
  <div class="min-h-screen flex items-center justify-center">
    <form @submit.prevent="submit" class="p-6 rounded-md ring-1 ring-slate-300 max-w-md w-full">
      <label class="block text-3xl font-bold leading-8 text-slate-900 mb-6 text-center">Iniciar Sesión</label>
      <div class="mb-6">
        <TextInput name="Correo" type="email" v-model="form.email" :message="errors.email" />
        <TextInput name="Contraseña" type="password" v-model="form.password" :message="errors.password" />

        <div>
          <input type="checkbox" v-model="form.remember" id="remember" />
          <label for="remember"> Recordar cuenta</label>
        </div>

        <div>
          <p class="text-slate-600 mb-2">
            ¿Aún no tienes cuenta?
            <router-link to="/registar" class="text-link text-blue-400">Regístrate</router-link>
          </p>
          <FormButton :name="'Iniciar Sesión'" :progress="form.progress" />
        </div>
      </div>
    </form>
  </div>
</template>
