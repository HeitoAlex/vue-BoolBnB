<template>
    <div class="hero">
        <video autoplay loop muted playsinline class="back-video">
            <source src="../assets/img/Jumbo.mp4" type="video/mp4">
        </video>
        <div class="overlay"></div>
        <div class="content">
            <h1>BoolBnB</h1>
            <button class="scroll-button" @click="scrollDown">Prenota Ora</button> <!-- Pulsante -->
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        scrollDown() {
            window.scrollBy({
                top: window.innerHeight, // Scorre di 100vh
                behavior: 'smooth' // Scorrimento fluido
            });
        }
    }
}
</script>

<style scoped>
.hero {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: fadeIn 1.5s ease;
}

.back-video {
  object-fit: cover;
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #003f6c50;
  z-index: 1;
}

.content {
  text-align: center;
  position: relative;
  z-index: 2;
  color: #fefbfa; /* Colore del testo */
}

.content h1 {
  font-size: 5rem;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  margin-bottom: 1rem;
}

.content h1:hover {
  color: #dda3b2;
  text-shadow: 6px 6px 8px rgba(0, 0, 0, 0.7);
}

.scroll-button {
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  color: #fefbfa;
  background-color: transparent;
  border: 2px solid #fefbfa;
  border-radius: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.scroll-button:hover {
  background-color: #dda3b2;
  color: #003f6c;
  border-color: #dda3b2;
}
</style>
