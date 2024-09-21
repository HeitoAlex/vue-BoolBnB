<template>
  <footer class="footer">
    <p> - Progetto Finale BoolBnB - </p>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
};
</script>

<style scoped>
.footer {
  background-color: #003f6c; /* Colore principale dello sfondo del footer */
  color: #fefbfa;            /* Colore del testo */
  text-align: center;        /* Allineamento del testo al centro */
  padding: 20px 0;           /* Spaziatura superiore e inferiore */

  /* Assicurarsi che il footer non si sovrapponga ad altri contenuti */
  /* Con Flexbox globale, non è necessario posizionarlo in modo fisso */

  font-size: 0.875rem;       /* Dimensione del font */
  z-index: 1000;             /* Assicura che il footer sia sopra altri elementi se necessario */
}

.footer p {
  margin: 0;
  font-size: 10px;
}
</style>
