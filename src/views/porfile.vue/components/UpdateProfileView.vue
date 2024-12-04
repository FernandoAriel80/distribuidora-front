<script setup>
import { ref } from "vue";
import api from "@/app";
import { TOKEN } from "@/config";
import SuccessMessage from '@/components/SuccessMessage.vue';
import { showMessage, messageAlert } from '@/functions/MessageAlert';
import ModalAsk from '@/components/ModalAsk.vue';

const userInfo = ref({ name: "", last_name: "", email: "" });
const passwordData = ref({ current_password: "", new_password: "", confirm_password: "" });
const address = ref({
    dni: "",
    phone_number: "",
    gender: "",
    address: "",
    department: "",
    postal_code: "",
    city: ""
});

const fetchUserData = async () => {
    try {
        const response = await api.get("/api/profile/overview", {
            headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN)}` },
        });
        userInfo.value = response.data.user;
        address.value = response.data.address != null ? response.data.address : address.value;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

const updateInfo = async () => {
    try {
        const response = await api.put("/api/profile/update_info", userInfo.value,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN)}` },
            });
        console.log(response.data)
        createAddressMessage('informacion');
    } catch (error) {
        console.error("Error updating info:", error);
    }
};

const updatePassword = async () => {
    try {
        const response = await api.put("/api/profile/update_password", passwordData.value, {
            headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN)}` },
        });
        console.log(response.data)
        createAddressMessage('contraseña');
    } catch (error) {
        console.error("Error updating password:", error);
    }
};

const updateAddress = async () => {
    try {
        const response = await api.put("/api/profile/update_address", address.value, {
            headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN)}` },
        });
        console.log(response.data)
        createAddressMessage('direccion');
    } catch (error) {
        console.error("Error updating address:", error);
    }
};

const deleteAccount = async () => {
    try {
        const response = await api.delete("/api/profile/delete_account", {
            headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN)}` },
        });
        console.log(response.data)
        localStorage.removeItem(TOKEN);
        window.location.href = "/";
    } catch (error) {
        console.error("Error deleting account:", error);
    }
};

fetchUserData();
const successMessage = ref(messageAlert);
function createAddressMessage(dato) {
    showMessage('La ' + dato + ' se ha actualizado con éxito.');
}

//modal alert
const showAlert = ref(false);
const openModalAlert = () => {
    showAlert.value = true;
};
const closeModalAlert = () => {
    showAlert.value = false;
};
</script>

<template>
    <ModalAsk :isOpen="showAlert" :closeNo="closeModalAlert" :closeYes="deleteAccount"
        message="¿Está seguro de eliminar tu cuenta? No se puede recuperar." />
    <SuccessMessage v-if="messageAlert" :message="successMessage" />
    <div class="max-w-4xl mx-auto p-6 space-y-8">
        <div class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Actualizar información</h2>
            <form @submit.prevent="updateInfo">
                <div class="space-y-4">
                    <input type="text" v-model="userInfo.name" placeholder="Nombre" class="w-full p-2 border rounded" />
                    <input type="text" v-model="userInfo.last_name" placeholder="Apellido"
                        class="w-full p-2 border rounded" />
                    <input type="email" v-model="userInfo.email" placeholder="Correo"
                        class="w-full p-2 border rounded" />
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
                </div>
            </form>
        </div>
        <div class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Actualizar Clave</h2>
            <form @submit.prevent="updatePassword">
                <div class="space-y-4">
                    <input type="password" v-model="passwordData.current_password" placeholder="Clave Actual"
                        class="w-full p-2 border rounded" />
                    <input type="password" v-model="passwordData.new_password" placeholder="Clave Nueva"
                        class="w-full p-2 border rounded" />
                    <input type="password" v-model="passwordData.confirm_password" placeholder="Confirme Clave"
                        class="w-full p-2 border rounded" />
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
                </div>
            </form>
        </div>

        <!-- Update Address -->
        <div class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Actualizar Dirección </h2>
            <form @submit.prevent="updateAddress">
                <div class="space-y-4">
                    <input type="text" v-model="address.dni" placeholder="DNI" class="w-full p-2 border rounded" />
                    <input type="text" v-model="address.phone_number" placeholder="Numero de Telefono"
                        class="w-full p-2 border rounded" />
                    <div class="mb-4">
                        <label for="gender" class="block text-sm font-medium text-slate-400">Género</label>
                        <select id="gender" v-model="address.gender" class="w-full p-2 border rounded">
                            <option value="hombre">Hombre</option>
                            <option value="mujer">Mujer</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>
                    <!-- <input type="text" v-model="address.gender" placeholder="Genero"
                        class="w-full p-2 border rounded" /> -->
                    <!-- <div class="mb-4">
                        <label for="gender" class="block text-sm font-medium text-slate-700">Género*</label>
                        <select id="gender" v-model="address.gender" class="w-full p-2 border rounded"
                            :class="{ 'border-red-500': errors.gender }">
                            <option value="" disabled selected>Selecciona un género</option>
                            <option value="hombre">Hombre</option>
                            <option value="mujer">Mujer</option>
                            <option value="otros">Otros</option>
                        </select>
                        <span v-if="errors.gender" class="text-red-500 text-sm">{{ errors.gender }}</span>
                    </div> -->
                    <input type="text" v-model="address.address" placeholder="Dirección"
                        class="w-full p-2 border rounded" />
                    <input type="text" v-model="address.department" placeholder="Departamento"
                        class="w-full p-2 border rounded" />
                    <input type="text" v-model="address.postal_code" placeholder="Codigo Postal"
                        class="w-full p-2 border rounded" />
                    <input type="text" v-model="address.city" placeholder="Localidad"
                        class="w-full p-2 border rounded" />
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
                </div>
            </form>
        </div>

        <!-- Delete Account -->
        <div class="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
            <span class="text-red-500 font-semibold">Eliminar tu cuenta es irreversible.</span>
            <button @click="openModalAlert" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar Cuenta</button>
        </div>
    </div>
</template>
