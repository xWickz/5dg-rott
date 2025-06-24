import { createRouter, createWebHistory } from 'vue-router';

// Import all the routes
import Main from '../modules/Main/Main.vue';
import Signin from '../modules/Auth/components/SignIn.vue';
import Signup from '../modules/Auth/components/SignUp.vue';
import createGuide from '../modules/Guides/createGuide.vue';
import viewGuide from '../modules/Guides/viewGuide.vue';
import allGuides from '../modules/Guides/allGuides.vue';

const routes = [
    { path: '/', component: Main },
    { path: '/login', component: Signin },
    { path: '/register', component: Signup },
    { path: '/create', component: createGuide },
    { path: '/viewGuide/:id', component: viewGuide },
    { path: '/allGuides', component: allGuides },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;