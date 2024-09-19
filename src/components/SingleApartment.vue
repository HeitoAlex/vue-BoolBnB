<script>
export default {
    props: {
        id: {
            type: Number,
            required: true
        },
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
    <div class="apartment-card">
        <div class="image-section">
            <img :src="fullImageUrl" alt="Immagine appartamento" class="apartment-image">
        </div>
        <div class="info-section">
            <h2 class="apartment-title">{{ title }}</h2>
            <div class="apartment-details">
                <div class="detail-item">
                    <i class="fas fa-door-open"></i>
                    <span>{{ rooms_num }} Stanze</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-bed"></i>
                    <span>{{ beds_num }} Letti</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-bath"></i>
                    <span>{{ bathroom_num }} Bagni</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-ruler-combined"></i>
                    <span>{{ sq_mt }} m²</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>{{ address }}</span>
                </div>
                
            </div>
            <router-link :to="{ name: 'formInfo', params: { id: id } }" class="contact-button">
                Contatta il Proprietario
            </router-link>
        </div>
    </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Stile generale della carta */
.apartment-card {
    display: flex;
    flex-direction: row;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin: 20px 0;
}

.apartment-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* Sezione immagine */
.image-section {
    flex: 1;
    min-width: 300px;
    max-width: 400px;
    overflow: hidden;
    position: relative;
}

.apartment-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.image-section:hover .apartment-image {
    transform: scale(1.1);
}

/* Sezione informazioni */
.info-section {
    flex: 2;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.apartment-title {
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: left;
}

.apartment-details {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
}

.detail-item {
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: #555555;
}

.detail-item i {
    color: #007bff;
    margin-right: 8px;
    font-size: 1.2rem;
}

.contact-button {
    align-self: flex-start;
    padding: 12px 28px;
    background-color: #ff5722;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.contact-button:hover {
    background-color: #e64a19;
    transform: translateY(-3px);
}

/* Icona pulsante */
.contact-button i {
    font-size: 1.1rem;
}

/* Responsività */
@media (max-width: 1024px) {
    .apartment-card {
        flex-direction: column;
    }
    
    .image-section {
        max-width: 100%;
        height: 250px;
    }
    
    .apartment-image {
        height: 100%;
    }
    
    .info-section {
        padding: 20px;
    }
}

@media (max-width: 600px) {
    .apartment-title {
        font-size: 1.5rem;
    }
    
    .detail-item {
        width: 50%;
    }
    
    .contact-button {
        padding: 10px 20px;
        font-size: 0.9rem;
    }
}
</style>
