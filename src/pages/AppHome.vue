<script>
    // import SearchComponent from '@/components/SearchComponent.vue';
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
            };
        }
    }
</script>

<template>
    <Jumbo /> 
    <SearchComponent />
    <ApartmentList /> 
</template>

<style scoped>
</style>
