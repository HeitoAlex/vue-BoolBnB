<script>
import SingleApartment from './SingleApartment.vue';
import axios from 'axios';

export default {
  components: {
    SingleApartment,
  },
  data() {
    return {
      apartments: [], 
      searchLocation: '',  
      searchRadius: 20,   
      suggestions: [],    
      showSuggestions: false,  
      debounceTimeout: null,   
      baseUrl: 'http://localhost:8000/storage/' // URL base per il percorso delle immagini
    };
  },
  methods: {
    getApartments() {
      if (this.searchLocation && this.searchLocation.length > 2) {
        // Se la location è specificata e ha più di 2 caratteri, effettua la ricerca
        axios
          .get('http://127.0.0.1:8000/api/search', {
            params: {
              location: this.searchLocation,
              radius: this.searchRadius,
            },
          })
          .then((response) => {
            this.apartments = response.data.results;
          })
          .catch((error) => {
            console.log(error);
            this.apartments = []; // Resetta la lista degli appartamenti in caso di errore
          });
      } else {
        // Se la location non è specificata, recupera tutti gli appartamenti
        axios
          .get('http://127.0.0.1:8000/api/apartments')
          .then((response) => {
            this.apartments = response.data.results;
          })
          .catch((error) => {
            console.log(error);
            this.apartments = []; // Resetta la lista degli appartamenti in caso di errore
          });
      }
    },

    debounceSearchLocation() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);

      if (this.searchLocation.length > 2) {
        this.debounceTimeout = setTimeout(() => {
          this.getCitySuggestions();
          this.getApartments();
        }, 300);
      } else {
        this.suggestions = [];
        this.showSuggestions = false;
      }
    },

    getCitySuggestions() {
      const apiKey = 'S14VN8AzM8BoQ73JkRu5N2PqtkZtrrjN';
      axios
        .get(`https://api.tomtom.com/search/2/search/${encodeURIComponent(this.searchLocation)}.json`, {
          params: {
            key: apiKey,
            language: 'it-IT',
            typeahead: true,
            limit: 5,
            entityType: 'Municipality',
          },
        })
        .then((response) => {
          if (response.data.results && response.data.results.length > 0) {
            this.suggestions = response.data.results
              .filter(item => item.address && item.address.freeformAddress)
              .map(item => item.address.freeformAddress);
            this.showSuggestions = true;
          } else {
            this.suggestions = [];
            this.showSuggestions = false;
          }
        })
        .catch((error) => {
          console.error('Errore nel fetch:', error);
        });
    },

    selectSuggestion(suggestion) {
      this.searchLocation = suggestion;
      this.suggestions = [];
      this.showSuggestions = false;
      this.getApartments();
    },

    hideSuggestions() {
      this.showSuggestions = false;
    },

    getFullImageUrl(imagePath) {
      if (!imagePath) return '';
      return this.baseUrl + imagePath;
    }
  },
  created() {
    this.getApartments();
  },
};
</script>

<template>
  <div class="container">
    <!-- Barra di ricerca -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchLocation"
        placeholder="Inserisci una località"
        @input="debounceSearchLocation" 
        @blur="hideSuggestions"          
      />
      <input
        type="number"
        v-model="searchRadius"
        placeholder="Raggio in km"
        @input="debounceSearchLocation" 
      />
      <button @click="getApartments">Cerca</button>

      <!-- Lista dei suggerimenti -->
      <ul v-if="showSuggestions && suggestions.length" class="suggestions-list">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>

    <!-- Lista degli appartamenti filtrati -->
    <div class="project-list">
      <router-link
        v-for="apartment in apartments"
        :key="apartment.id"
        :to="{ name: 'apartment', params: { id: apartment.id } }"
      >
        <SingleApartment v-if="apartment.visibility === 1"
          :title="apartment.title"
          :rooms_num="apartment.rooms_num"
          :beds_num="apartment.beds_num"
          :bathroom_num="apartment.bathroom_num"
          :sq_mt="apartment.sq_mt"
          :address="apartment.address"
          :images="apartment.images"
          :visibility="apartment.visibility"
        />
      </router-link>
    </div>
  </div>
</template>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto; 
  padding: 20px; 
}

.search-bar {
  margin-top: 5rem; 
  display: flex;
  gap: 10px; 
  justify-content: space-between; 
  align-items: center; 
  padding: 1rem;
  background-color: #003f6c; 
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
}

.search-bar input {
  padding: 0.75rem;
  font-size: 1rem;
  width: 300px; 
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); 
}

.search-bar button {
  padding: 0.75rem 1.5rem; 
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.project-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  gap: 20px; 
  margin-top: 2rem; 
}

.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin-top: 0.5rem;
  background-color: white;
  border: 1px solid #ccc;
  max-width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: absolute;
  z-index: 1000;
}

.suggestions-list li {
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}

/* responsive */
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar input,
  .search-bar button {
    width: 100%; 
    margin-bottom: 10px;
  }
}
</style>
