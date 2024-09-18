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
    // Effettua la chiamata al backend con i parametri di ricerca
    getApartments() {
      axios
        .get('http://127.0.0.1:8000/api/search', {
          params: {
            location: this.searchLocation,  // Parametro località
            radius: this.searchRadius,      // Parametro raggio in km
          },
        })
        .then((response) => {
          this.apartments = response.data.results; // Assegna i risultati alla lista di appartamenti
        })
        .catch((error) => {
          console.log('Errore durante il fetch degli appartamenti:', error);
        });
    },

    // Funzione debounce per limitare la frequenza delle chiamate API
    debounceSearchLocation() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout); // Cancella il timeout precedente

      if (this.searchLocation.length > 2) { // Cerca solo se ci sono più di 2 caratteri
        this.debounceTimeout = setTimeout(() => {
          this.getCitySuggestions(); // Ottieni suggerimenti
          this.getApartments(); // Aggiorna la lista degli appartamenti
        }, 300); // Ritardo di 300ms per debounce
      } else {
        this.suggestions = []; // Cancella i suggerimenti se l'input è vuoto o con pochi caratteri
        this.showSuggestions = false;
      }
    },

    // Funzione per ottenere i suggerimenti dalla API TomTom
    getCitySuggestions() {
      const apiKey = 'S14VN8AzM8BoQ73JkRu5N2PqtkZtrrjN'; // Chiave API TomTom
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
            // Mappa i risultati sui suggerimenti
            this.suggestions = response.data.results
              .filter(item => item.address && item.address.freeformAddress)
              .map(item => item.address.freeformAddress);
            this.showSuggestions = true; // Mostra i suggerimenti
          } else {
            this.suggestions = []; // Cancella i suggerimenti se non ci sono risultati
            this.showSuggestions = false;
          }
        })
        .catch((error) => {
          console.error('Errore nel fetch dei suggerimenti:', error);
        });
    },

    // Seleziona un suggerimento e lo applica al campo di ricerca
    selectSuggestion(suggestion) {
      this.searchLocation = suggestion; // Aggiorna il campo di ricerca con il suggerimento selezionato
      this.suggestions = []; // Nascondi i suggerimenti
      this.showSuggestions = false;
      this.getApartments(); // Effettua la ricerca degli appartamenti
    },

    hideSuggestions() {
      this.showSuggestions = false; // Nascondi i suggerimenti quando l'input perde il focus
    },

    // Funzione per ottenere l'URL completo dell'immagine
    getFullImageUrl(imagePath) {
      if (!imagePath) return ''; // Se non c'è immagine, restituisci una stringa vuota
      return this.baseUrl + imagePath; // Concatena l'URL di base con il percorso dell'immagine
    }
  },

  // Monta gli appartamenti quando il componente viene creato
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
      <div>
        <a href="/AdvancedSearch">Cerca</a>
      </div>
    </div>

    <!-- Lista degli appartamenti filtrati -->
    <div class="row">
      <div class="col-md-4" v-for="apartment in apartments" :key="apartment.id">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">{{ apartment.title }}</h5>
            <p class="card-text">Indirizzo: {{ apartment.address }}</p>
            <p class="card-text">Stanze: {{ apartment.rooms_num }}</p>
            <p class="card-text">Letti: {{ apartment.beds_num }}</p>
            <p class="card-text">Bagni: {{ apartment.bathroom_num }}</p>
            <p class="card-text">Superficie: {{ apartment.sq_mt }} mq</p>

            <!-- Pulsante per leggere di più -->
            <router-link 
              :to="{ name: 'apartment', params: { id: apartment.id } }" 
              class="btn btn-primary">
              Leggi di più
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  width: 1000px;
  margin: 0 auto; /* Centra il contenuto */
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Spazio tra le card */
  margin-top: 3rem; /* Aggiunge margine sopra le card */
}

.card {
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.card-text {
  margin-bottom: 0.75rem;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
