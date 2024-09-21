<script>
export default {
    data() {
        return {
            name: '',
            email: '',
            message: '',
            apartment_id: null, // Aggiungi l'ID dell'appartamento
            showModal: false, // Variabile per gestire la visibilità della modale
        };
    },
    mounted() {
        // Recupera l'id dell'appartamento dalla route
        this.apartment_id = this.$route.params.id;
        console.log('ID dell\'appartamento:', this.apartment_id);
    },
    methods: {
        async sendMessage() {
            const url = 'http://localhost:8000/api/messages';
            console.log('URL API:', url); // Log URL

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.name,
                        sender_email: this.email,
                        message: this.message,
                        apartment_id: this.apartment_id, // Includi l'ID dell'appartamento
                    }),
                });

                const responseText = await response.text();
                console.log('Risposta dal backend:', responseText); // Log della risposta

                if (response.ok) {
                    this.showModal = true; // Mostra la modale

                    // Reindirizza alla home dopo 3 secondi
                    setTimeout(() => {
                        this.$router.push('/');
                    }, 3000);
                } else {
                    alert('Errore durante l\'invio del messaggio.');
                }
            } catch (error) {
                console.error('Errore di connessione:', error);
                alert('Errore di connessione.');
            }
        },
        closeModal() {
            this.showModal = false; // Chiude la modale
        }
    }
};

</script>

<template>
    <div class="form-container content-wrapper-form">
        <div class="mb-3">
            <label for="name" class="form-label">Nome cliente</label>
            <input v-model="name" type="text" class="form-control" id="name" placeholder="Inserire il proprio nome">
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email cliente</label>
            <input v-model="email" type="email" class="form-control" id="email" placeholder="user@example.com">
        </div>
        <div class="mb-3">
            <label for="info" class="form-label">Richiesta informazioni</label>
            <textarea v-model="message" class="form-control" id="exampleFormControlTextarea1" rows="5"
                placeholder="Inserire qui la richiesta di informazioni per il proprietario"></textarea>
        </div>
        <!-- Pulsante centrato -->
        <div class="d-flex justify-content-center">
            <button @click="sendMessage" class="btn btn-primary btn-lg">Invia</button>
        </div>

        <!-- Modale di conferma invio messaggio -->
        <div v-if="showModal" class="modal fade show" style="display: block;">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Messaggio Inviato</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Il tuo messaggio è stato inviato con successo! Verrai reindirizzato alla homepage.</p>
                    </div>
                    <div class="modal-footer">
                        <button @click="closeModal" class="btn btn-secondary">Chiudi</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<style scoped>
.form-container {
    max-width: 1000px;
    margin: auto;
    margin-top: 7em;
    padding: 2rem;
    padding-bottom: 15rem;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    max-width: 500px;
    width: 100%;
}

.modal-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}
</style>
