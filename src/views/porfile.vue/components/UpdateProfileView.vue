<script setup>
import { ref,reactive } from "vue";
import api from "@/app";
import { TOKEN } from "@/config";
import SuccessMessage from '@/components/SuccessMessage.vue';
import { showMessage, messageAlert } from '@/functions/MessageAlert';
import ModalAsk from '@/components/ModalAsk.vue';
import { validateForm, validateAddress,validatePasswordPorfile,validateInfoPorfile } from '@/functions/ValidateForm';

const userInfo = ref({
    name: "",
    last_name: "",
    email: ""
});

const passwordData = ref({
    current_password: "",
    password: "",
    password_confirmation: ""
});

const address = ref({
    dni: "",
    phone_number: "",
    gender: "",
    address: "",
    department: "",
    postal_code: "",
    city: ""
});

//info
const errorsInfo = reactive({
    name: "",
    last_name: "",
    email: "",
});

const fieldsInfo = [
    'name', 'last_name', 'email'
];
//password
const errorsPass = reactive({
    current_password: "",
    password: "",
    password_confirmation: "",
});

const fieldsPass = [
'current_password','password', 'password_confirmation',
];
//address
const errorsAddress = reactive({
    dni: "",
    phone_number: "",
    gender: "",
    address: "",
    postal_code: "",
    city: ""
});

const fieldsAddres = [
     'dni', 'phone_number', 'gender', 'address', 'postal_code', 'city'
];


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
        const validate = validateForm(fieldsInfo, errorsInfo, userInfo, validateInfoPorfile);
        console.log(validate)
        if (validate) {
            const response = await api.put("/api/profile/update_info", userInfo.value,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN)}` },
                });
            console.log(response.data)
            createAddressMessage('informacion');
        }
    } catch (error) {
        console.error("Error updating info:", error);
    }
};

const updatePassword = async () => {
    try {
        const validate = validateForm(fieldsPass, errorsPass, passwordData, validatePasswordPorfile);
        if (validate) {
            const response = await api.put("/api/profile/update_password", passwordData.value, {
                headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN)}` },
            });
            console.log(response.data)
            createAddressMessage('contraseña');
        }
    } catch (error) {
        console.error("Error updating password:", error);
    }
};

const updateAddress = async () => {
    try {
        const validate = validateForm(fieldsAddres, errorsAddress, address, validateAddress);
        if (validate) {
            const response = await api.put("/api/profile/update_address", address.value, {
                headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN)}` },
            });
            console.log(response.data)
            createAddressMessage('direccion');
        }
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
    <div class="max-w-4xl mx-auto md:p-6 space-y-8">
        <div class="bg-white shadow-md rounded-lg md:p-6 p-3">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Actualizar información</h2>
            <form @submit.prevent="updateInfo">
                <div class="space-y-4">
                    <input type="text" v-model="userInfo.name" placeholder="Nombre" class="w-full p-2 border rounded"
                        :class="{ 'border-red-500': errorsInfo.name }" />
                    <span v-if="errorsInfo.name" class="text-red-500 text-sm">{{ errorsInfo.name }}</span>

                    <input type="text" v-model="userInfo.last_name" placeholder="Apellido"
                        class="w-full p-2 border rounded" :class="{ 'border-red-500': errorsInfo.last_name }" />
                    <span v-if="errorsInfo.last_name" class="text-red-500 text-sm">{{ errorsInfo.last_name }}</span>

                    <input type="email" v-model="userInfo.email" placeholder="Correo" class="w-full p-2 border rounded"
                        :class="{ 'border-red-500': errorsInfo.email }" />
                    <span v-if="errorsInfo.email" class="text-red-500 text-sm">{{ errorsInfo.email }}</span>

                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
                </div>
            </form>
        </div>
        <div class="bg-white shadow-md rounded-lg md:p-6 p-3">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Actualizar Clave</h2>
            <form @submit.prevent="updatePassword">
                <div class="space-y-4">
                    <input type="password" v-model="passwordData.current_password" placeholder="Clave Actual"
                        class="w-full p-2 border rounded" :class="{ 'border-red-500': errorsPass.current_password }"/>
                        <span v-if="errorsPass.current_password" class="text-red-500 text-sm">{{ errorsPass.current_password }}</span>

                    <input type="password" v-model="passwordData.password" placeholder="Clave Nueva"
                        class="w-full p-2 border rounded" :class="{ 'border-red-500': errorsPass.password }" />
                    <span v-if="errorsPass.password" class="text-red-500 text-sm">{{ errorsPass.password }}</span>

                    <input type="password" v-model="passwordData.password_confirmation" placeholder="Confirme Clave"
                        class="w-full p-2 border rounded" :class="{ 'border-red-500': errorsPass.password_confirmation }" />
                    <span v-if="errorsPass.password_confirmation" class="text-red-500 text-sm">{{
                        errorsPass.password_confirmation }}</span>

                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
                </div>
            </form>
        </div>

        <!-- Update Address -->
        <div class="bg-white shadow-md rounded-lg md:p-6 p-3">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Actualizar Dirección </h2>
            <form @submit.prevent="updateAddress">
                <div class="space-y-4">
                    <input type="text" v-model="address.dni" placeholder="DNI" class="w-full p-2 border rounded"
                        :class="{ 'border-red-500': errorsAddress.dni }" />
                    <span v-if="errorsAddress.dni" class="text-red-500 text-sm">{{ errorsAddress.dni }}</span>

                    <input type="text" v-model="address.phone_number" placeholder="Numero de Telefono"
                        class="w-full p-2 border rounded" :class="{ 'border-red-500': errorsAddress.phone_number }" />
                    <span v-if="errorsAddress.phone_number" class="text-red-500 text-sm">{{ errorsAddress.phone_number }}</span>

                    <div class="mb-4">
                        <label for="gender" class="block text-sm font-medium text-slate-400">Género</label>
                        <select id="gender" v-model="address.gender" class="w-full p-2 border rounded"
                            :class="{ 'border-red-500': errorsAddress.gender }">
                            <option value="hombre">Hombre</option>
                            <option value="mujer">Mujer</option>
                            <option value="otros">Otros</option>
                        </select>
                        <span v-if="errorsAddress.gender" class="text-red-500 text-sm">{{ errorsAddress.gender }}</span>
                    </div>

                    <input type="text" v-model="address.address" placeholder="Dirección"
                        class="w-full p-2 border rounded" :class="{ 'border-red-500': errorsAddress.address }" />
                    <span v-if="errorsAddress.address" class="text-red-500 text-sm">{{ errorsAddress.address }}</span>

                    <input type="text" v-model="address.department" placeholder="Departamento"
                        class="w-full p-2 border rounded"/>

                    <input type="text" v-model="address.postal_code" placeholder="Codigo Postal"
                        class="w-full p-2 border rounded" :class="{ 'border-red-500': errorsAddress.postal_code }" />
                    <span v-if="errorsAddress.postal_code" class="text-red-500 text-sm">{{ errorsAddress.postal_code }}</span>

                    <input type="text" v-model="address.city" placeholder="Localidad" class="w-full p-2 border rounded"
                        :class="{ 'border-red-500': errorsAddress.city }" />
                    <span v-if="errorsAddress.city" class="text-red-500 text-sm">{{ errorsAddress.city }}</span>

                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
                </div>
            </form>
        </div>

        <!-- Delete Account -->
        <div class="bg-white shadow-md rounded-lg md:p-6 p-2 flex items-center justify-between">
            <span class="text-red-500 font-semibold">Eliminar tu cuenta es irreversible.</span>
            <button @click="openModalAlert" class="bg-red-500 text-white md:px-4 ms:py-2 rounded">Eliminar Cuenta</button>
        </div>
    </div>
</template>
