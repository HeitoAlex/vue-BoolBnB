<template>
    <div>
        <input v-model="searchQuery" @input="performSearch" placeholder="Cerca appartamenti..." id="location" />
        <ul v-if="results.length">
            <li v-for="(apartment, index) in results" :key="index">
                <a :href="`/guest/apartment/${apartment.id}`">{{ apartment.title }}</a>
            </li>
        </ul>
        <p v-if="!results.length && searchQuery">Nessun appartamento trovato</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchQuery: '',
            results: []
        };
    },
    methods: {
        performSearch() {
            if (this.searchQuery.length > 2) {
                fetch(`http://localhost:8000/api/search?location=${encodeURIComponent(this.searchQuery)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Errore nella risposta: ' + response.status);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            this.results = data.results || [];
                        } else {
                            console.error('Errore nel backend:', data.message);
                            this.results = [];
                        }
                    })
                    .catch(error => {
                        console.error('Errore nella ricerca:', error);
                        this.results = [];
                    });
            } else {
                this.results = [];
            }
        }
    }
}
</script>
