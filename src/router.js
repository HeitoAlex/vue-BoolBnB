
import { createRouter, createWebHistory } from "vue-router";

import AppHome from "./pages/AppHome.vue";
import AppProject from "./pages/AppProject.vue";
import AppContacts from "./pages/AppContacts.vue";

const router = createRouter({
    
    history: createWebHistory(),
    routes: [
        {
            path: '/home',
            name: 'home',
            component: AppHome
        },
        {
            path: '/project/:id',
            name: 'project',
            component: AppProject
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: AppContacts
        }
    ]
});

export { router };