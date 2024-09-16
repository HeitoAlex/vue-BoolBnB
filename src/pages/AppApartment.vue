<script>
import SingleApartment from '../components/SingleApartment.vue';
import axios from 'axios';

export default {
    components: {
        SingleApartment
    },

    data() {
        return {
            apartment: null,
        }
    },

    methods: {
        getApartment(id) {
            axios.get(`http://127.0.0.1:8000/api/apartments/${id}`)
                .then((response) => {
                    console.log(response.data.result); // Controlla il risultato
                    this.apartment = response.data.result; // Usa `result` per accedere ai dati dell'appartamento
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    },

    created() {
        this.getApartment(this.$route.params.id);
    }
}
</script>

<template>
    <div class="container">
        <div class="apartment-list">
            <SingleApartment v-if="apartment" :title="apartment.title" :rooms_num="apartment.rooms_num"
                :beds_num="apartment.beds_num" :bathroom_num="apartment.bathroom_num" :sq_mt="apartment.sq_mt"
                :address="apartment.address" :images="apartment.images" :visibility="apartment.visibility" />
        </div>
    </div>
</template>

<style scoped></style>
