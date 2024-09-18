
import { createRouter, createWebHistory } from "vue-router";

import AppHome from "./pages/AppHome.vue";
import AppApartment from "./pages/AppApartment.vue";
import AppContacts from "./pages/AppContacts.vue";
import FormInfo from "./pages/FormInfo.vue";
import AdvancedSearch from "./pages/AdvancedSearch.vue";

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
        },
        {
            path: '/AdvancedSearch',
            name: 'advanced search',
            component: AdvancedSearch
        },
        {
            path: '/info/:id', // La rotta con l'ID dell'appartamento
            name: 'formInfo',
            component: FormInfo
          },
    ]
});

export { router };