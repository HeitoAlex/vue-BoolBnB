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
    <div class="card me-3 mb-2 content-wrapper" style="width: 18rem;">
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
/* Stile della card */
.card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Aggiunge ombra */
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* Aggiunge transizioni */
    overflow: hidden;
    display: flex;
    flex-direction: column; /* Colonne per mantenere la card ordinata */
    height: 100%; /* Assicura che la card occupi tutta l'altezza disponibile */
}

.card-img-top {
    height: 200px;
    object-fit: cover; /* Fa sì che l'immagine si adatti correttamente senza distorcersi */
    border-bottom: 1px solid #e0e0e0;
}

.card-body {
    padding: 15px;
    text-align: left;
    flex-grow: 1; /* Questo assicura che il corpo della card cresca per riempire lo spazio */
}

.card-header {
    background-color: #f8f9fa;
    font-weight: bold;
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    font-size: 1.25rem;
}

.card-title {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
    color: #003f6c;
}

.card-text {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #555;
}

/* Stile del pulsante 'Info' */
.card-body a {
    display: inline-block;
    margin-top: auto; /* Spinge il bottone in basso */
    padding: 8px 16px;
    background-color: #003f6c;
    color: white;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.card-body a:hover {
    background-color: #005b96;
}

/* Imposta il layout delle card */
.project-list {
    display: flex;
    flex-wrap: wrap;
    gap: 100px; /* Aggiunge spazio tra le card */
    margin-top: 20px; /* Spazio aggiuntivo sopra le card */
}

.card {
    flex: 1 1 calc(33.333% - 20px); /* Ogni card occupa circa un terzo della larghezza */
    min-width: 300px;
    max-width: 300px; /* Imposta una larghezza massima per uniformare la dimensione */
}

</style>
