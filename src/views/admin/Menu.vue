<script setup>

</script>

<template>

  <Head title="Admin" />
  <div class="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-sm mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center">Menú Administrativo</h1>
    <ul class="space-y-4">
      <li>
        <router-link to = "/product-index" 
        class="block px-4 py-2 rounded-md bg-blue-500  hover:bg-blue-400 transition duration-200">        
            Ver Productos
        </router-link>
      </li>
      <li>
        <router-link to="/employee-index"
          class="block px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-400 transition duration-200">
        Crea Empleado
        </router-link>
      </li>
    </ul>
  </div>
</template>