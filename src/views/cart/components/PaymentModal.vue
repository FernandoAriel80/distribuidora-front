<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);

function closeModal() {
    emit('close');
}

</script>

<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg w-1/3 p-6 shadow-lg relative">

            <h2 class="text-xl font-bold text-center mb-4">Elija método de pago</h2>

            <div class="flex flex-col gap-4">
                <router-link 
                    class="flex justify-center items-center bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    to="/metodo-pago">
                    Metodo de pago
                </router-link>
                <button @click="closeModal"
                    class="flex justify-center items-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                    Salir
                </button>
            </div>

        </div>
    </div>
</template>