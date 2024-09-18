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
            loading: true,
            error: null,
        }
    },

    methods: {
        getApartment(id) {
            this.loading = true; 
            axios.get(`http://127.0.0.1:8000/api/apartments/${id}`)
                .then((response) => {
                    this.apartment = response.data.result;
                })
                .catch((error) => {
                    this.error = 'Errore nel caricamento dell\'appartamento.';
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
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
            <div v-if="loading" class="loading-message">Caricamento in corso...</div>
            <div v-if="error" class="error-message">{{ error }}</div>
            <transition name="fade">
                <SingleApartment v-if="apartment" 
                    :title="apartment.title" 
                    :rooms_num="apartment.rooms_num" 
                    :beds_num="apartment.beds_num" 
                    :bathroom_num="apartment.bathroom_num" 
                    :sq_mt="apartment.sq_mt" 
                    :address="apartment.address" 
                    :images="apartment.images" />
            </transition>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 20px; 
}

.apartment-list {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.loading-message {
    font-size: 1.5rem;
    color: #007bff;
    margin-top: 20px;
}

.error-message {
    font-size: 1.5rem;
    color: #ff0000; 
    margin-top: 20px;
}

/* Animazione per il caricamento */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

/* Stile della card */
.card {
    width: 100%;
    max-width: 800px;
    border: none;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); 
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.card-img-top {
    width: 100%; 
    height: auto;
    object-fit: cover; 
}

.card-body {
    padding: 20px;
    text-align: left;
}

.card-header {
    background-color: #003f6c; 
    color: white;
    font-weight: bold;
    text-align: center;
    padding: 15px;
    border-bottom: none; 
    font-size: 1.5rem;
    border-radius: 12px 12px 0 0;
}

.details {
    margin: 10px 0; 
}

.card-text {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #555;
}

.info-button {
    display: inline-block;
    margin-top: 10px;
    padding: 10px 20px; 
    background-color: #007bff; 
    color: white;
    border-radius: 5px;
    text-decoration: none; 
    text-align: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.info-button:hover {
    background-color: #0056b3; 
    transform: translateY(-2px); 
}
</style>
