<template>
  <header :class="{'header-main': true, 'scrolled': isScrolled, 'mobile': isMobile}">
    <div class="container">

      <!-- Logo a Sinistra dell'header -->
      <div class="logo">
        <img src="../assets/img/Logo_BoolBnB_.png" alt="Logo">
      </div>

      <!-- Navigazione -->
      <nav class="navigation" v-if="!isMobile">
        <ul>
          <li class="me-3" v-for="navlink in navLinks" :key="navlink.name">
            <router-link :to="{ name: navlink.name }">
              {{ navlink.label }}
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Azioni -->
      <div class="actions">
        <a v-if="!isMobile" href="http://localhost:8000/login" class="btn-primary">Accedi</a>
        <a v-if="!isMobile" href="http://localhost:8000/register" class="btn-primary">Registrati</a>
        <div class="menu-toggle" v-if="isMobile" @click="toggleSidebar">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

    </div>

    <transition name="slide">
      <aside v-if="isSidebarOpen" class="sidebar">
        <div class="sidebar-header">
          <h2>Menu</h2>
          <button @click="toggleSidebar" class="close-btn">&times;</button>
        </div>
        <ul>
          <li class="me-3" v-for="navlink in navLinks" :key="navlink.name">
            <router-link :to="{ name: navlink.name }">
              {{ navlink.label }}
            </router-link>
          </li>
          <li>
            <a href="http://localhost:8000/login">Accedi</a>
          </li>
          <li>
            <a href="http://localhost:8000/register">Registrati</a>
          </li>
        </ul>
      </aside>
    </transition>
  </header>
</template>

<script>
export default {
  name: 'HeaderMain',
  data() {
    return {
      navLinks: [
        { label: "Home", name: "home" },
        { label: "Chi siamo", name: "chi siamo" },
        { label: "Contatti", name: "contatti" },
      ],
      isScrolled: false,
      isSidebarOpen: false,
      isMobile: window.innerWidth < 992, // controllo delle dimensioni
    };
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.checkMobile); // controllo delle dimensioni
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 992; // controllo per la risoluzione per i dispositivi mobile
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
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

  &.scrolled {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .container {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 2rem; 
  }

  .logo img {
    height: 40px;
  }

  .navigation {
    ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        margin-left: 2rem;

        a {
          text-decoration: none;
          color: #ffffff;
          font-weight: 500;
          transition: color 0.3s;

          &:hover {
            color: #dda3b2;
          }
        }
      }
    }
  }

  .actions {
    display: flex;
    align-items: center;

    .btn-primary {
      padding: 0.3rem 0.8rem; 
      background-color: #a34a62;
      color: #fefbfa;
      text-decoration: none;
      border: 2px solid transparent;
      border-radius: 1rem;
      transition: background-color 0.3s, border-color 0.3s;

      &:hover {
        border-color: #a34a62;
        background-color: #002b4d;
      }

      margin-left: 1rem;
    }

    .menu-toggle {
      display: flex; 
      flex-direction: column;
      cursor: pointer;
      margin-left: 1rem;

      span {
        height: 3px;
        width: 25px;
        background: #ffffff;
        margin-bottom: 5px;
        border-radius: 2px;
        transition: all 0.3s;
      }
    }
  }
}

/* Sidebar per mobile */
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 300px;
  height: 100%;
  background-color: #fefbfa;
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  padding: 1rem;
  z-index: 999;

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
      color: #003f6c;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #003f6c;
    }
  }

  ul {
    list-style: none;
    padding: 1rem 0;

    li {
      margin-bottom: 1rem;

      a {
        text-decoration: none;
        color: #003f6c;
        font-size: 1.2rem;

        &:hover {
          color: #a34a62;
        }
      }
    }
  }
}

/* Animazioni delle Sidebar */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter {
  transform: translateX(100%);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(100%);
}

/* Media Queries per layout mobile */
@media (max-width: 992px) {
  .navigation {
    display: none; 
  }

  .actions {
    .btn-primary {
      display: none; 
    }

    .menu-toggle {
      display: flex; 
    }
  }
}
</style>
