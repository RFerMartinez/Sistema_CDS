<template>
  <nav ref="navbar" class="navbar" id="navbar">
    <div class="nav-container">
      <div class="nav-left">
        <a class="nav-brand" href="#">
          <span class="brand-text">GIMNASIO</span>
          <span class="brand-accent">Abito</span>
        </a>
        <div class="nav-links">
          <a href="#metodologias" class="nav-link">Metodologías</a>
          <a href="#salon2" class="nav-link">Salon 2</a>
          <a href="#historia" class="nav-link">Historia</a>
          <a href="#precios" class="nav-link">Precios</a>
          <a href="#ubicacion" class="nav-link">Ubicacion</a>
        </div>
      </div>

      <div class="nav-right">
        <button @click="irLogin('login')" class="btn btn-login">Iniciar Sesión</button>
        <button @click="irLogin('registro')" class="btn btn-primary">Registrarse</button>
      </div>

      <button 
        class="nav-toggle" 
        type="button" 
        @click="menuAbierto = !menuAbierto"
      >
        <span class="toggle-bar"></span>
        <span class="toggle-bar"></span>
        <span class="toggle-bar"></span>
      </button>
    </div>

    <Transition name="slide">
      <div v-if="menuAbierto" class="collapse navbar-collapse mobile-menu show" id="mobileMenu">
        <div class="mobile-nav-content">
          <a href="#metodologias" class="mobile-nav-link" @click="menuAbierto = false">Metodologías</a>
          <a href="#salon2" class="mobile-nav-link" @click="menuAbierto = false">Salon 2</a>
          <a href="#historia" class="mobile-nav-link" @click="menuAbierto = false">Historia</a>
          <a href="#precios" class="mobile-nav-link" @click="menuAbierto = false">Precios</a>
          <a href="#ubicacion" class="mobile-nav-link" @click="menuAbierto = false">Ubicacion</a>
          <div class="mobile-actions">
            <button @click="irLogin('login')" class="btn btn-login mobile-btn">Iniciar Sesión</button>
            <button @click="irLogin('registro')" class="btn btn-primary mobile-btn">Registrarse</button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const navbar = ref(null)
const router = useRouter()
const menuAbierto = ref(false) // VARIABLE PARA EL TOGGLE

onMounted(() => {
  let lastScrollY = window.scrollY
  const navbarElement = navbar.value
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY
    if (navbarElement) {
      if (scrollY <= 100) {
        navbarElement.style.transform = 'translateY(0)'; navbarElement.style.opacity = '1'; navbarElement.style.visibility = 'visible'
      } else if (scrollY > lastScrollY) {
        navbarElement.style.transform = 'translateY(-100%)'; navbarElement.style.opacity = '0'; navbarElement.style.visibility = 'hidden';
        menuAbierto.value = false // Cerramos si scrollea
      } else if (scrollY > 100) {
        navbarElement.style.transform = 'translateY(-100%)'; navbarElement.style.opacity = '0'; navbarElement.style.visibility = 'hidden'
      }
    }
    lastScrollY = scrollY
  })
})

function irLogin(modo) {
  menuAbierto.value = false
  router.push({ path: '/login', query: { modo } })
}
</script>

<style scoped>
/* TODO TU CSS ORIGINAL SE MANTIENE EXACTAMENTE IGUAL */

/* SOLO AGREGAMOS ESTE BLOQUE AL FINAL PARA ACTIVAR LA ANIMACIÓN DE VUE */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Mismo tiempo que tu navbar */
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* TUS ANIMACIONES DE LAS BARRITAS (Asegúrate de que el selector coincida) */
.navbar:has(.mobile-menu.show) .nav-toggle .toggle-bar:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}
.navbar:has(.mobile-menu.show) .nav-toggle .toggle-bar:nth-child(2) {
  opacity: 0;
}
.navbar:has(.mobile-menu.show) .nav-toggle .toggle-bar:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}
/* ... resto de tu CSS original ... */
/* NAVBAR PRINCIPAL */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(31, 41, 55, 0.15);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1000;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%; /* Cambiado de 1200px a 100% */
  margin: 0 auto;
  padding: 1rem 2rem; /* Mantenemos el padding vertical pero reducimos horizontal si es necesario */
  width: 100%;
  box-sizing: border-box;
}

/* IZQUIERDA - COMPLETAMENTE A LA IZQUIERDA */
.nav-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  margin: 0;
  padding: 0;
  gap: 3rem; /* Espacio entre logo y enlaces */
}

/* DERECHA - COMPLETAMENTE A LA DERECHA */
.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  margin: 0;
  padding: 0;
  gap: 1rem;
}

/* LOGO Y MARCA - PEGADO A LA IZQUIERDA */
.nav-brand {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  margin-right: 0; /* Eliminamos el margen derecho */
}

.nav-brand:hover {
  transform: translateY(-1px);
}

.brand-text {
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

.brand-accent {
  color: #e50914;
  font-family: 'Poppins', sans-serif;
}

/* ENLACES DE NAVEGACIÓN */
.nav-links {
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #e50914, #ff4757);
  transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.nav-link:hover {
  color: #ffffff;
}

.nav-link:hover::after {
  width: 100%;
}

/* BOTONES DE ACCIÓN - PEGADOS A LA DERECHA */
.btn {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-decoration: none;
  display: inline-block;
  text-align: center;
  white-space: nowrap;
}

.btn-login {
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #e50914, #ff4757);
  color: white;
  border: 1.5px solid transparent;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ff4757, #e50914);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(229, 9, 20, 0.3);
}

/* BOTÓN HAMBURGUESA */
.nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  gap: 0.25rem;
}

.toggle-bar {
  width: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  border-radius: 1px;
}

.nav-toggle:hover .toggle-bar {
  background: #e50914;
}

/* MENÚ MÓVIL */
.mobile-menu {
  /* Fondo con desenfoque profundo en lugar de negro sólido */
  background: rgba(20, 20, 20, 0.7); 
  backdrop-filter: blur(25px) saturate(150%);
  -webkit-backdrop-filter: blur(25px) saturate(150%);
  
  /* Bordes suavizados en la parte inferior para que parezca una tarjeta flotante */
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  /* Sombra para dar profundidad */
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  
  /* Transición suave de despliegue */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.mobile-nav-content {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
/*
.mobile-nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}
*/
.mobile-nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.mobile-nav-link:hover {
  color: #e50914;
  padding-left: 0.5rem;
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-btn {
  width: 100%;
  padding: 0.9rem !important; /* Más grande para que sea fácil de tocar en móvil */
  font-size: 1rem !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .nav-container {
    padding: 1rem; /* En móvil mantenemos el padding normal */
  }
  
  .nav-links,
  .nav-right {
    display: none;
  }
  
  .nav-toggle {
    display: flex; /* Asegúrate de mantener el display flex */
    flex-direction: column;
    background: rgba(255, 255, 255, 0.08);
    padding: 0.8rem;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    gap: 0.25rem;
    cursor: pointer;
  }

  /* Busca y reemplaza el .toggle-bar que ya tenías */
  .toggle-bar {
    width: 22px;
    height: 2px;
    background: #ffffff;
    transition: all 0.3s ease;
    border-radius: 1px;
  }
  
  .nav-brand {
    font-size: 1.3rem;
  }
  
  .nav-left {
    flex: none;
    gap: 0; /* En móvil solo mostramos el logo */
  }
}

@media (min-width: 769px) {
  .nav-container {
    padding: 1rem 2rem; /* En desktop mantenemos el padding */
  }
  
  .mobile-menu {
    display: none;
  }
  
  .nav-toggle {
    display: none;
  }
}

/* Para pantallas muy grandes, podemos reducir el padding horizontal */
@media (min-width: 1400px) {
  .nav-container {
    padding: 1rem 3rem; /* Un poco más de padding en pantallas muy grandes */
  }
}

/* ANIMACIÓN PARA EL TOGGLE ACTIVO */
.navbar-collapse.show .nav-toggle .toggle-bar:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.navbar-collapse.show .nav-toggle .toggle-bar:nth-child(2) {
  opacity: 0;
}

.navbar-collapse.show .nav-toggle .toggle-bar:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* EFECTO GLASSMORPHISM MEJORADO */
.navbar.scrolled {
  background: rgba(15, 15, 15, 0.85);
  backdrop-filter: blur(15px) saturate(180%);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}
</style>