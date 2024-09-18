<script>
import ApartmentList from '../components/ApartmentList.vue';
import SearchComponent from '../components/SearchComponent.vue';


    export default {

        components:{
            SearchComponent,
            ApartmentList,
        },


        data(){
            return{
                
            }
        }
    }
</script>

<template>
    
        <SearchComponent />
        <ApartmentList />
    
</template>

<style scoped>
    body{
        margin-top: 3rem;
    }
</style>