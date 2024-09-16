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
                        console.log('Raw Response:', response);  // Logga la risposta grezza

                        if (!response.ok) {
                            throw new Error('Errore nella risposta: ' + response.status);
                        }

                        return response.text();  // Temporaneamente usiamo .text() per vedere esattamente cosa arriva
                    })
                    .then(data => {
                        console.log('Risposta come testo:', data);  // Log della risposta prima di parsarla

                        try {
                            const parsedData = JSON.parse(data);  // Prova a parsare manualmente
                            if (parsedData.success) {
                                this.results = parsedData.results || [];
                            } else {
                                console.error('Errore nel backend:', parsedData.message);
                            }
                        } catch (error) {
                            console.error('Errore nel parsing del JSON:', error);
                        }
                    })
                    .catch(error => {
                        console.error('Errore nella ricerca:', error);
                    });
            }
        }
    }
}
</script>
