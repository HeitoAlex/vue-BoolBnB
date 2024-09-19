<script>
import axios from 'axios';

export default {
    data() {
        return {
            apartments: [],             // Lista di appartamenti
            searchLocation: '',         // Località di ricerca inserita dall'utente
            searchRadius: '',           // Raggio di ricerca in km
            rooms: '',                  // Numero di stanze
            beds: '',                   // Numero di letti
            selectedExtraServices: [],  // IDs dei servizi extra selezionati
            allExtraServices: [],       // Tutti i servizi extra disponibili
            suggestions: [],            // Suggerimenti di città
            showSuggestions: false,     // Controlla se mostrare i suggerimenti
            debounceTimeout: null,      // Timeout per debounce
            baseUrl: 'http://localhost:8000/storage/' // URL base per il percorso delle immagini
        };
    },
    methods: {
        getApartments() {
            // Effettua la chiamata al backend con i parametri di ricerca
            axios
                .get('http://127.0.0.1:8000/api/search', {
                    params: {
                        location: this.searchLocation,
                        radius: this.searchRadius,
                        rooms: this.rooms,
                        beds: this.beds,
                        extra_services: this.selectedExtraServices,
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

            this.debounceTimeout = setTimeout(() => {
                if (this.searchLocation.length > 2) {
                    this.getCitySuggestions(); // Ottieni suggerimenti dalle città
                } else {
                    this.suggestions = []; // Svuota i suggerimenti se ci sono meno di 3 caratteri
                    this.showSuggestions = false;
                }
                this.getApartments(); // Effettua la ricerca degli appartamenti
            }, 300); // Ritardo di 300ms
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
        },

        // Funzione per ottenere tutti i servizi extra
        getAllExtraServices() {
            axios.get('http://127.0.0.1:8000/api/extra-services')
                .then(response => {
                    this.allExtraServices = response.data.results;
                })
                .catch(error => {
                    console.error('Errore nel fetch dei servizi extra:', error);
                });
        },
    },
    created() {
        // Ottiene i servizi extra e gli appartamenti quando il componente è montato
        this.getAllExtraServices();
        this.getApartments();
    },
}
</script>



<template>
    <div class="advanced-search-container">
      <div class="content-wrapper">
        <!-- Barra di ricerca a sinistra -->
        <div class="search-box">
          <h2 class="search-title">Trova il tuo appartamento ideale</h2>
          <div class="search-fields">
            <div class="search-field">
              <label for="searchLocation">In quale città?</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  v-model="searchLocation"
                  placeholder="Inserisci una località"
                  @input="debounceSearchLocation"
                  @focus="showSuggestions = true"
                  id="searchLocation"
                />
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <!-- Suggerimenti di città -->
              <ul v-if="showSuggestions && suggestions.length" class="suggestions-list">
                <li
                  v-for="suggestion in suggestions"
                  :key="suggestion"
                  @click="selectSuggestion(suggestion)"
                >
                  {{ suggestion }}
                </li>
              </ul>
            </div>
  
            <div class="search-field">
              <label for="rooms">Quante stanze?</label>
              <div class="input-wrapper">
                <input
                  type="number"
                  v-model.number="rooms"
                  name="rooms"
                  id="rooms"
                  @input="debounceSearchLocation"
                  min="0"
                />
                <i class="fas fa-door-open"></i>
              </div>
            </div>
  
            <div class="search-field">
              <label for="beds">Quanti letti?</label>
              <div class="input-wrapper">
                <input
                  type="number"
                  v-model.number="beds"
                  name="beds"
                  id="beds"
                  @input="debounceSearchLocation"
                  min="0"
                />
                <i class="fas fa-bed"></i>
              </div>
            </div>
  
            <div class="search-field">
              <label for="km">A che distanza dal centro?</label>
              <div class="input-wrapper">
                <input
                  type="number"
                  v-model.number="searchRadius"
                  placeholder="Raggio in km"
                  @input="debounceSearchLocation"
                  id="km"
                  min="0"
                />
                <i class="fas fa-location-arrow"></i>
              </div>
            </div>
          </div>
  
          <!-- Servizi extra -->
          <div class="extra-services">
            <label>Che servizi cerchi?</label>
            <div class="services-list">
              <div
                class="service-item"
                v-for="extra_service in allExtraServices"
                :key="extra_service.id"
              >
                <input
                  type="checkbox"
                  :value="extra_service.id"
                  v-model="selectedExtraServices"
                  @change="debounceSearchLocation"
                  :id="'service-' + extra_service.id"
                />
                <label :for="'service-' + extra_service.id">{{ extra_service.name }}</label>
              </div>
            </div>
          </div>
  
          <button class="search-button" @click="getApartments">Cerca</button>
        </div>
  
        <!-- Lista degli appartamenti a destra -->
        <div class="apartments-grid">
          <div
            v-for="(apartment, index) in apartments"
            :key="apartment.id"
            class="apartment-card"
            :style="{ animationDelay: (index * 0.1) + 's' }"
          >
            <div class="card-image">
              <img :src="getFullImageUrl(apartment.images)" alt="Immagine Appartamento" />
            </div>
            <div class="card-content">
              <h3>{{ apartment.title }}</h3>
              <p class="address"><i class="fas fa-map-marker-alt"></i> {{ apartment.address }}</p>
              <div class="details">
                <p><i class="fas fa-door-open"></i> Stanze: {{ apartment.rooms_num }}</p>
                <p><i class="fas fa-bed"></i> Letti: {{ apartment.beds_num }}</p>
                <p><i class="fas fa-bath"></i> Bagni: {{ apartment.bathroom_num }}</p>
              </div>
              <!-- Servizi extra dell'appartamento -->
              <div class="extra-services-list">
                <p>Servizi Extra:</p>
                <ul>
                  <li v-for="(service, index) in apartment.extra_services" :key="service.id">
                    {{ service.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Variabili di colore */
  :root {
    --light-pink: #f5c1d1;
    --dark-pink: #f29aac;
    --midnight-blue: #002b5e;
    --dark-midnight-blue: #001c40;
    --smoke-gray: #f0f0f0;
    --text-gray: #555;
  }
  
  /* Contenitore principale */
  .advanced-search-container {
    padding: 20px;
  }
  
  /* Wrapper per la barra di ricerca e gli appartamenti */
  .content-wrapper {
    display: flex;
  }
  
  /* Barra di ricerca a sinistra */
  .search-box {
    width: 300px;
    background-color: var(--smoke-gray);
    padding: 20px;
    border-radius: 8px;
    margin-right: 20px;
    animation: fadeInLeft 0.5s ease forwards;
  }
  
  .search-title {
    text-align: center;
    color: var(--midnight-blue);
    margin-bottom: 20px;
  }
  
  .search-fields {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .search-field {
    position: relative;
  }
  
  .input-wrapper {
    position: relative;
  }
  
  .input-wrapper input {
    width: 100%;
    padding: 10px 40px 10px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    color: #333;
  }
  
  .input-wrapper i {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--midnight-blue);
  }
  
  .extra-services {
    margin-top: 20px;
  }
  
  .extra-services label {
    display: block;
    font-weight: bold;
    margin-bottom: 10px;
    color: var(--midnight-blue);
  }
  
  .services-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .service-item {
    display: flex;
    align-items: center;
  }
  
  .service-item input {
    margin-right: 5px;
  }
  
  .search-button {
    display: block;
    width: 100%;
    margin-top: 20px;
    padding: 12px;
    background-color: var(--midnight-blue);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
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
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid #ccc;
    background-color: #fff;
    z-index: 1000;
    list-style: none;
    padding: 0;
    margin: 5px 0 0 0;
  }
  
  .suggestions-list li {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .suggestions-list li:hover {
    background-color: var(--light-pink);
  }
  
  /* Griglia degli appartamenti a destra */
  .apartments-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    animation: fadeInRight 0.5s ease forwards;
  }
  
  /* Card degli appartamenti */
  .apartment-card {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    opacity: 0;
    animation: fadeInUp 0.5s ease forwards;
  }
  
  .apartment-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .card-image img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .apartment-card:hover .card-image img {
    transform: scale(1.05);
  }
  
  .card-content {
    padding: 20px;
  }
  
  .card-content h3 {
    color: var(--midnight-blue);
    margin-bottom: 10px;
  }
  
  .card-content .address {
    color: var(--text-gray);
    margin-bottom: 15px;
  }
  
  .card-content .details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  .card-content .details p {
    color: var(--text-gray);
    margin: 0;
  }
  
  .extra-services-list p {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .extra-services-list ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .extra-services-list li {
    background-color: var(--light-pink);
    padding: 5px 10px;
    border-radius: 4px;
    color: var(--midnight-blue);
    font-size: 12px;
  }
  
  /* Animazioni */
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  