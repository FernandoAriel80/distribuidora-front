<script setup>
import Layout from '@/layout/Layout.vue';


</script>

<template>
  <Layout />
  <div class="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-sm mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center">Menú Administrativo</h1>
    <ul class="space-y-4">
      <li>
        <router-link to="/vista-productos"
          class="block px-4 py-2 rounded-md bg-blue-500  hover:bg-blue-400 transition duration-200">
          Ver Productos
        </router-link>
      </li>
      <li>
        <router-link to="/vista-empleados"
          class="block px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-400 transition duration-200">
          Crea Empleado
        </router-link>
      </li>
      <li>
        <router-link to="/vista-clientes"
          class="block px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-400 transition duration-200">
          Clientes
        </router-link>
      </li>
      <li>
        <router-link to="/vista-pedidos"
          class="block px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-400 transition duration-200">
          Pedidos
        </router-link>
      </li>
      <li>
        <router-link to="/vista-accion-empleados"
          class="block px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-400 transition duration-200">
          Acciones Empleados
        </router-link>
      </li>
      <li>
        <router-link to="/vista-estadisticas"
          class="block px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-400 transition duration-200">
          Estadisticas
        </router-link>
      </li>
    </ul>
  </div>
</template>