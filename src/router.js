
import { createRouter, createWebHistory } from "vue-router";

import AppHome from "./pages/AppHome.vue";
import AppApartment from "./pages/AppApartment.vue";
import AppContacts from "./pages/AppContacts.vue";
import FormInfo from "./pages/FormInfo.vue";

const router = createRouter({
    
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: AppHome
        },
        {
            path: '/Chi-siamo',
            name: 'chi siamo',
            component: AppHome
        },
        {
            path: '/apartment/:id',
            name: 'apartment',
            component: AppApartment
        },
        {
            path: '/contatti',
            name: 'contatti',
            component: AppContacts
        },
        {
            path: '/info',
            name: 'info',
            component: FormInfo
        }
    ]
});

export { router };