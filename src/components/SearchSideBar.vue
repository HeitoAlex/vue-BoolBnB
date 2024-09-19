<template>
    <div class="search-sidebar">
      <h3>Filtra la Ricerca</h3>
      <form @submit.prevent="search">
        <div>
          <label for="location">Località:</label>
          <input type="text" v-model="filters.location" id="location">
        </div>
        <div>
          <label for="radius">Raggio (km):</label>
          <input type="number" v-model="filters.radius" id="radius" min="1">
        </div>
        <div>
          <label for="rooms_num">Numero minimo di stanze:</label>
          <input type="number" v-model="filters.rooms_num" id="rooms_num" min="1">
        </div>
        <div>
          <label for="beds_num">Numero minimo di posti letto:</label>
          <input type="number" v-model="filters.beds_num" id="beds_num" min="1">
        </div>
        <div>
          <label>Servizi aggiuntivi:</label>
          <div v-for="service in services" :key="service.id">
            <input type="checkbox" :value="service.id" v-model="filters.services">
            <label>{{ service.name }}</label>
          </div>
        </div>
        <button type="submit">Cerca</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        filters: {
          location: '',
          radius: 20,
          rooms_num: '',
          beds_num: '',
          services: [],
        },
        services: [],
      };
    },
    methods: {
      search() {
        this.$emit('search', this.filters);
      },
      fetchServices() {
        axios
          .get('http://127.0.0.1:8000/api/services')
          .then((response) => {
            this.services = response.data.results;
          })
          .catch((error) => {
            console.error('Errore nel recupero dei servizi:', error);
          });
      },
    },
    created() {
      this.fetchServices();
    },
  };
  </script>
  
  <style scoped>
  .search-sidebar {
    background-color: #f9f9f9;
    padding: 20px;
  }
  
  .search-sidebar h3 {
    margin-bottom: 20px;
  }
  
  .search-sidebar form div {
    margin-bottom: 15px;
  }
  
  .search-sidebar label {
    display: block;
    margin-bottom: 5px;
  }
  
  .search-sidebar input[type="text"],
  .search-sidebar input[type="number"] {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  .search-sidebar button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .search-sidebar button:hover {
    background-color: #0056b3;
  }
  </style>
  