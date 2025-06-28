import { createRouter, createWebHistory } from 'vue-router';

// Import all the routes
import Main from '@/modules/Main/Main.vue';
import Signin from '@/modules/Auth/components/SignIn.vue';
import Signup from '@/modules/Auth/components/SignUp.vue';
import createGuide from '@/modules/Guides/components/createGuide.vue';
import viewGuide from '@/modules/Guides/components/viewGuide.vue';
import allGuides from '@/modules/Guides/components/allGuides.vue';
import editGuide from '@/modules/Guides/components/editGuide.vue';

const routes = [
    { path: '/', component: Main },
    { path: '/login', component: Signin },
    { path: '/register', component: Signup },
    { path: '/create', component: createGuide },
    { path: '/guide/:slug', component: viewGuide },
    { path: '/allGuides', component: allGuides },
    { path: '/edit/:id', component: editGuide },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;