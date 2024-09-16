<script>

    import ApartmentList from '../components/ApartmentList.vue';
    import HeaderMain from '../components/HeaderMain.vue';
    import FooterMain from '../components/FooterMain.vue';

    export default {

        components:{
            ApartmentList,
            HeaderMain,
            FooterMain
        },

        data(){
            return{
                
            }
        }
    }
</script>

<template>
    <HeaderMain />
    <ApartmentList/>
    <FooterMain />
</template>

<style scoped>

</style>