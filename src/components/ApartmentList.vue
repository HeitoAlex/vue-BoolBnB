<script>
import SingleApartment from './SingleApartment.vue';
import axios from 'axios';

export default {
  components: {
    SingleApartment,
  },
  data() {
    return {
      apartments: [],  // Lista di appartamenti
      searchLocation: '',  // Località di ricerca inserita dall'utente
      searchRadius: 20,    // Raggio di ricerca predefinito in km
      suggestions: [],     // Suggerimenti di città
      showSuggestions: false,  // Controlla se mostrare i suggerimenti
      debounceTimeout: null,   // Timeout per debounce
      baseUrl: 'http://localhost:8000/storage/' // URL base per il percorso delle immagini
    };
  },
  methods: {
    getApartments() {
      // Effettua la chiamata al backend con i parametri di ricerca
      axios
        .get('http://127.0.0.1:8000/api/search', {
          params: {
            location: this.searchLocation,  // Parametro località
            radius: this.searchRadius,      // Parametro raggio in km
          },
        })
        .then((response) => {
          this.apartments = response.data.results;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // Funzione debounce per limitare la frequenza delle chiamate API
    debounceSearchLocation() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout); // Cancella il precedente timeout

      if (this.searchLocation.length > 2) {
        this.debounceTimeout = setTimeout(() => {
          this.getCitySuggestions(); // Ottieni suggerimenti dalle città
          this.getApartments(); // Effettua la ricerca degli appartamenti
        }, 300); // Ritardo di 300ms
      } else {
        this.suggestions = []; // Svuota i suggerimenti se ci sono meno di 3 caratteri
        this.showSuggestions = false;
      }
    },

    // Funzione per ottenere i suggerimenti dalla API TomTom
    getCitySuggestions() {
      const apiKey = 'S14VN8AzM8BoQ73JkRu5N2PqtkZtrrjN'; // Inserisci qui la tua chiave API di TomTom
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

    // Seleziona un suggerimento e lo applica al campo di ricerca
    selectSuggestion(suggestion) {
      this.searchLocation = suggestion;
      this.suggestions = [];
      this.showSuggestions = false;
      this.getApartments();  // Esegui la ricerca degli appartamenti
    },

    hideSuggestions() {
      // Funzione per nascondere i suggerimenti quando l'input perde il focus
      this.showSuggestions = false;
    },

    // Funzione per ottenere l'URL completo dell'immagine
    getFullImageUrl(imagePath) {
      if (!imagePath) return ''; // Se non c'è immagine, restituisci una stringa vuota
      return this.baseUrl + imagePath; // Concatena l'URL di base con il percorso dell'immagine
    }
  },
  created() {
    // Ottiene gli appartamenti quando il componente è montato
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
  margin-top: 2rem; 
  display: flex;
  gap: 10px; 
  justify-content: space-between; 
  align-items: center; 
  padding: 1rem;
  background-color: #003f6c; 
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
  margin-top: 5rem;
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