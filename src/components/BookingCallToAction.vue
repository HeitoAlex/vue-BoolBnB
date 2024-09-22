<template>
    <div class="cta-container">
      <div class="cta-content">
        <h2 class="cta-title">Prenota il Tuo Appartamento Ideale</h2>
        <p class="cta-description">
          Scopri una vasta selezione di appartamenti perfetti per le tue esigenze. Prenota ora e assicurati la migliore offerta!
        </p>
        <a href="/AdvancedSearch" class="search-button">Cerca un Appartamento</a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "BookingCallToAction",
  };
  </script>
  
  <style scoped>
  /* colori */
  :root {
    --light-pink: #ffb6c1;
    --midnight-blue: #191970;
    --smoke-grey: #708090;
    --button-hover: rgba(255, 182, 193, 0.8);
  }
  
  /* Container con lo sfondo */
  .cta-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5rem;
    height: 25rem; 
    background: linear-gradient(135deg, var(--midnight-blue) 0%, var(--light-pink) 100%);
    border-radius: .2rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  /* Contenuto centrato */
  .cta-content {
    text-align: center;
    color: white;
    max-width: 600px;
  }
  
  /* Titolo */
  .cta-title {
    font-size: 2rem;
    margin-bottom: 20px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  /* Descrizione */
  .cta-description {
    font-size: 1.1rem;
    margin-bottom: 30px;
    line-height: 1.5;
  }
  
  /* Pulsante */
  .search-button {
    display: inline-block;
    padding: 12px 30px;
    background-color: var(--light-pink);
    color: var(--midnight-blue);
    border: none;
    border-radius: 50px;
    text-decoration: none;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .search-button:hover {
    background-color: #a34a62;
    color: whitesmoke;
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  /* Responsività */
  @media (max-width: 768px) {
    .cta-container {
      height: auto;
      padding: 30px 20px;
    }
  
    .cta-title {
      font-size: 1.5rem;
    }
  
    .cta-description {
      font-size: 1rem;
    }
  
    .search-button {
      padding: 10px 25px;
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    .cta-title {
      font-size: 1.3rem;
    }
  
    .cta-description {
      font-size: 0.95rem;
    }
  
    .search-button {
      padding: 8px 20px;
      font-size: 0.85rem;
    }
  }
  </style>
  