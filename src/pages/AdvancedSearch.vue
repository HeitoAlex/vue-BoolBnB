<script>
import axios from 'axios';

    export default {
        data() {
            return {
            apartments: [],  // Lista di appartamenti
            searchLocation: '',  // Località di ricerca inserita dall'utente
            searchRadius: '',    // Raggio di ricerca predefinito in km
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
    }
</script>

<template>
    <div class="search-box">
        <label for="">In quale città?</label>
        <input
            type="text"
            v-model="searchLocation"
            placeholder="Inserisci una località"
            @input="debounceSearchLocation" 
            @blur="hideSuggestions"          
        />

        <label for="rooms">Quante stanze?</label>
        <input type="number" name="rooms" id="rooms">

        <label for="beds">Quanti letti?</label>
        <input type="number" name="beds" id="beds">

        <label for="km">A che distanza dal centro?</label>
        <input
            type="number"
            v-model="searchRadius"
            placeholder="Raggio in km"
            @input="debounceSearchLocation" 
        />

        <label for="services">Che servizi cerchi?</label>
        <div v-for="apartments.extra_service in apartments.extra_services">
            <input type="checkbox" :name="apartments.extra_service.name" id="apartments.extra_service.name">
        </div>
        
    </div>

</template>

<style scoped>
    .search-box{
        display: flex;
        flex-direction: column;
        margin: 7rem 1.5rem 1.5rem;
        padding: 1rem;
        background-color: rgb(197, 197, 249);
        max-width: 20%;
    }

</style>