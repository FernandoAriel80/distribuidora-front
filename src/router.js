
import { createRouter, createWebHistory } from 'vue-router';
import { TOKEN } from './config';
import Home from './views/Home.vue';
import Register from './views/Auth/Register.vue';
import Login from './views/Auth/Login.vue';
import Menu from './views/admin/Menu.vue';
import ProductIndex from './views/admin/products/Index.vue';
import EmployeeIndex from './views/admin/employees/Index.vue';
import Cart from './views/cart/Cart.vue';
import PaymentMethod from './views/cart/PaymentMethod.vue';
import PaymentInStore from './views/cart/components/PaymentInStore.vue';
import Order from './views/admin/customers/Order.vue';
import PaymentProcessing from './views/cart/PaymentProcessing.vue';
import ProfileView from './views/porfile.vue/ProfileView.vue';
import ClientsListView from './views/admin/customers/ClientsListView.vue';
import DashboardView from './views/admin/dashboard/DashboardView.vue';
import ActionLogs from './views/admin/dashboard/ActionLogs.vue';
import CategoryView from './views/CategoryView.vue';
import ProductView from './views/ProductView.vue';
import productAllView from './views/productAllView.vue';
import { useAuth } from './composables/UserAuth';

const { user, fetchUser } = useAuth();

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/registar', name: 'register', component: Register },
    { path: '/inicia-sesion', name: 'login', component: Login },
    { path: '/vista-productos-categoria', name: 'category-view', component: CategoryView },
    { path: '/vista-producto', name: 'product-one-index', component: ProductView },
    { path: '/vista-todos-productos', name: 'product-all-index', component: productAllView },
    { path: '/carrito', name: 'cart', component: Cart,meta: { requiresAuth: true}},
    { path: '/perfil', name: 'profile', component: ProfileView,meta: { requiresAuth: true}},
    { path: '/metodo-pago', name: 'pay-method', component: PaymentMethod,meta: { requiresAuth: true}},
    { path: '/pago-presencial', name: 'pay-store', component: PaymentInStore,meta: { requiresAuth: true}},
    { path: '/pago-en-proceso', name: 'pay-process', component: PaymentProcessing,meta: { requiresAuth: true}},
    { path: '/menu', name: 'menu', component: Menu, meta: { requiresAuth: true, requiredRoles: ['admin', 'super_admin'] } },
    { path: '/vista-productos', name: 'product-index', component: ProductIndex, meta: { requiresAuth: true, requiredRoles: ['admin', 'super_admin'] }},
    { path: '/vista-pedidos', name: 'costumers-order', component: Order, meta: { requiresAuth: true, requiredRoles: ['admin', 'super_admin'] }},
    { path: '/vista-clientes', name: 'costumers-index', component: ClientsListView, meta: { requiresAuth: true, requiredRoles: ['admin', 'super_admin'] }},
    { path: '/vista-empleados', name: 'employee-index', component: EmployeeIndex, meta: { requiresAuth: true, requiredRoles: ['super_admin'] }},
    { path: '/vista-estadisticas', name: 'dashboard-index', component: DashboardView, meta: { requiresAuth: true, requiredRoles: ['super_admin'] }},
    { path: '/vista-accion-empleados', name: 'Action-index', component: ActionLogs, meta: { requiresAuth: true, requiredRoles: ['super_admin'] }},

    
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

