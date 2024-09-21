<script>
import axios from 'axios';

export default {
    data() {
        return {
            apartments: [],            // Lista completa di appartamenti caricati dal backend
            filteredApartments: [],     // Lista di appartamenti filtrati
            searchLocation: '',         // Località inserita dall'utente
            searchRadius: 20,           // Raggio di ricerca predefinito in km
            rooms: 1,                   // Numero di stanze
            beds: 1,                    // Numero di letti
            selectedExtraServices: [],  // IDs dei servizi extra selezionati
            allExtraServices: [],       // Tutti i servizi extra disponibili
            suggestions: [],            // Suggerimenti di città
            showSuggestions: false,     // Controlla se mostrare i suggerimenti
            debounceTimeout: null,      // Timeout per debounce
            selectedCoordinates: null,  // Coordinate della località selezionata
            baseUrl: 'http://localhost:8000/storage/' // URL base per il percorso delle immagini
        };
    },
    methods: {
        // Carica tutti gli appartamenti all'inizio
        loadApartments() {
            axios.get('http://127.0.0.1:8000/api/search')
                .then((response) => {
                    this.apartments = response.data.results;
                    this.filteredApartments = this.apartments; // Mostra tutti inizialmente
                })
                .catch((error) => {
                    console.error('Errore durante il fetch degli appartamenti:', error);
                });
        },

        // Funzione principale di filtraggio lato client
        filterApartments() {
            let filtered = this.apartments;

            // Se la barra di ricerca è vuota, mostra tutti gli appartamenti
            if (!this.searchLocation && !this.selectedCoordinates) {
                this.filteredApartments = this.apartments;
                return;
            }

            // Filtro per località e distanza
            if (this.selectedCoordinates) {
                filtered = filtered.filter(apartment => {
                    const distance = this.calculateDistance(
                        this.selectedCoordinates.lat,
                        this.selectedCoordinates.lon,
                        apartment.latitude, 
                        apartment.longitude
                    );
                    return distance <= this.searchRadius;
                });
            } else if (this.searchLocation) {
                filtered = filtered.filter(apartment =>
                    apartment.address.toLowerCase().includes(this.searchLocation.toLowerCase())
                );
            }

            // Filtro numero di stanze e letti
            filtered = filtered.filter(apartment => {
                const matchesRooms = apartment.rooms_num >= this.rooms;
                const matchesBeds = apartment.beds_num >= this.beds;
                return matchesRooms && matchesBeds;
            });

            // Filtro per servizi extra selezionati
            filtered = filtered.filter(apartment => {
                return this.selectedExtraServices.every(serviceId =>
                    apartment.extra_services.some(service => service.id === serviceId)
                );
            });

            this.filteredApartments = filtered;
        },

        // Calcola la distanza usando la formula dell'Haversine
        calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Raggio medio della Terra in km
            const dLat = this.degToRad(lat2 - lat1);
            const dLon = this.degToRad(lon2 - lon1);
            const a = 
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c; // Distanza in km
            return distance;
        },

        degToRad(deg) {
            return deg * (Math.PI / 180);
        },

        // Funzione debounce per ridurre la frequenza di filtraggio
        debounceFilter() {
            if (this.debounceTimeout) clearTimeout(this.debounceTimeout);

            this.debounceTimeout = setTimeout(() => {
                this.filterApartments(); // Esegui il filtraggio
            }, 100); // Ridotto il debounce a 100ms per maggiore reattività
        },

        // Ottieni suggerimenti di città dall'API TomTom
        getCitySuggestions() {
            if (this.searchLocation.length < 3) {
                this.suggestions = [];
                this.showSuggestions = false;
                return;
            }

            const apiKey = 'S14VN8AzM8BoQ73JkRu5N2PqtkZtrrjN'; // Chiave API di TomTom
            axios.get(`https://api.tomtom.com/search/2/search/${encodeURIComponent(this.searchLocation)}.json`, {
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
                        .map(item => ({
                            address: item.address.freeformAddress,
                            lat: item.position.lat,
                            lon: item.position.lon
                        }));
                    this.showSuggestions = true;
                } else {
                    this.suggestions = [];
                    this.showSuggestions = false;
                }
            })
            .catch((error) => {
                console.error('Errore nel fetch dei suggerimenti:', error);
            });
        },

        // Seleziona un suggerimento e aggiorna le coordinate
        selectSuggestion(suggestion) {
            this.searchLocation = suggestion.address;
            this.selectedCoordinates = { lat: suggestion.lat, lon: suggestion.lon };
            this.suggestions = [];
            this.showSuggestions = false;
            this.filterApartments();  // Filtra appartamenti dopo selezione località
        },

        // Se la barra è vuota, mostra tutti gli appartamenti e attiva la ricerca dinamica
        handleInput() {
            this.filterApartments();
            if (this.searchLocation.length < 3) {
                this.filteredApartments = this.apartments;
                this.showSuggestions = false;
                return;
            } else {
                this.getCitySuggestions(); // Altrimenti, continua con la ricerca suggerita
            }
        },

        hideSuggestions() {
            this.showSuggestions = false;
        },

        // Ottieni l'URL completo per l'immagine dell'appartamento
        getFullImageUrl(imagePath) {
            return imagePath ? this.baseUrl + imagePath : '';
        },

        // Carica tutti i servizi extra
        loadExtraServices() {
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
        this.loadApartments();      // Carica gli appartamenti al caricamento
        this.loadExtraServices();   // Carica i servizi extra
    },
};
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
                @input="handleInput"
                @focus="showSuggestions = true"
                id="searchLocation"
              />
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <!-- Suggerimenti di città -->
            <ul v-if="showSuggestions && suggestions.length" class="suggestions-list">
              <li
                v-for="suggestion in suggestions"
                :key="suggestion.address"
                @click="selectSuggestion(suggestion)"
              >
                {{ suggestion.address }}
              </li>
            </ul>
          </div>

          <!-- Altri campi di ricerca (stanze, letti, distanza) -->
          <div class="search-field">
            <label for="rooms">Quante stanze?</label>
            <div class="input-wrapper">
              <input
                type="number"
                v-model.number="rooms"
                name="rooms"
                id="rooms"
                @input="debounceFilter"
                min="1"
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
                @input="debounceFilter"
                min="1"
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
                @input="debounceFilter"
                id="km"
                min="1"
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
                @change="debounceFilter"
                :id="'service-' + extra_service.id"
              />
              <label :for="'service-' + extra_service.id" class="service-label">
                {{ extra_service.name }}
              </label>
            </div>
          </div>
        </div>


        <!-- <div class="test-icon">
          <i class="fas fa-check"></i> Icon Test
        </div> -->

        <button class="search-button" @click="getApartments">Cerca</button>
      </div>

      <!-- Lista degli appartamenti a destra -->
      <div class="apartments-grid">
    <div
      v-for="(apartment, index) in filteredApartments"
      :key="apartment.id"
      class="apartment-card"
      :style="{ 
      animationDelay: (index * 0.1) + 's', 
      maxHeight: '500px' , maxWidth: '500px'
    }"
  >
      <div class="card-image">
        <img :src="getFullImageUrl(apartment.images)" alt="Immagine Appartamento" />
        <span v-if="apartment.sponsors && apartment.sponsors.length > 0" class="sponsored-label">
          <i class="fas fa-star"></i> SPONSORIZZATO
        </span>
      </div>
      <div class="card-content">
        <h3 class="card-title">{{ apartment.title }}</h3>

       
        <p class="address"><i class="fas fa-map-marker-alt icon"></i> {{ apartment.address }}</p>
        <div class="details">
          <p><i class="fas fa-door-open icon"></i> Stanze: {{ apartment.rooms_num }}</p>
          <p><i class="fas fa-bed icon"></i> Letti: {{ apartment.beds_num }}</p>
          <p><i class="fas fa-bath icon"></i> Bagni: {{ apartment.bathroom_num }}</p>
        </div>
        <!-- Servizi extra dell'appartamento -->
        <div class="extra-services-list">
          <p>Servizi Extra:</p>
          <ul>
            <li v-for="(service, index) in apartment.extra_services" :key="service.id">
              <i :class="service.icon"></i> {{ service.name }}
            </li>
          </ul>
        </div>

        <router-link 
          :to="{ name: 'apartment', params: { id: apartment.id } }" 
          class="btn-primary">
          Leggi di più <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
    </div>
  </div>
    </div>
  </div>
</template>




<style scoped>

/* CDN */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');


/* Variabili di colore */
:root {
  --light-pink: #f5c1d1;
  --dark-pink: #f29aac;
  --midnight-blue: #002b5e;
  --dark-midnight-blue: #001c40;
  --smoke-gray: #f0f0f0;
  --text-gray: #555;
}

/* .service-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
} */


/* Contenitore principale */
.advanced-search-container {
  padding: 20px;

}

/* Wrapper per la barra di ricerca e gli appartamenti */
.content-wrapper {
  display: flex;
  gap: 20px;
  animation: fadeIn 1s ease forwards;
}

.icon {
  color: var(--dark-pink);
  margin-right: 10px;
  transition: color 0.3s;
}

.details {
  margin: 10px 0;
}

.extra-services-list {
  margin: 10px 0;
}


.extra-services-list p {
  margin-bottom: 5px;
  font-weight: bold;
}

.extra-services-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}


.extra-services-list li {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

/* Barra di ricerca a sinistra */
.search-box {
  width: 300px;
  background-color: var(--smoke-gray);
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.search-box:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.search-title {
  text-align: center;
  color: var(--midnight-blue);
  margin-bottom: 25px;
  font-size: 1.5rem;
  font-weight: bold;
}

.search-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-field {
  position: relative;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: #fff;
  color: #333;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-wrapper input:focus {
  border-color: var(--midnight-blue);
  outline: none;
}

.input-wrapper i {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--midnight-blue);
  font-size: 1.2rem;
}

/* Servizi extra come pulsanti */
.extra-services {
  margin-top: 25px;
}

.extra-services label {
  display: block;
  font-weight: bold;
  margin-bottom: 15px;
  color: var(--midnight-blue);
  font-size: 1.1rem;
}

.services-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.service-item {
  position: relative;
}

.service-item input {
  display: none;
}

.service-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background-color: #fff;
  border: 2px solid var(--midnight-blue);
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  font-size: 0.9rem;
}

.service-label i {
  font-size: 1.2rem;
  color: var(--midnight-blue);
  transition: color 0.3s ease;
}

.service-item input:checked + .service-label {
  background-color: var(--light-pink);
  color: #fff;
  border-color: var(--light-pink);
}

.service-item input:checked + .service-label i {
  color: #fff;
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

/* Pulsante di ricerca */
.search-button {
  display: block;
  width: 100%;
  margin-top: 25px;
  padding: 12px;
  background-color: var(--midnight-blue);
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.search-button:hover {
  background-color: var(--dark-midnight-blue);
  transform: translateY(-2px);
}

/* Lista dei suggerimenti */
.suggestions-list {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background-color: #fff;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 5px 0 0 0;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.suggestions-list li {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.suggestions-list li:hover {
  background-color: var(--light-pink);
  color: #fff;
}

/* Griglia degli appartamenti a destra */
.apartments-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  animation: fadeInRight 1s ease forwards;
}  /* Questa è da cambiare */

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
  height: 100%; /* Assicura che tutte le card abbiano la stessa altezza */
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

.apartment-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  margin: .2rem;
  padding: .4rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1; 
  /* per far stare il tasto in basso */
}

.card-text,
.address {
  color: var(--text-gray);
  margin: 5px 0;
  display: flex;
  align-items: center;
}

.card-content h3 {
  color: var(--midnight-blue);
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.card-content .address {
  color: var(--text-gray);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.card-content .details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.card-content .details p {
  color: var(--text-gray);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.95rem;
}

.extra-services-list p {
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--midnight-blue);
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
  border-radius: 15px;
  color: var(--midnight-blue);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.extra-services-list li i {
  font-size: 0.8rem;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }

  .search-box {
    width: 100%;
    margin-right: 0;
  }

  .apartments-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}
</style>
