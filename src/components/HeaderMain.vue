<template>
  <header :class="{'header-main': true, 'scrolled': isScrolled}">
    <div class="container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/">
          <img src="../assets/img/Logo_BoolBnB_.png" alt="Logo">
        </router-link>
      </div>
      <!-- Pulsante Accedi -->
      <a href="http://localhost:8000/login" class="btn-primary">Accedi</a>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderMain',
  data() {
    return {
      isScrolled: false,
    };
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
  },
};
</script>

<style lang="scss" scoped>
.header-main {
  background-color: #003f6c; 
  position: fixed;
  top: 0;
  width: 100%;
  height: 4.3rem; 
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease; 
  z-index: 1000;

  @media (max-width: 992px) {
    height: 6rem;
  }

  &.scrolled {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 2rem; 

    @media (max-width: 992px) {
      flex-direction: column;
      justify-content: center;
      padding: 0 1rem;
    }
  }

  .logo img {
    height: 40px;

    @media (max-width: 992px) {
      margin-bottom: 10px;
    }
  }

  .btn-primary {
    padding: 0.3rem 0.8rem; 
    background-color: #a34a62;
    color: #fefbfa;
    text-decoration: none;
    border: 2px solid transparent;
    border-radius: 1rem;
    transition: background-color 0.3s, border-color 0.3s;
    margin-top: 0;

    &:hover {
      border-color: #a34a62;
      background-color: #002b4d;
    }

    @media (max-width: 992px) {
      width: 100%;
      text-align: center;
      margin: 0;
    }
  }
}
</style>
