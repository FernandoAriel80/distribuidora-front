<script setup>
const props = defineProps({
    message: String
});
</script>
<template>
    <div v-if="props.message">
        <div
            class="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white w-80 text-center px-4 py-2 rounded shadow-md transition-opacity duration-500">
            {{ props.message }}
        </div>
    </div>
</template>