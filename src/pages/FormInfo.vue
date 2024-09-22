<template>
  <div class="background-animation">
    <div class="form-container content-wrapper-form">
      <transition name="fade">
        <div class="form-content" key="form">
          <h2 class="form-title">
            <i class="fas fa-envelope-open-text animated-icon"></i>
            Contatta il Proprietario
          </h2>
          <div class="mb-3">
            <label for="name" class="form-label">
              <i class="fas fa-user"></i> Nome Cliente
            </label>
            <input
              v-model="name"
              type="text"
              class="form-control"
              id="name"
              placeholder="Inserire il proprio nome"
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">
              <i class="fas fa-envelope"></i> Email Cliente
            </label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              id="email"
              placeholder="user@example.com"
            />
          </div>
          <div class="mb-3">
            <label for="message" class="form-label">
              <i class="fas fa-info-circle"></i> Richiesta Informazioni
            </label>
            <textarea
              v-model="message"
              class="form-control"
              id="message"
              rows="5"
              placeholder="Inserire qui la richiesta di informazioni per il proprietario"
            ></textarea>
          </div>
          <!-- Pulsante centrato -->
          <div class="d-flex justify-content-center">
            <button @click="sendMessage" class="btn btn-primary btn-lg animated-button">
              <i class="fas fa-paper-plane"></i> Invia
            </button>
          </div>
        </div>
      </transition>

      <!-- Modale di conferma invio messaggio -->
      <transition name="modal">
        <div v-if="showModal" class="modal-backdrop">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <i class="fas fa-check-circle animated-icon"></i> Messaggio Inviato
                </h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
              </div>
              <div class="modal-body">
                <p>Il tuo messaggio è stato inviato con successo! Verrai reindirizzato alla homepage.</p>
              </div>
              <div class="modal-footer">
                <button @click="closeModal" class="btn btn-secondary">
                  <i class="fas fa-times"></i> Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

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
    console.log("ID dell'appartamento:", this.apartment_id);
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
          alert("Errore durante l'invio del messaggio.");
        }
      } catch (error) {
        console.error('Errore di connessione:', error);
        alert('Errore di connessione.');
      }
    },
    closeModal() {
      this.showModal = false; // Chiude la modale
    },
  },
};
</script>

<style scoped>
/* Palette di colori */
:root {
  --rosa-chiaro: #ffc0cb;
  --blu-notte: #191970;
  --grigio-fumo: #708090;
}

/* Background animato */
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #ffc0cb, #d3d3d3, #6969e6);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Animazioni */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.5s;
}
.modal-enter {
  opacity: 0;
  transform: translateY(-50px);
}
.modal-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

/* Container del form */
.form-container {
  /* max-width: 30rem; */
  width: 100vh;
  height: 43rem;
  margin: auto;
  padding: 3rem;
  background-color: whitesmoke;
  border: pink 4px solid;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1s ease-in;
  position: relative;
  z-index: 1;
}

/* Titolo del form */
.form-title {
  text-align: center;
  color: var(--blu-notte);
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  animation: slideDown 1s ease-out;
}

.animated-icon {
  color: var(--rosa-chiaro);
  animation: iconBounce 2s infinite;
}

/* Input e textarea */
.form-control {
  border: 1px solid var(--blu-notte);
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: rgba(255, 255, 255, 0.9);
  border: #ffc0cb 2px solid;
}
.form-control:focus {
  border-color: var(--rosa-chiaro);
  box-shadow: 0 0 5px var(--rosa-chiaro);
}

/* Etichette */
.form-label {
  color: var(--blu-notte);
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.form-label i {
  color: var(--blu-notte);
  transition: transform 0.3s;
}
.form-label i:hover {
  animation: iconBounce 2s infinite;
}

/* Pulsanti */
.btn-primary {
  background-color: var(--blu-notte);
  border: none;
  transition: background-color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(160, 81, 81);

}
.btn-primary:hover {
  background-color: var(--rosa-chiaro);
  color: var(--blu-notte);
  transform: scale(1.55);
}
.animated-button:active {
  transform: scale(0.95);
}

.btn-secondary {
  background-color: var(--grigio-fumo);
  border: none;
  color: white;
  transition: background-color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-secondary:hover {
  background-color: var(--blu-notte);
}
.btn-secondary:active {
  transform: scale(0.95);
}

/* Modale */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background-color: whitesmoke;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  /* max-width: 500px; */
  width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.5s forwards;
}

.modal-title {
  font-size: 1.75rem;
  color: var(--blu-notte);
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.modal-body p {
  color: var(--blu-notte);
  font-size: 1.1rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes iconBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Icone animate */
.animated-icon {
  animation: iconBounce 2s infinite;
}
</style>