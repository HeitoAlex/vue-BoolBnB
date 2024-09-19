<script>
import axios from 'axios';

export default {
  name: 'SearchComponent',
  data() {
    return {
      filters: {
      location: '',
      radius: 20,
      rooms: '',
      beds: '',
      extra_services: [],
    },

      apartments: [],
      services: [],
      errorMessage: '',
    };
  },
  methods: {

    searchApartments() {
    // Emette l'evento 'search' con i filtri
    this.$emit('search', { ...this.filters });
  },
  
    async searchApartments() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/search', {
        params: this.filters,
        });

        this.apartments = response.data.results;
        this.errorMessage = '';
      } catch (error) {
        this.apartments = [];
        this.errorMessage = error.response?.data?.message || 'Si è verificato un errore durante la ricerca.';
      }
    },
    async fetchServices() {
      try {
        const response = await axios.get('/api/services');
        this.services = response.data.results;
      } catch (error) {
        console.error('Errore nel recupero dei servizi:', error);
      }
    },
  },
  created() {
    this.fetchServices();
  },
};
</script>

<template>
  <div class="sidebar">
    <form @submit.prevent="searchApartments" class="search-form">
      <h2>Filtri di ricerca</h2>
      <div class="form-group">
        <label for="location">Località:</label>
        <input type="text" v-model="filters.location" id="location" required class="form-input">
      </div>
      <div class="form-group">
        <label for="radius">Raggio (km):</label>
        <input type="number" v-model="filters.radius" id="radius" min="1" class="form-input">
      </div>
      <div class="form-group">
        <label for="rooms_num">Numero minimo di stanze:</label>
        <input type="number" v-model="filters.rooms" id="rooms" min="1" class="form-input">
      </div>
      <div class="form-group">
        <label for="beds_num">Numero minimo di posti letto:</label>
        <input type="number" v-model="filters.beds" id="beds" min="1" class="form-input">
      </div>
      <div class="form-group">
        <label>Servizi aggiuntivi:</label>
        <div class="services-list">
          <div v-for="service in services" :key="service.id" class="service-item">
            <input type="checkbox" :value="service.id" v-model="filters.extra_services">
            <label>{{ service.name }}</label>
          </div>
        </div>
      </div>
      <button type="submit" class="submit-button">Cerca</button>
    </form>

    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-if="apartments.length" class="results">
      <h2>Risultati della ricerca:</h2>
      <div v-for="apartment in apartments" :key="apartment.id" class="apartment-item">
        <h3>{{ apartment.title }}</h3>
        <p>{{ apartment.address }}</p>
        <p>Stanze: {{ apartment.rooms_num }}, Letti: {{ apartment.beds_num }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 300px; 
  background-color: #003f6c; 
  color: white; 
  padding: 20px; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
  position: fixed; 
  height: 100%; 
  overflow-y: auto;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 1rem; 
}

.form-group {
  display: flex;
  flex-direction: column; 
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #007bff; 
}

.services-list {
  display: flex;
  flex-direction: column;
}

.service-item {
  display: flex;
  align-items: center; 
  color: white; 
}

.submit-button {
  padding: 0.75rem 1.5rem; 
  background-color: #007bff; 
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #ff0000;
  margin-top: 20px;
}

.results {
  margin-top: 20px;
}

.apartment-item {
  margin-bottom: 1rem;
}
</style>
