
import { createRouter, createWebHistory } from 'vue-router';
import { TOKEN } from './config';
import Home from './views/Home.vue';
import Register from './views/Auth/Register.vue';
import Login from './views/Auth/Login.vue';
import Menu from './views/admin/Menu.vue';
import ProductIndex from './views/admin/products/Index.vue';
import EmployeeIndex from './views/admin/employees/Index.vue';
import Cart from './views/cart/Cart.vue';
import PaymentViewOnline from './views/cart/PaymentViewOnline.vue';
import PaymentViewInStore from './views/cart/PaymentViewInStore.vue';
import Order from './views/admin/customers/Order.vue';
import PaymentProcessing from './views/cart/PaymentProcessing.vue';
import { useAuth } from './composables/UserAuth';

const { user, fetchUser } = useAuth();

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/menu', name: 'menu', component: Menu, meta: { requiresAuth: true, requiredRoles: ['admin', 'super_admin'] } },
    { path: '/registar', name: 'register', component: Register },
    { path: '/inicia-sesion', name: 'login', component: Login },
    { path: '/carrito', name: 'cart', component: Cart,meta: { requiresAuth: true}},
    { path: '/pago-online', name: 'pay-online', component: PaymentViewOnline,meta: { requiresAuth: true}},
    { path: '/pago-presencial', name: 'pay-store', component: PaymentViewInStore,meta: { requiresAuth: true}},
    { path: '/pago-en-proceso', name: 'pay-process', component: PaymentProcessing,meta: { requiresAuth: true}},
    { path: '/vista-productos', name: 'product-index', component: ProductIndex, meta: { requiresAuth: true, requiredRoles: ['admin', 'super_admin'] }},
    { path: '/vista-empleados', name: 'employee-index', component: EmployeeIndex, meta: { requiresAuth: true, requiredRoles: ['super_admin'] }},
    { path: '/vista-pedidos', name: 'costumers-order', component: Order, meta: { requiresAuth: true, requiredRoles: ['admin', 'super_admin'] }},
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {

    if (user.value == null) {
        await fetchUser();
    }
    
    const isAuthenticated = localStorage.getItem(TOKEN) !== null;
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

