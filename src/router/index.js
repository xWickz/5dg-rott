import { createRouter, createWebHistory } from 'vue-router';

// Import all the routes
import Main from '../modules/Main/Main.vue';
import Signin from '../modules/Auth/components/SignIn.vue';
import Signup from '../modules/Auth/components/SignUp.vue';

const routes = [
    { path: '/', component: Main },
    { path: '/login', component: Signin },
    { path: '/register', component: Signup }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;