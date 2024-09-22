<script>
import axios from 'axios';

export default {
    data() {
        return {
            apartments: [],             // Lista di appartamenti
            searchLocation: '',         // Località di ricerca inserita dall'utente
            searchRadius: '20',         // Raggio di ricerca predefinito in km
            rooms: '1',                 // Numero di stanze predefinito
            beds: '1',                  // Numero di letti predefinito
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
            // Controllo dei valori vuoti e impostazione dei valori predefiniti
            const location = this.searchLocation || ''; // Località predefinita
            const radius = this.searchRadius || '500';         // Raggio predefinito (20 km)
            const roomsNum = this.rooms || '1';               // Numero predefinito di stanze (1)
            const bedsNum = this.beds || '1';                 // Numero predefinito di letti (1)

            // Prepara i parametri di ricerca, rispettando i nomi attesi dal backend
            const params = {
                location: location,
                radius: radius,
                rooms_num: roomsNum,
                beds_num: bedsNum,
                'extra_services[]': this.selectedExtraServices  // Questo invierà il parametro come un array
            };

            // Effettua la chiamata al backend con i parametri di ricerca
            axios
                .get('http://127.0.0.1:8000/api/search', { params })
                .then((response) => {
                    console.log('Risposta API:', response.data); // Log della risposta
                    this.apartments = response.data.results;
                })
                .catch((error) => {
                    console.log('Errore durante il fetch degli appartamenti:', error);
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
            console.log('Chiamata API getCitySuggestions:', {
                location: this.searchLocation
            });

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
                    console.error('Errore nel fetch dei suggerimenti:', error);
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
                    console.log('Servizi extra caricati:', response.data.results); // Log della risposta
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
            <!-- <SearchComponent @search="updateFilters" /> -->
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

        <!-- Servizi extra come pulsanti -->
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
              <label :for="'service-' + extra_service.id" class="service-label">
                <i :class="extra_service.icon"></i>
                <!-- 
                per l'inserimento delle icone dovrei rimuoere questo tag sopra <i> con questo
                <img :src="getServiceIcon(extra_service.name)" alt="" class="service-icon" />
                per prendere le icone... dato che su script ho aggiunto il metodo per prendere le
                icone e associarle ad ogni servizio. quindi l'unico problema che posso pensare
                e che i nomi non corrispondono del DB, questa cosa è da verificare
                -->
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
        <div class="apartments-container">
          <div class="apartments-grid">
      <div
        v-for="(apartment, index) in apartments"
        :key="apartment.id"
        class="apartment-card"
        :style="{ animationDelay: (index * 0.1) + 's' }"

      >
        <div class="card-image">
          <img :src="getFullImageUrl(apartment.images)" alt="Immagine Appartamento" loading="lazy" />
          <span v-if="apartment.sponsors && apartment.sponsors.length > 0" class="sponsored-label">
            <i class="fas fa-star"></i> SPONSORIZZATO
          </span>
        </div>
        <div class="card-content">
          <h3 class="card-title">{{ apartment.title }}</h3>

          <p v-if="apartment.sponsors && apartment.sponsors.length > 0" class="text-warning">
            SPONSORIZZATO
          </p>
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


.apartments-container {
  display: flex;
  justify-content: center;
  padding: .2rem;
  padding-top: 0;
  padding-bottom: 0;
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
}  /* Questa è da cambiare!! */

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
  height: 100%; 
  min-width: 300px; 
  max-width: 350px; 
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
  max-height: 20rem;
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
