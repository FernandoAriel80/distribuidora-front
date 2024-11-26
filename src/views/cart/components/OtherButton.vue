<script setup>
const handleClick = () => {
  console.log("Otros métodos de pago seleccionados");
};
</script>
<template>
    <button
      class="w-full bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg shadow hover:bg-gray-400 transition-colors flex justify-center items-center"
      @click="handleClick"
    >
      Otros métodos de pago
    </button>
  </template>
  