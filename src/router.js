// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../src/views/Home.vue';
//import Login from '../views/Login.vue';
//import Cart from '../views/Cart.vue';
//import Admin from '../views/Admin.vue';

const routes = [
    { path: '/', name: 'home', component: Home },
    //{ path: '/login', name: 'login', component: Login },
    //{ path: '/cart', name: 'cart', component: Cart },
    //{ path: '/admin', name: 'admin', component: Admin }
    // Agrega más rutas según tus necesidades
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
