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
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

.hero {
    width: 100%;
    height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden; 
    animation: fadeIn 1.5s ease; /* Animazione Jumbotron */
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.back-video {
    object-fit: cover;
    width: 100vw;
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
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1; 
}

.content {
    text-align: center;
    position: relative; 
    z-index: 2; 
}

.content h1 {
    cursor: pointer;
    font-size: 5rem; 
    color: #fff;
    font-weight: 600;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
    transition: 0.5s;
}

.content h1:hover {
    color: #dda3b2;
    text-shadow: 6px 6px 8px rgba(0, 0, 0, 0.7);
}

.scroll-button {
    margin-top: 20px; 
    padding: 10px 20px; 
    font-size: 1.2rem; 
    color: #fff;
    background-color: #dda3b280;
    border: none;
    border-radius: 1.2rem; 
    cursor: pointer;
    transition: background-color 0.3s ease; /* cambiamento del colore procedurale */
}

.scroll-button:hover {
    background-color: rgba(0, 0, 0, 0.5); /* Colore al passaggio del mouse */
    border: 1px solid;
    border-color: #dda3b2;
}
</style>
