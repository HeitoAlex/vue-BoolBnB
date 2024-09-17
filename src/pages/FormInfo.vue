<script>
export default {
    data() {
        return {
            name: '',
            email: '',
            message: ''
        };
    },
    methods: {
        async sendMessage() {
            const url = 'http://localhost:8000/api/messages';  
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
                    }),
                });

                const responseText = await response.text();
                console.log('Risposta dal backend:', responseText);

                if (response.ok) {
                    alert('Messaggio inviato con successo!');
                } else {
                    alert('Errore durante l\'invio del messaggio.');
                }
            } catch (error) {
                console.error('Errore di connessione:', error);
                alert('Errore di connessione.');
            }
        }
    }
}
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
            <textarea v-model="message" class="form-control" id="exampleFormControlTextarea1" rows="10"
                placeholder="Inserire qui la richiesta di informazioni per il proprietario"></textarea>
        </div>
        <button @click="sendMessage" class="btn btn-primary">Invia</button>
    </div>
</template>

<style scoped>
.form-container {
    max-width: 1000px;
    margin: auto;
    margin-top: 7em;
}
</style>
