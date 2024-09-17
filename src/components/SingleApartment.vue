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
            const baseUrl = 'http://localhost:8000/storage/';
            return baseUrl + this.images;
        }
    }
}
</script>

<template>
    <div class="card me-3 mb-2 content-wrapper">
        <img :src="fullImageUrl" class="card-img-top" alt="immagine appartamento">
        <div class="card-body">
            <div class="card-header">{{ title }}</div>
            <div class="details">
                <p class="card-text"><strong>Stanze:</strong> {{ rooms_num }}</p>
                <p class="card-text"><strong>Letti:</strong> {{ beds_num }}</p>
                <p class="card-text"><strong>Bagni:</strong> {{ bathroom_num }}</p>
                <p class="card-text"><strong>Metri quadri:</strong> {{ sq_mt }} m²</p>
                <p class="card-text"><strong>Indirizzo:</strong> {{ address }}</p>
            </div>
            <a href="/info" class="info-button">Info</a>
        </div>
    </div>
</template>

<style scoped>
/* Stile della card */
.card {
    border: none; /* Rimosso il bordo per un aspetto più pulito */
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Ombra più pronunciata */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.card:hover {
    transform: translateY(-5px); /* Leggero sollevamento al passaggio del mouse */
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2); /* Ombra più intensa al passaggio del mouse */
}

.card-img-top {
    height: 200px;
    object-fit: cover; /* Mantiene l'immagine proporzionata */
}

.card-body {
    padding: 20px; /* Maggiore padding */
    text-align: left;
}

.card-header {
    background-color: #003f6c; /* Colore di sfondo della header */
    color: white; /* Colore del testo */
    font-weight: bold;
    text-align: center;
    padding: 15px;
    border-bottom: none; /* Rimosso il bordo inferiore */
    font-size: 1.5rem; /* Maggiore dimensione per il titolo */
    border-radius: 12px 12px 0 0; /* Angoli arrotondati superiori */
}

.details {
    margin: 10px 0; /* Spazio attorno ai dettagli */
}

.card-text {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #555;
}

.info-button {
    display: inline-block;
    margin-top: 10px; /* Spazio per il pulsante */
    padding: 10px 20px; /* Maggiore padding per il pulsante */
    background-color: #007bff; /* Colore del pulsante */
    color: white;
    border-radius: 5px;
    text-decoration: none; /* Rimosso l'underline */
    text-align: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.info-button:hover {
    background-color: #0056b3; /* Colore al passaggio del mouse */
    transform: translateY(-2px); /* Effetto di sollevamento al passaggio del mouse */
}

/* Imposta il layout delle card */
.project-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px; /* Spazio tra le card */
    margin-top: 20px; /* Margine sopra le card */
}

.card {
    flex: 1 1 calc(33.333% - 20px); /* Ogni card occupa circa un terzo della larghezza */
    min-width: 300px; /* Larghezza minima */
}
</style>
