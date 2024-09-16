
import { createRouter, createWebHistory } from "vue-router";

import AppHome from "./pages/AppHome.vue";
import AppApartment from "./pages/AppApartment.vue";
import AppContacts from "./pages/AppContacts.vue";

const router = createRouter({
    
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: AppHome
        },
        {
            path: '/apartment/:id',
            name: 'apartment',
            component: AppApartment
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: AppContacts
        }
    ]
});

export { router };