
<script>
        export default {
          name: 'HeaderMain',
          data() {
            return {
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



<!-- # Contenuto HTML --------------------------------------------------------- -->
<template>
    <header :class="{'header-main': true, 'scrolled': isScrolled}">
      <div class="container">
        <div class="logo">
          <img src="../assets/img/Logo_BoolBnB_.png" alt="Logo">
        </div>
        <nav class="navigation">
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li class="dropdown" @mouseenter="openDropdown('services')" @mouseleave="closeDropdown">
              <a href="#">Servizi</a>
              <ul v-if="activeDropdown === 'services'" class="dropdown-menu">
                <li><a href="#">Cerca Appartamento</a></li>
                <li><a href="#">Crea Appartamento</a></li>
                <li><a href="#">Acquista Sponsor</a></li>
              </ul>
            </li>
            <li>
              <a href="#">Chi Siamo</a>
            </li>
            <li>
              <a href="#">Contatti</a>
            </li>
          </ul>
        </nav>
        <div class="actions">
          <button class="btn-secondary">Accedi</button>
          <button class="btn-primary">Registrati</button>
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
            <li><a href="#">Home</a></li>
            <li><a href="#">Servizi</a></li>
            <li><a href="#">Chi Siamo</a></li>
            <li><a href="#">Contatti</a></li>
          </ul>
        </aside>
      </transition>
    </header>
</template>
<!-- # Contenuto HTML --------------------------------------------------------- -->

  
  
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
          position: relative;
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
  
          &.dropdown {
            cursor: pointer;
  
            .dropdown-menu {
              position: absolute;
              top: 100%;
              left: 0;
              background-color: #a34a62;
              border: 1px solid #ffffff;
              border-radius: 4px;
              overflow: hidden;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  
              li {
                margin: 0;
  
                a {
                  display: block;
                  padding: 0.75rem 1.5rem;
                  color: #f5f5f5;
  
                  &:hover {
                    background-color: #f0f0f0;
                    color: #a34a62;
                  }
                }
              }
            }
          }
        }
      }
    }
  
    .actions {
      display: flex;
      align-items: center;
  
      .btn-primary, .btn-secondary {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s;
      }
  
      .btn-primary {
        background-color: #a34a62;
        color: #fefbfa;
        margin-left: .6rem;
        border: 2px solid transparent; /* Bordo iniziale trasparente */
        border-radius: 1rem;
  
        &:hover {
          border-color: #a34a62; /* colorazione del bordo in hover */
          background-color: #002b4d;
        }
      }
  
      .btn-secondary {
        background-color: #a34a62;
        color: #fefbfa;
        border: 2px solid transparent; /* Bordo iniziale trasparente */
        border-radius: 1rem;
  
        &:hover {
          background-color: #002b4d;
          border-color: #a34a62; /* colorazione del bordo in hover */
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
      .btn-primary,
      .btn-secondary {
        display: none;
      }
  
      .menu-toggle {
        display: flex;
      }
    }
  }
</style>  