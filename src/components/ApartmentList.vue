<script>
    import SingleApartment from './SingleApartment.vue';
    import axios from 'axios';
    
    export default {
        components: {
            SingleApartment
        },

        data() {
            return {
                apartments: [],
            }
        },

        methods: {
            getApartments() {
                axios.get('http://127.0.0.1:8000/api/apartments')
                .then((response) => {
                    console.log(response.data.results);
                    this.apartments = response.data.results;
                })
                .catch(function (error) {
                    console.log(error);
                })
            }
        },

        created() {
            this.getApartments();
        }
    }
</script>


<template>
    <div class="container">
        <div class="project-list">
            <router-link v-for="apartment in apartments" :key="apartment.id" :to="{ name: 'apartment', params: { id: apartment.id } }" class="card-link">
                <div class="card" v-if="apartment.visibility === 1">
                    <img :src="apartment.images[0]" alt="Apartment Image" class="card-image"/>
                    <div class="card-content">
                        <h3>{{ apartment.title }}</h3>
                        <div class="details">
                            <p>Rooms: {{ apartment.rooms_num }}</p>
                            <p>Beds: {{ apartment.beds_num }}</p>
                            <p>Bathrooms: {{ apartment.bathroom_num }}</p>
                            <p>Size: {{ apartment.sq_mt }} sqm</p>
                            <p>{{ apartment.address }}</p>
                        </div>
                        <router-link :to="{ name: 'apartment', params: { id: apartment.id } }" class="details-button">View Details</router-link>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>






<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.project-list {
    margin-top: 3rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.card-link {
    text-decoration: none;
    color: inherit;
}

.card {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    display: flex;
    flex-direction: column;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.card-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
}

.card-content h3 {
    margin: 0 0 10px;
    font-size: 1.5rem;
    color: #333;
}

.details {
    margin-top: 10px;
    font-size: 0.875rem;
    color: #666;
    line-height: 1.5;
}

.details-button {
    display: inline-block;
    margin-top: 15px;
    padding: 8px 16px;
    background-color: #003f6c;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    transition: background-color 0.3s;
}

.details-button:hover {
    background-color: #005c9c;
    color: #ffffff;
}

@media (max-width: 768px) {
    .card-image {
        height: 150px;
    }

    .card-content h3 {
        font-size: 1.2rem;
    }

    .details {
        font-size: 0.8rem;
    }
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
