<template>
  <nav ref="navbar" class="navbar" id="navbar">
    <div class="navbar-container">
      <!-- IZQUIERDA: Logo -->
      <div class="navbar-brand">
        <span class="brand-text">GIMNASIO</span>
        <span class="brand-accent">Abito</span>
      </div>

      <!-- Botón hamburguesa -->
      <button 
        class="hamburger-btn" 
        type="button" 
        @click="toggleMenu"
        :class="{ active: menuAbierto }"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <!-- Contenedor unificado para overlay y menú -->
    <div class="menu-wrapper" :class="{ open: menuAbierto, closing: isClosing }">
      <!-- Overlay de fondo -->
      <div class="menu-overlay" @click="closeMenu"></div>
      
      <!-- Menú móvil colapsable -->
      <div class="mobile-menu-container">
        <div class="mobile-menu">
          <div class="user-info-mobile">
          <div class="avatar-mobile">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-details-mobile">
            <span class="username-mobile">{{ nombre }} {{ apellido }}</span>
            <span class="role-mobile">{{ username }}</span>
          </div>
        </div>

        <hr class="separator" />
          
          <!-- Slot para los botones del menú -->
          <div class="menu-opciones" @click="cerrarMenuSiEsLink">
            <slot />
          </div>
          
          <button class="logout-btn" @click="handleLogout">
            <span>Cerrar sesión</span>
            <i class="fas fa-sign-out-alt icon"></i>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  nombre: String,
  apellido: String
})

const emit = defineEmits(['logout'])

const navbar = ref(null)
const menuAbierto = ref(false)
const isClosing = ref(false)

const toggleMenu = () => {
  if (menuAbierto.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

const openMenu = () => {
  isClosing.value = false
  menuAbierto.value = true
  document.body.style.overflow = 'hidden'
}

const closeMenu = () => {
  if (menuAbierto.value) {
    isClosing.value = true
    document.body.style.overflow = ''
    setTimeout(() => {
      menuAbierto.value = false
      isClosing.value = false
    }, 400)
  }
}

const handleLogout = () => {
  closeMenu()
  emit('logout')
}

// Cerrar menú cuando se hace clic en un botón del menú
const cerrarMenuSiEsLink = (event) => {
  if (event.target.classList.contains('menu-btn')) {
    closeMenu()
  }
}

// Cerrar menú con la tecla Escape
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuAbierto.value) {
      closeMenu()
    }
  })
  
  // Mejorar el comportamiento del scroll
  let lastScrollY = window.scrollY
  let ticking = false
  
  const updateNavbar = () => {
    const scrollY = window.scrollY
    
    if (navbar.value && !menuAbierto.value) {
      if (scrollY <= 50) {
        navbar.value.style.transform = 'translateY(0)'
        navbar.value.style.opacity = '1'
        navbar.value.style.visibility = 'visible'
      } else if (scrollY > lastScrollY && scrollY > 100) {
        navbar.value.style.transform = 'translateY(-100%)'
        navbar.value.style.opacity = '0'
        navbar.value.style.visibility = 'hidden'
      } else {
        navbar.value.style.transform = 'translateY(0)'
        navbar.value.style.opacity = '1'
        navbar.value.style.visibility = 'visible'
      }
    }
    
    lastScrollY = scrollY
    ticking = false
  }
  
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar)
      ticking = true
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true })
})
</script>

<style scoped>
.separator {
border: none;
height: 3px;
background-color: rgba(255, 255, 255, 0.5); /* Más sutil */
margin: 2rem 0; /* Espacio vertical */
}

.navbar {
position: fixed;
top: 0;
left: 0;
width: 100%;
background: rgba(31, 41, 55, 0.95);
backdrop-filter: blur(20px);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
z-index: 1000;
padding: 1rem 1.5rem;
}

.navbar-container {
display: flex;
justify-content: space-between;
align-items: center;
max-width: 1200px;
margin: 0 auto;
gap: 2rem;
}

.navbar-brand {
display: flex;
align-items: center;
gap: 0.5rem;
flex-grow: 1;
}

.brand-text {
font-size: 1.4rem;
font-weight: 700;
color: #ffffff;
font-family: 'Poppins', sans-serif;
letter-spacing: -0.5px;
}

.brand-accent {
font-size: 1.4rem;
font-weight: 700;
color: #e50914;
font-family: 'Poppins', sans-serif;
letter-spacing: -0.5px;
}

.hamburger-btn {
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 8px;
cursor: pointer;
padding: 0.75rem;
display: flex;
flex-direction: column;
gap: 4px;
transition: all 0.3s ease;
flex-shrink: 0;
margin-left: auto;
}

.hamburger-line {
width: 20px;
height: 2px;
background: #ffffff;
transition: all 0.3s ease;
transform-origin: center;
}

.hamburger-btn.active .hamburger-line:nth-child(1) {
transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-btn.active .hamburger-line:nth-child(2) {
opacity: 0;
}

.hamburger-btn.active .hamburger-line:nth-child(3) {
transform: rotate(-45deg) translate(6px, -6px);
}

.hamburger-btn:hover {
background: rgba(229, 9, 20, 0.1);
border-color: rgba(229, 9, 20, 0.3);
}

.hamburger-btn:hover .hamburger-line {
background: #e50914;
}

.menu-wrapper {
position: absolute;
top: 100%;
left: 0;
width: 100%;
z-index: 1000;
opacity: 0;
visibility: hidden;
transition: all 0.4s ease;
}

.menu-wrapper.open {
opacity: 1;
visibility: visible;
}

.menu-wrapper.closing {
opacity: 0;
visibility: hidden;
transition: all 0.4s ease;
}

/* Overlay de fondo oscuro */
.menu-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100vh;
background-color: rgba(0, 0, 0, 0);
transition: background-color 0.4s ease;
z-index: 999;
}

.menu-wrapper.open .menu-overlay {
background-color: rgba(0, 0, 0, 0.5);
}

.menu-wrapper.closing .menu-overlay {
background-color: rgba(0, 0, 0, 0);
transition: background-color 0.4s ease;
}

/* Contenedor del menú móvil - POSICIÓN CORREGIDA */
.mobile-menu-container {
position: relative;
z-index: 1000;
opacity: 0;
transform: translateY(-20px);
max-height: 0;

/* --- CORRECCIÓN 1: Añadido overflow-y --- */
overflow-y: auto;
-webkit-overflow-scrolling: touch; /* Para scroll suave en iOS */

transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
padding: 0 15px;
}

.menu-wrapper.open .mobile-menu-container {
opacity: 1;
transform: translateY(0);

/* --- CORRECCIÓN 2: Cambiado de 630px a vh --- */
/* 100vh menos 80px (aprox 70px de navbar + 10px de margen) */
max-height: calc(100vh - 80px);
}

.menu-wrapper.closing .mobile-menu-container {
opacity: 0;
transform: translateY(-20px);
max-height: 0;
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Estilos del menú - DISEÑO PROFESIONAL */
.mobile-menu {
background: rgba(31, 41, 55, 0.8);
backdrop-filter: blur(30px);
padding: 2rem;
border-radius: 16px;
border: 1px solid rgba(255, 255, 255, 0.15);
box-shadow: 
0 25px 50px rgba(0, 0, 0, 0.5),
0 0 0 1px rgba(255, 255, 255, 0.05);
margin-top: 10px;
/* CORRECCIÓN 3: 
Como el scroll está en el container, quitamos el 
overflow del menú mismo para evitar doble scrollbar.
*/
}

.user-info {
text-align: center;
margin-bottom: 2rem;
padding-bottom: 1.5rem;
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.username {
font-size: 1.3rem;
font-weight: 600;
color: rgba(255, 255, 255, 0.95);
font-family: 'Inter', sans-serif;
letter-spacing: -0.3px;
}

.menu-opciones {
display: flex;
flex-direction: column;
gap: 0.5rem;
margin-bottom: 2rem;
}



/* 3. Style for the User Info Card (copied from Sidebar, renamed classes) */
.user-info-mobile {
display: flex;
align-items: center;
gap: 0.8rem;
padding-bottom: 1.5rem; /* Space below card */
margin-bottom: 1rem; /* Reduced space before menu items */
border-bottom: 1px solid rgba(255, 255, 255, 0.1); 
flex-shrink: 0; 
/* Added background/border like Sidebar's user-info */
padding: 0.8rem; 
background: rgba(255, 255, 255, 0.05); 
border-radius: 8px;
border: 1px solid rgba(255, 255, 255, 0.1); 
}

.avatar-mobile {
width: 40px; /* Slightly larger for touch */
height: 40px;
background: #4b5563; 
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
color: #e5e7eb;
font-size: 1.2rem;
flex-shrink: 0;
}
.avatar-mobile i { line-height: 1; }

.user-details-mobile {
flex-grow: 1;
display: flex;
flex-direction: column;
overflow: hidden;
}

.username-mobile {
font-size: 0.95rem; /* Slightly larger */
font-weight: 600;
color: #ffffff; 
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.role-mobile {
font-size: 0.8rem; /* Consistent size */
color: #9ca3af; 
margin-top: 2px;
font-weight: 400;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

/* Estilos para los botones que vienen del slot */
.menu-opciones >>> .menu-btn {
background: none;
border: none;
color: rgba(255, 255, 255, 0.8);
font-family: 'Inter', sans-serif;
font-size: 1.1rem;
text-align: left;
padding: 1.1rem 1.5rem;
cursor: pointer;
transition: all 0.3s ease;
border-radius: 10px;
font-weight: 500;
width: 100%;
display: flex;
align-items: center;
gap: 1rem;
position: relative;
overflow: hidden;
}

.menu-opciones >>> .menu-btn::before {
content: '';
position: absolute;
left: 0;
top: 0;
height: 100%;
width: 0;
background: linear-gradient(90deg, rgba(229, 9, 20, 0.15), transparent);
transition: width 0.3s ease;
}

.menu-opciones >>> .menu-btn:hover {
color: #ffffff;
background: rgba(255, 255, 255, 0.08);
transform: translateX(8px);
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.menu-opciones >>> .menu-btn:hover::before {
width: 5px;
}

.menu-opciones >>> .menu-btn.activo {
background: rgba(229, 9, 20, 0.2);
color: #e50914;
box-shadow: 
0 4px 15px rgba(229, 9, 20, 0.25),
inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.menu-opciones >>> .menu-btn.activo::before {
width: 5px;
background: linear-gradient(90deg, #e50914, transparent);
}

.logout-btn {
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.2);
color: rgba(255, 255, 255, 0.9);
padding: 1.1rem 1.5rem;
font-size: 1.1rem;
font-family: 'Inter', sans-serif;
font-weight: 500;
border-radius: 10px;
cursor: pointer;
transition: all 0.3s ease;
display: flex;
align-items: center;
justify-content: space-between;
width: 100%;
margin-top: 1rem;
}

.logout-btn:hover {
background: rgba(229, 9, 20, 0.15);
border-color: rgba(229, 9, 20, 0.4);
color: #e50914;
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(229, 9, 20, 0.25);
}

.logout-icon {
width: 18px;
height: 18px;
opacity: 0.8;
transition: all 0.3s ease;
}

.logout-btn:hover .logout-icon {
opacity: 1;
transform: translateX(2px);
}

/* Responsive */
@media (min-width: 769px) {
.navbar {
display: none;
}

.menu-wrapper {
display: none;
}
}

/* Para pantallas muy pequeñas */
@media (max-width: 480px) {
.navbar-container {
gap: 1rem;
padding: 0 0.5rem;
}

.brand-text,
.brand-accent {
font-size: 1.2rem;
}

.mobile-menu {
padding: 1.5rem;
margin: 5px;
}

.mobile-menu-container {
padding: 0 10px;
}
}
</style>