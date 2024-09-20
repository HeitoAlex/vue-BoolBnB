<script>
    import SearchComponent from '@/components/SearchComponent.vue';
    import ApartmentList from '../components/ApartmentList.vue';
    import Jumbo from '../components/Jumbo.vue';
    import BookingCallToAction from '../components/BookingCallToAction.vue';


    export default {
        components: {
            ApartmentList,
            Jumbo,
            SearchComponent,
            BookingCallToAction,
        },
    data() {
        return {
        filters: {},
        };
    },
    methods: {
        updateFilters(newFilters) {
        this.filters = { ...newFilters };
        },
    },
};
</script>

<template>
    <Jumbo /> 
    <BookingCallToAction /> <!-- Div che porta alla pagina di ricerca -> AdvancedSearch.vue -->
    <ApartmentList :filters="filters" /> 
</template>

<style scoped>


</style>
