<script setup>
defineProps({
    name: {
        type: String,
        required: true,
    },
    progress: {
        type: Boolean,
       // required: true,
    },
});
</script>

<template>
    <button
        class="primary-btn flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 
        text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline 
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 
        disabled:bg-gray-400 disabled:cursor-not-allowed"
        :disabled="progress">{{ name }}</button>
</template>