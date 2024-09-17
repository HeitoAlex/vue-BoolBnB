<script>
    import ApartmentList from '../components/ApartmentList.vue';
    import Jumbo from '../components/Jumbo.vue';

    export default {
        components: {
            ApartmentList,
            Jumbo 
        },
        data() {
            return {
            };
        }
    }
</script>

<template>
    <Jumbo /> 
    <ApartmentList /> 
</template>

<style scoped>
</style>
