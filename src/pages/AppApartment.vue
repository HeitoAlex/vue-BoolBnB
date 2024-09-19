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
                    name: '',           // Nome del mittente (OPZIONALE?..) boh in realtà non lo dice che è possibile inserirlo, ma immagino che per gli utenti registrati si...
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
                // creare l'URL includendo l'ID dell'appartamento
                const url = `http://127.0.0.1:8000/api/apartments/${this.apartment.id}/messages`;

                // richiesta POST al backend
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
            // per prendere l'ID dell'appartamento dalla route
            this.getApartment(this.$route.params.id);

            // Questo nel caso l'utente è già loggato, quindi nome e email vengono automaticamente inseriti
            if (window.authUser) {
                this.messageForm.sender_email = window.authUser.email;
                this.messageForm.name = window.authUser.name;
            }
        }
    }
</script>

<template>
    <div class="container">
        <div class="apartment-list">
            <!-- Messaggio di caricamento -->
            <div v-if="loading" class="loading-message">Caricamento in corso...</div>

            <!-- Messaggio di errore -->
            <div v-if="error" class="error-message">{{ error }}</div>

            <!-- Dettagli dell'appartamento e form di contatto -->
            <transition name="fade">
                <div v-if="apartment">
                    <!-- Component per visualizzare i dettagli dell'appartamento -->
                    <SingleApartment 
                        :title="apartment.title" 
                        :rooms_num="apartment.rooms_num" 
                        :beds_num="apartment.beds_num" 
                        :bathroom_num="apartment.bathroom_num" 
                        :sq_mt="apartment.sq_mt" 
                        :address="apartment.address" 
                        :images="apartment.images" 
                    />

                    <!-- Form di contatto -->
                    <div class="message-form">
                        <h2>Contatta il proprietario</h2>
                        <form @submit.prevent="sendMessage">
                            <div>
                                <label for="name">Il tuo nome:</label>
                                <input type="text" id="name" v-model="messageForm.name" required>
                            </div>
                            <div>
                                <label for="email">La tua email:</label>
                                <input type="email" id="email" v-model="messageForm.sender_email" required>
                            </div>
                            <div>
                                <label for="message">Messaggio:</label>
                                <textarea id="message" v-model="messageForm.message" required></textarea>
                            </div>
                            <button type="submit">Invia Messaggio</button>
                        </form>
                        <!-- Messaggi di successo o errore -->
                        <div v-if="messageSuccess" class="success-message">{{ messageSuccess }}</div>
                        <div v-if="messageError" class="error-message">{{ messageError }}</div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<style scoped>  
/* Stili per il container */
.container {
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 20px; 
}

/* Stili per la lista degli appartamenti */
.apartment-list {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Messaggio di caricamento */
.loading-message {
    font-size: 1.5rem;
    color: #007bff;
    margin-top: 20px;
}

/* Messaggio di errore */
.error-message {
    font-size: 1.5rem;
    color: #ff0000; 
    margin-top: 20px;
}

/* Animazioni per il fade-in/fade-out */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

/* Stili per il form di contatto */
.message-form {
    margin-top: 2rem;
}

.message-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.message-form input,
.message-form textarea {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.message-form button {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.message-form button:hover {
    background-color: #0056b3;
}

/* Messaggi di successo ed errore */
.success-message {
    color: green;
    margin-top: 1rem;
}

.error-message {
    color: red;
    margin-top: 1rem;
}
</style>
