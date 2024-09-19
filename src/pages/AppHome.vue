<script>
    import SearchComponent from '@/components/SearchComponent.vue';
    import ApartmentList from '../components/ApartmentList.vue';
    import Jumbo from '../components/Jumbo.vue';

    export default {
        components: {
            ApartmentList,
            Jumbo,
            SearchComponent,
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
    <SearchComponent @search="updateFilters" />
    <ApartmentList :filters="filters" /> 
</template>

<style scoped>


</style>
