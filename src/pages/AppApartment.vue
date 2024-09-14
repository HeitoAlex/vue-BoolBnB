<script>
    import SingleApartment from '../components/SingleApartment.vue';
    import axios from 'axios';
    
    export default {
        components:{
            SingleApartment
        },

        data(){
            return{
                apartment: null,
            }
        },

        methods:{
            getApartment(id){
                axios.get(`http://127.0.0.1:8000/api/apartments/${id}`, {
                    params: {
                    
                    }
                })
                .then((response) => {
                    console.log(response.data.results);
                    this.project = response.data.results;
                })
                .catch(function (error) {
                    console.log(error);
                })
                
            }
        },

        created(){
            this.getApartment( this.$route.params.id );
        }
    }
</script>

<template>
    <div class="container">
        <div class="apartment-list">
            <SingleApartment v-if=" apartment != null " :title="apartment.title" :rooms_num="apartment.rooms_num" :beds_num="apartment.beds_num" :bathroom_num="apartment.bathroom_num" :sq_mt="apartment.sq_mt" :address="apartment.address" :images="apartment.images" :visibility="apartment.visibility"/>
        </div>
    </div>
</template>

<style scoped>

</style>