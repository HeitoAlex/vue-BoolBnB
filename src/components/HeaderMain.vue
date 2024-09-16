<script>
export default {
  name: 'HeaderMain',
  data() {
    return {
      navLinks: [
        {
          label: "Home",
          name: "home"
        },
        {
          label: "Chi siamo",
          name: "chi siamo"
        },
        {
          label: "Contatti",
          name: "contatti"
        },
      ],
      isScrolled: false,
      activeDropdown: null,
      isSidebarOpen: false,
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
    openDropdown(menu) {
      this.activeDropdown = menu;
    },
    closeDropdown() {
      this.activeDropdown = null;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
};
</script>

<template>
  <header :class="{'header-main': true, 'scrolled': isScrolled}">
    <div class="container">

      <!-- Logo a Sinistra dell'header -->
      <div class="logo">
        <img src="../assets/img/Logo_BoolBnB_.png" alt="Logo">
      </div>

      <!-- Navigazione -->
      <nav class="navigation">
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
        <!-- Bottone Login o Registrati con link a http://localhost:8000/ -->
        <a href="http://localhost:8000/" class="btn-primary">Accedi</a>

        <!-- Bottone per togglare la sidebar -->
        <div class="menu-toggle" @click="toggleSidebar">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

    </div>

    <!-- Sidebar per dispositivi mobili -->
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
        </ul>
      </aside>
    </transition>
  </header>
</template>

<style lang="scss" scoped>
.header-main {
  background-color: #003f6c;
  position: fixed;
  top: 0;
  width: 100%;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  z-index: 1000;

  &.scrolled {
    background-color: #fefbfa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
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
      padding: 0.5rem 1rem;
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
    }

    .menu-toggle {
      display: none;
      flex-direction: column;
      cursor: pointer;
      margin-left: 1rem;

      span {
        height: 3px;
        width: 25px;
        background: #003f6c;
        margin-bottom: 5px;
        border-radius: 2px;
        transition: all 0.3s;
      }
    }
  }
}

/* Sidebar per dispositivi mobili */
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

/* Transizione per la sidebar */
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
