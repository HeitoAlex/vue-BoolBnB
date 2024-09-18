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
    border: none; 
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); 
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.card:hover {
    transform: translateY(-5px); 
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2); 
}

.card-img-top {
    height: 200px;
    object-fit: cover; 
}

.card-body {
    padding: 20px;
    text-align: left;
}

.card-header {
    background-color: #003f6c;
    color: white; 
    font-weight: bold;
    text-align: center;
    padding: 15px;
    border-bottom: none; 
    font-size: 1.5rem; 
    border-radius: 12px 12px 0 0; 
}

.details {
    margin: 10px 0;
}

.card-text {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #555;
}

.info-button {
    display: inline-block;
    margin-top: 10px; 
    padding: 10px 20px; 
    background-color: #007bff; 
    color: white;
    border-radius: 5px;
    text-decoration: none; 
    text-align: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.info-button:hover {
    background-color: #0056b3; 
    transform: translateY(-2px); 
}


.project-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px; 
    margin-top: 20px;
}

.card {
    flex: 1 1 calc(33.333% - 20px); 
    min-width: 300px; 
}
</style>
