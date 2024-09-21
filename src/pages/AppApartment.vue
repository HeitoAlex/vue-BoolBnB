<script>
    import SingleApartment from '../components/SingleApartment.vue';
    import axios from 'axios';

    export default {
        components: {
            SingleApartment
        },

        data() {
            return {
                apartment: null,        // Dati dell'appartamento corrente
                loading: true,          // Stato di caricamento
                error: null,            // Messaggi di errore

                // Dati per il form di contatto
                messageForm: {
                    name: '',           // Nome del mittente
                    sender_email: '',   // Email del mittente
                    message: '',        // Messaggio
                },
                messageSuccess: '',     // Messaggio di successo
                messageError: '',       // Messaggio di errore
            }
        },

        methods: {
            // Metodo per prendere le info dell'appartamento
            getApartment(id) {
                this.loading = true; 
                axios.get(`http://127.0.0.1:8000/api/apartments/${id}`)
                    .then((response) => {
                        this.apartment = response.data.result;
                    })
                    .catch((error) => {
                        this.error = 'Errore nel caricamento dell\'appartamento.';
                        console.log(error);
                    })
                    .finally(() => {
                        this.loading = false;
                    });   
            },

            // Metodo per inviare il messaggio al proprietario
            sendMessage() {
                // Creare l'URL includendo l'ID dell'appartamento
                const url = `http://127.0.0.1:8000/api/apartments/${this.apartment.id}/messages`;

                // Richiesta POST al backend
                axios.post(url, this.messageForm)
                    .then((response) => {
                        this.messageSuccess = 'Messaggio inviato con successo!';
                        this.messageError = '';

                        // Reset del form
                        this.messageForm = {
                            name: '',
                            sender_email: '',
                            message: '',
                        };
                    })
                    .catch((error) => {
                        this.messageError = 'Errore nell\'invio del messaggio.';
                        this.messageSuccess = '';
                        console.error(error);
                    });
            },
        },

        created() {
            // Prende l'ID dell'appartamento dalla route
            this.getApartment(this.$route.params.id);

            // Se l'utente è già loggato, inserisce automaticamente nome e email
            if (window.authUser) {
                this.messageForm.sender_email = window.authUser.email;
                this.messageForm.name = window.authUser.name;
            }
        }
    }
</script>

<template>
    <div class="apartment-page">
        <!-- Header con Immagine di Sfondo -->
        <section class="header-section" v-if="apartment">
            <div class="overlay"></div>
            <img :src="`http://localhost:8000/storage/${apartment.images}`" alt="Immagine appartamento" class="header-image">
            <div class="header-content">
                <h1>{{ apartment.title }}</h1>
                <p>{{ apartment.address }}</p>
            </div>
        </section>

        <!-- Sezione Principale -->
        <section class="main-section">
            <div v-if="loading" class="loading-message">Caricamento in corso...</div>
            <div v-if="error" class="error-message">{{ error }}</div>
            <div v-if="apartment && !loading && !error" class="content-container">
                <!-- Informazioni sull'Appartamento -->
                <div class="info-container">
                    <h2 class="text-center">Dettagli dell'Appartamento</h2>
                    <div class="details-grid">
                        <div class="detail-item">
                            <i class="fas fa-door-open"></i>
                            <span>{{ apartment.rooms_num }} Stanze</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-bed"></i>
                            <span>{{ apartment.beds_num }} Letti</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-bath"></i>
                            <span>{{ apartment.bathroom_num }} Bagni</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-ruler-combined"></i>
                            <span>{{ apartment.sq_mt }} m²</span>
                        </div>

                        <button class="btn-messaggio"><router-link style="text-decoration: none; color: whitesmoke;  font-weight: bold ;" :to="{ name: 'formInfo', params: { id: id } }" class="info-button">Contatta il proprietario</router-link></button>
                    </div>

                    
                </div>

                <!-- Mockup Carosello Immagini -->
                
            </div>
        </section>
    </div>
</template>



<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Variabili per i colori */
:root {
    --light-pink: #FFB6C1;
    --midnight-blue: #191970;
    --smoke-grey: #708090;
    --accent-color: var(--midnight-blue);
    --light-bg: #f5f5f5;
    --dark-text: var(--midnight-blue);
    --light-text: #ffffff;
}

/* Stile generale della pagina */
.apartment-page {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: var(--dark-text);
}

/* Header Section */
.header-section {
    position: relative;
    height: 60vh;
    width: 100%;
    overflow: hidden;
    color: white;
}

.header-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(50%);
    transition: transform 0.5s ease;
}

.header-section:hover .header-image {
    transform: scale(1.05);
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(25, 25, 112, 0.5); /* Semi-trasparente blu notte */
}

.header-content {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: var(--light-text);
}

.header-content h1 {
    font-size: 3rem;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.header-content p {
    font-size: 1.2rem;
}

/* Main Section */
.main-section {
    padding: 40px 20px;
    background-color: var(--light-bg);
}

.loading-message,
.error-message {
    text-align: center;
    font-size: 1.5rem;
    color: var(--midnight-blue);
    margin-top: 50px;
}

.error-message {
    color: #e74c3c; /* Rosso per errori */
}

.content-container {
    display: flex;
    /* grid-template-columns: 1fr 1fr; */
    /* gap: 40px; */
    max-width: 1200px;
    margin: 0 auto;
    justify-content: center;
    padding: 2rem;
}

/* Informazioni sull'Appartamento */
.info-container,
.carousel-container {
    width: 60rem;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

}

.info-container:hover,
.carousel-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.info-container h2,
.carousel-container h2 {
    margin-bottom: 20px;
    color: var(--midnight-blue);
    border-bottom: 2px solid var(--light-pink);
    /* display: inline-block; */
    padding-bottom: 5px;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 50px;
}

.detail-item {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    color: var(--midnight-blue);
}

.detail-item i {
    margin-right: 10px;
    color: var(--light-pink);
    font-size: 1.5rem;
}



/* Carosello Mockup */
.carousel-container {
    position: relative;
}

.carousel {
    position: relative;
    width: 100%;
    height: 300px;
    background-color: var(--smoke-grey);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.carousel-controls {
    position: absolute;
    top: 50%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
    padding: 0 20px;
}

.carousel-button {
    background-color: rgba(255, 255, 255, 0.7);
    border: none;
    border-radius: 50%;
    padding: 10px;
    cursor: not-allowed; /* Disabilitato */
    color: var(--midnight-blue);
    font-size: 1.2rem;
    transition: background-color 0.3s ease;
}

.carousel-button:hover {
    background-color: rgba(255, 255, 255, 1);
}

.carousel-indicator {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
}

.dot {
    width: 10px;
    height: 10px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
}

.dot.active {
    background-color: var(--light-pink);
}

.carousel-note {
    margin-top: 10px;
    font-size: 0.9rem;
    color: var(--midnight-blue);
    text-align: center;
}

/* Bottone per contattare il proprietario */
.btn-messaggio {
    background-color: #a34a62;
    color: var(--light-text);
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

/* Responsiveness */
@media (max-width: 992px) {
    .content-container {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .header-content h1 {
        font-size: 2.5rem;
    }

    .header-content p {
        font-size: 1rem;
    }

    .carousel {
        height: 250px;
    }
}

@media (max-width: 600px) {
    .header-content h1 {
        font-size: 2rem;
    }

    .header-content p {
        font-size: 0.9rem;
    }

    .detail-item {
        font-size: 1rem;
    }

    .detail-item i {
        font-size: 1.2rem;
    }

    .carousel {
        height: 200px;
    }
}
</style>
