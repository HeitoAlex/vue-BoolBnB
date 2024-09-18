// store.js
import { reactive } from 'vue';
import axios from 'axios';

const state = reactive({
  apartments: [],
  searchLocation: '',
  searchRadius: 20,
  suggestions: [],
  showSuggestions: false,
  baseUrl: 'http://localhost:8000/storage/', // Base URL per immagini
});

const actions = {
  async getApartments() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/search', {
        params: {
          location: state.searchLocation,
          radius: state.searchRadius,
        },
      });
      state.apartments = response.data.results;
    } catch (error) {
      console.log(error);
    }
  },

  async getCitySuggestions() {
    const apiKey = 'S14VN8AzM8BoQ73JkRu5N2PqtkZtrrjN';
    try {
      const response = await axios.get(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(state.searchLocation)}.json`,
        {
          params: {
            key: apiKey,
            language: 'it-IT',
            typeahead: true,
            limit: 5,
            entityType: 'Municipality',
          },
        }
      );

      if (response.data.results && response.data.results.length > 0) {
        state.suggestions = response.data.results
          .filter(item => item.address && item.address.freeformAddress)
          .map(item => item.address.freeformAddress);
        state.showSuggestions = true;
      } else {
        state.suggestions = [];
        state.showSuggestions = false;
      }
    } catch (error) {
      console.error('Errore nel fetch:', error);
    }
  },

  selectSuggestion(suggestion) {
    state.searchLocation = suggestion;
    state.suggestions = [];
    state.showSuggestions = false;
    actions.getApartments();
  },

  hideSuggestions() {
    state.showSuggestions = false;
  },

  getFullImageUrl(imagePath) {
    if (!imagePath) return '';
    return state.baseUrl + imagePath;
  },
};

export default {
  state,
  actions,
};
