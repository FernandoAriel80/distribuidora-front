// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Register from './views/Auth/Register.vue';
import Login from './views/Auth/Login.vue';
import Menu from './views/admin/Menu.vue';
import ProductIndex from './views/admin/products/Index.vue';
//import Cart from '../views/Cart.vue';
//import Admin from '../views/Admin.vue';

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/menu', name: 'menu', component: Menu },
    { path: '/register', name: 'register', component: Register },
    { path: '/login', name: 'login', component: Login },
    { path:'/product-index', name: 'product-index', component: ProductIndex },
    //{ path: '/cart', name: 'cart', component: Cart },
    //{ path: '/admin', name: 'admin', component: Admin }
    // Agrega más rutas según tus necesidades
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
