<script>
    import SingleApartment from './SingleApartment.vue';
    import axios from 'axios';
    
    export default {
        components:{
            SingleApartment
        },

        data(){
            return{
                apartments: [],
            }
        },

        methods:{
            getApartments(){
                axios.get('http://127.0.0.1:8000/api/apartments', {
                    params: {
                    
                    }
                })
                .then((response) => {
                    console.log(response.data.results);
                    this.apartments = response.data.results;
                })
                .catch(function (error) {
                    console.log(error);
                })
                
            }
        },

        created(){
            this.getApartments();
        }
    }
</script>

<template>
    <div class="container">
        <div class="project-list">
            <router-link v-for="apartment in apartments" :to="{ name: 'apartment' , params:{ id: apartment.id } } ">
                <SingleApartment v-if="apartment.visibility === 1" :title="apartment.title" :rooms_num="apartment.rooms_num" :beds_num="apartment.beds_num" :bathroom_num="apartment.bathroom_num" :sq_mt="apartment.sq_mt" :address="apartment.address" :images="apartment.images"/>
            </router-link>
        </div>
    </div>
</template>

<style >

    .container{
        width: 1000px;
    }

    .project-list{
        margin-top: 3rem;
        display: flex;
        flex-wrap: wrap;
    }
</style>


        <!-- 'title',
        'rooms_num',
        'beds_num',
        'bathroom_num',
        'sq_mt',
        'address',
        'images',
        'visibility' -->
