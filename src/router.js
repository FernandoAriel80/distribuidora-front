
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Register from './views/Auth/Register.vue';
import Login from './views/Auth/Login.vue';
import Menu from './views/admin/Menu.vue';
import ProductIndex from './views/admin/products/Index.vue';
import EmployeeIndex from './views/admin/employees/Index.vue';
// import Cart from '../views/Cart.vue';
// import Admin from '../views/Admin.vue';
import { useAuth } from './composables/UserAuth';

const { user, fetchUser } = useAuth();

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/menu', name: 'menu', component: Menu, meta: { requiresAuth: true, requiredRoles: ['admin', 'super_admin'] } },
    { path: '/register', name: 'register', component: Register },
    { path: '/login', name: 'login', component: Login },
    { path: '/product-index', name: 'product-index', component: ProductIndex, meta: { requiresAuth: true, requiredRoles: ['admin', 'super_admin'] }},
    { path: '/employee-index', name: 'employee-index', component: EmployeeIndex, meta: { requiresAuth: true, requiredRoles: ['super_admin'] }},
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {

    if (user.value == null) {
        await fetchUser();
    }
    
    const isAuthenticated = localStorage.getItem('token') !== null;
    const userRole = user.value?.role;

    if (to.meta.requiresAuth) {
        
        if (!isAuthenticated) {
            return next({ name: 'login' });
        }
        const requiredRoles = to.meta.requiredRoles;
        if (requiredRoles && !requiredRoles.includes(userRole)) {
            return next({ name: 'home' });
        }
    }
    
    next(); 
});

export default router;

