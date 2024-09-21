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

    <!-- Lista degli appartamenti filtrati -->
      <!-- Lista degli appartamenti filtrati -->
  <transition-group name="fade" tag="div" class="apartments-grid">
    <div
      class="apartment-card"
      v-for="(apartment, index) in apartments"
      :key="apartment.id"
      :style="{ animationDelay: (index * 0.1) + 's' }"
    >
      <div class="card-image">
        <img :src="getFullImageUrl(apartment.images)" alt="Immagine dell'appartamento">
        <span v-if="apartment.sponsors && apartment.sponsors.length > 0" class="sponsored-label">
          <i class="fas fa-star"></i> SPONSORIZZATO
        </span>
      </div>
      <div class="card-body">
        <h5 class="card-title">{{ apartment.title }}</h5>
        <p class="card-text">
          <i class="fas fa-map-marker-alt icon"></i> {{ apartment.address }}
        </p>
        <p class="card-text">
          <i class="fas fa-door-open icon"></i> Stanze: {{ apartment.rooms_num }}
        </p>
        <p class="card-text">
          <i class="fas fa-bed icon"></i> Letti: {{ apartment.beds_num }}
        </p>
        <p class="card-text">
          <i class="fas fa-bath icon"></i> Bagni: {{ apartment.bathroom_num }}
        </p>
        <p class="card-text">
          <i class="fas fa-ruler-combined icon"></i> Superficie: {{ apartment.sq_mt }} mq
        </p>

        <!-- Pulsante per leggere di più -->
        <router-link 
          :to="{ name: 'apartment', params: { id: apartment.id } }" 
          class="btn-primary">
          Leggi di più <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
    </div>
  </transition-group>
  </div>
</template>


<style>
:root {
  --light-pink: #f5c1d1;
  --dark-pink: #f29aac;
  --midnight-blue: #002b5e;
  --dark-midnight-blue: #001c40;
  --smoke-gray: #f0f0f0;
  --text-gray: #555;
}

.container {
  padding: 20px;
}

/* Barra di ricerca */
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  flex-wrap: wrap;
  gap: 10px;
}

.search-input {
  position: relative;
}

.search-input input {
  padding: 10px 40px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: var(--smoke-gray);
  color: #333;
}

.search-input i {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--midnight-blue);
}

.search-button {
  padding: 12px 20px;
  background-color: var(--midnight-blue);
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: var(--dark-midnight-blue);
}

/* Lista dei suggerimenti */
.suggestions-list {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background-color: #fff;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions-list li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.suggestions-list li:hover {
  background-color: var(--light-pink);
}

/* Grid degli appartamenti */
.apartments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* Card degli appartamenti */
.apartment-card {
  background-color: var(--smoke-gray);
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
  animation: fadeIn 0.5s ease-in-out forwards;
}

.apartment-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
}

.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.apartment-card:hover .card-image img {
  transform: scale(1.1);
}


.sponsored-label {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: var(--dark-pink);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  animation: slideIn 0.5s ease forwards;
}


.sponsored-label i {
  margin-right: 5px;
  color: gold;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 1.5em;
  padding-left: 1rem;
  color: var(--midnight-blue);
  margin-bottom: 10px;
}

.card-text {
  color: var(--text-gray);
  margin: 5px 0;
  padding-left: 1rem;
  display: flex;
  align-items: center;
}


.card-text .icon {
  color: var(--dark-pink);
  margin-right: 10px;
  transition: color 0.3s;
}

.card-text .icon:hover {
  color: var(--midnight-blue);
}

.btn-primary {
  margin-top: auto;
  background-color: var(--dark-midnight-blue);
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: var(--midnight-blue);
}

.btn-primary i {
  margin-left: 5px;
}

/* Animazioni */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
