<script>
    import HeaderMain from '../components/HeaderMain.vue';
    import FooterMain from '../components/FooterMain.vue'
    import ProjectList from '../components/ProjectList.vue';

    export default {

        components:{
            ProjectList,
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
    <HeaderMain /> <!-- Testing -->
    <ProjectList/>
    <FooterMain />
</template>

<style scoped>

</style>