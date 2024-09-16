<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        rooms_num: {
            type: Number,
            required: true
        },
        beds_num: {
            type: Number,
            required: true
        },
        bathroom_num: {
            type: Number,
            required: true
        },
        sq_mt: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        images: {
            type: String,
            required: true
        }
    },
    computed: {
        fullImageUrl() {
            // Concatena l'URL base con il percorso dell'immagine
            const baseUrl = 'http://localhost:8000/storage/';
            return baseUrl + this.images;
        }
    }
}
</script>

<template>
    <div class="card me-3 mb-2" style="width: 18rem;">
        <div class="card-header">{{ title }}</div>
        <!-- Usa la computed property fullImageUrl per mostrare l'immagine -->
        <img :src="fullImageUrl" class="card-img-top" alt="immagine appartamento">
        <div class="card-body">
            <h3 class="card-title">{{ title }}</h3>
            <p class="card-text">Stanze: {{ rooms_num }}</p>
            <p class="card-text">Letti: {{ beds_num }}</p>
            <p class="card-text">Bagni: {{ bathroom_num }}</p>
            <p class="card-text">Metri quadri: {{ sq_mt }} m²</p>
            <p class="card-text">Indirizzo: {{ address }}</p>
        </div>
        <div class="card-body">
            <a href="/info">Info</a>
        </div>
    </div>
</template>

<style scoped>
/* Stili aggiuntivi se necessari */
</style>
