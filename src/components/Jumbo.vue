<template>
    <div class="hero">
        <video autoplay loop muted playsinline class="back-video">
            <source src="../assets/img/Jumbo.mp4" type="video/mp4">
        </video>
        <div class="content">
            <h1>BoolBnB</h1>
        </div>
    </div>
</template>

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
    background-image: linear-gradient(rgba(12, 3, 51, 0.3), rgba(12, 3, 51, 0.3));
    position: relative;
    padding: 0 5%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content {
    text-align: center;
}

.content h1 {
    font-size: 160px;
    color: #fff;
    font-weight: 600;
    transition: 0.5s;
}

.content h1:hover {
    -webkit-text-stroke: 2px #fff;
    color: transparent;
}

.back-video {
    object-fit: cover;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
}
</style>