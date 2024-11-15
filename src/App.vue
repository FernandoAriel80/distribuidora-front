<script setup>
import Layout from './layout/Layout.vue';
import { useAuth } from './composables/UserAuth';
const { user,fetchUser } = useAuth();
fetchUser();
</script>

<template>
  <div id="app">
      <Layout :user="user"/>
      <router-view></router-view>
  </div>
</template>

