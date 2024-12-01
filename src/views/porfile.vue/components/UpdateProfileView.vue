<script setup>
import { ref } from "vue";
import axios from "axios";

const userInfo = ref({ name: "", last_name: "", email: "" });
const passwordData = ref({ current_password: "", new_password: "", confirm_password: "" });
const address = ref({ dni: "", gender: "", birth_date: "", address: "", postal_code: "", city: "" });

const fetchUserData = async () => {
    try {
        const response = await axios.get("/api/profile/overview", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        userInfo.value = response.data.user;
        address.value = response.data.address;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

const updateInfo = async () => {
    try {
        await axios.put("/api/profile/update-info", userInfo.value, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("User info updated successfully.");
    } catch (error) {
        console.error("Error updating info:", error);
    }
};

const updatePassword = async () => {
    try {
        await axios.put("/api/profile/update-password", passwordData.value, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Password updated successfully.");
    } catch (error) {
        console.error("Error updating password:", error);
    }
};

const updateAddress = async () => {
    try {
        await axios.put("/api/profile/update-address", address.value, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Address updated successfully.");
    } catch (error) {
        console.error("Error updating address:", error);
    }
};

const deleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
        try {
            await axios.delete("/api/profile/delete-account", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("Account deleted successfully.");
            // Redirigir al usuario fuera de la aplicación después de eliminar la cuenta
            window.location.href = "/";
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    }
};

fetchUserData();
</script>

<template>
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
                    <input type="text" v-model="address.gender" placeholder="Genero"
                        class="w-full p-2 border rounded" />
                    <input type="date" v-model="address.birth_date" class="w-full p-2 border rounded" />
                    <input type="text" v-model="address.address" placeholder="Dirección"
                        class="w-full p-2 border rounded" />
                    <input type="text" v-model="address.postal_code" placeholder="Codigo Postal"
                        class="w-full p-2 border rounded" />
                    <input type="text" v-model="address.city" placeholder="Localidad" class="w-full p-2 border rounded" />
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
                </div>
            </form>
        </div>

        <!-- Delete Account -->
        <div class="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
            <span class="text-red-500 font-semibold">Eliminar tu cuenta es irreversible.</span>
            <button @click="deleteAccount" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar Cuenta</button>
        </div>
    </div>
</template>
