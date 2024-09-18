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
    <div class="search-box">
        <label for="searchLocation">In quale città?</label>
        <input
            type="text"
            v-model="searchLocation"
            placeholder="Inserisci una località"
            @input="debounceSearchLocation"
            @blur="hideSuggestions"
            id="searchLocation"
        />

        <!-- Suggerimenti di città -->
        <ul v-if="showSuggestions">
            <li v-for="suggestion in suggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
                {{ suggestion }}
            </li>
        </ul>

        <label for="rooms">Quante stanze?</label>
        <input
            type="number"
            v-model.number="rooms"
            name="rooms"
            id="rooms"
            @input="debounceSearchLocation"
        />

        <label for="beds">Quanti letti?</label>
        <input
            type="number"
            v-model.number="beds"
            name="beds"
            id="beds"
            @input="debounceSearchLocation"
        />

        <label for="km">A che distanza dal centro?</label>
        <input
            type="number"
            v-model.number="searchRadius"
            placeholder="Raggio in km"
            @input="debounceSearchLocation"
            id="km"
        />

        <label for="services">Che servizi cerchi?</label>
        <div v-for="extra_service in allExtraServices" :key="extra_service.id">
            <input
                type="checkbox"
                :value="extra_service.id"
                v-model="selectedExtraServices"
                @change="debounceSearchLocation"
            />
            {{ extra_service.name }}
        </div>
    </div>

    <!-- Lista degli appartamenti -->
    <div class="apartments-list">
        <div v-for="apartment in apartments" :key="apartment.id" class="apartment-item">
            <h2>{{ apartment.title }}</h2>
            <img :src="getFullImageUrl(apartment.images)" alt="Immagine Appartamento" />
            <p>{{ apartment.address }}</p>
            <p>Stanze: {{ apartment.rooms_num }}, Letti: {{ apartment.beds_num }}, Bagni: {{ apartment.bathroom_num }}</p>
            <!-- Mostra i servizi extra dell'appartamento -->
            <p>Servizi Extra:
                <span v-for="(service, index) in apartment.extra_services" :key="service.id">
                    {{ service.name }}<span v-if="index < apartment.extra_services.length - 1">, </span>
                </span>
            </p>
        </div>
    </div>
</template>
<style scoped>
.search-box {
    display: flex;
    flex-direction: column;
    margin: 2rem 1.5rem;
    padding: 1rem;
    background-color: rgb(197, 197, 249);
    max-width: 300px;
}

.apartments-list {
    margin: 2rem 1.5rem;
}

.apartment-item {
    margin-bottom: 2rem;
}

ul {
    list-style-type: none;
    padding: 0;
}

ul li {
    cursor: pointer;
    background-color: white;
    padding: 5px;
}

ul li:hover {
    background-color: lightgray;
}
</style>
