import { reactive } from 'vue';
import axios from 'axios';

// Creazione del store reactive
export const store = reactive({
  apartments: [],  // Lista degli appartamenti
  extraServices: [],  // Lista degli extra servizi
  searchParams: {
    location: '',  // Parametro per la località
    rooms: null,   // Numero di stanze
    beds: null,    // Numero di letti
    radius: 20,    // Raggio della ricerca
    extra_services: [], // Servizi extra selezionati
  },
  loading: false,  // Stato di caricamento
  error: null,     // Gestione degli errori

  // Funzione per fare la chiamata API e aggiornare lo stato
  async fetchApartments() {
    this.loading = true;
    this.error = null;

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/apartments');
      this.apartments = response.data.results;
    } catch (error) {
      console.error('Errore durante il fetch degli appartamenti:', error);
      this.error = 'Errore nel caricamento degli appartamenti.';
    } finally {
      this.loading = false;
    }
  },

  // Funzione per caricare gli extra servizi dall'API
  async fetchExtraServices() {
    this.loading = true;
    this.error = null;

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/extra-services');
      this.extraServices = response.data.results;
    } catch (error) {
      console.error('Errore durante il fetch degli extra servizi:', error);
      this.error = 'Errore nel caricamento degli extra servizi.';
    } finally {
      this.loading = false;
    }
  },

  // Funzione per aggiornare i parametri di ricerca
  updateSearchParams(params) {
    this.searchParams = { ...this.searchParams, ...params };
  },

  // Funzione per fare la chiamata API per la ricerca avanzata
  async searchApartments() {
    this.loading = true;
    this.error = null;

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/search', {
        params: this.searchParams, // Passa i parametri di ricerca al backend
      });
      this.apartments = response.data.results;
    } catch (error) {
      console.error('Errore durante la ricerca degli appartamenti:', error);
      this.error = 'Errore durante la ricerca degli appartamenti.';
    } finally {
      this.loading = false;
    }
  },
});
