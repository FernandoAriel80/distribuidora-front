<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
  fetchPage: {
    type: Function,
    required: true,
  },
});
</script>


<template>
    <div v-if="pagination" class="flex justify-center mt-4">
      <div class="flex flex-wrap -mb-1">
        <button
          @click="fetchPage(pagination.prev_page_url)"
          :disabled="!pagination.prev_page_url"
          class="mr-1 mb-1 px-4 py-2 text-sm leading-4 text-gray-600 border rounded-md 
                 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400
                 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        <span class="mr-1 mb-1 px-4 py-2 text-sm leading-4 text-gray-600 border rounded-md">
          Página {{ pagination.current_page }} de {{ pagination.last_page }}
        </span>

        <button
          @click="fetchPage(pagination.next_page_url)"
          :disabled="!pagination.next_page_url"
          class="mr-1 mb-1 px-4 py-2 text-sm leading-4 text-gray-600 border rounded-md 
                 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400
                 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  </template>
  
