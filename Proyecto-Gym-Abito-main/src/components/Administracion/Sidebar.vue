<template>
  <div class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
    
    <button class="collapse-btn" @click="toggleCollapse" title="Contraer/Expandir">
      <i class="fas fa-chevron-left"></i>
    </button>

    <Transition name="content-fade" mode="out-in">

      <div v-if="!isCollapsed" key="expanded" class="main-content">
        <div class="logo-container">
          <img src="../../assets/logo.png" alt="Logo" class="logo" />
        </div>

        <nav class="menu">
          <slot /> 
        </nav>

        <div class="user-info">
          <div class="avatar">
            <i class="fas fa-user"></i> 
          </div>
          <div class="user-details">
            <span class="username">{{ nombre }} {{ apellido }}</span>
            <span class="role">{{ username }}</span>
          </div>
          <button class="logout-btn-small" @click="cerrarSesion" title="Cerrar sesión">
              <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
      
      <div v-else key="collapsed" class="collapsed-content">
        <div class="logo-vertical-collapsed">
          <span class="brand-text-vertical-char">G</span>
          <span class="brand-text-vertical-char">I</span>
          <span class="brand-text-vertical-char">M</span>
          <span class="brand-text-vertical-char">N</span>
          <span class="brand-text-vertical-char">A</span>
          <span class="brand-text-vertical-char">S</span>
          <span class="brand-text-vertical-char">I</span>
          <span class="brand-text-vertical-char">O</span>
          <span class="brand-accent-vertical-char">A</span>
          <span class="brand-accent-vertical-char">b</span>
          <span class="brand-accent-vertical-char">i</span>
          <span class="brand-accent-vertical-char">t</span>
          <span class="brand-accent-vertical-char">o</span>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUser } from '@/api/storage/userStorage'; 


const emit = defineEmits(['logout', 'cambiarVista', 'update:isCollapsed']);

const isCollapsed = ref(false);
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  // CORRECCIÓN: Emite el nuevo estado
  emit('update:isCollapsed', isCollapsed.value); 
}

const props = defineProps({
  nombre: String,
  apellido: String
})

const nombre = ref('');
const apellido = ref('');
const username = ref('');

onMounted(() => {
  const usuario = getUser();
  if (usuario) {
    nombre.value = usuario.nombre;
    apellido.value = usuario.apellido;
    username.value = "cerrar sesion"; // O usa usuario.username si existe
  }
});

function cambiarVista(vista) {
  emit('cambiarVista', vista);
}

function cerrarSesion() {
  emit('logout');
}
</script>

<style scoped>
/* Estilos generales del Sidebar */
.sidebar {
  width: 250px; 
  height: 100vh;
  background: rgba(31, 41, 55, 0.8); 
  backdrop-filter: blur(15px); 
  color: #e5e7eb; 
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem; 
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1); 
  z-index: 1000;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.3); 
  transition: width 0.3s ease-in-out, padding 0.3s ease-in-out;
  overflow: hidden; 
}

/* --- Botón de colapso --- */
.collapse-btn {
  position: absolute;
  /* Posición EXPANDIDA: al costado, discreto */
  top: 70px; 
  right: -15px; 
  width: 30px;
  height: 30px;
  background: #2b3749;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  /* Transición para la posición y rotación */
  transition: all 0.3s ease-in-out;
}
.collapse-btn:hover {
  background: #e50914; 
}
.collapse-btn i {
  transition: transform 0.3s ease;
  font-size: 0.9rem;
}

/* --- Contenedores para animación --- */
/* Estos wrappers ocupan todo el espacio */
.main-content, .collapsed-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden; /* Evita desbordes durante la animación */
}
.collapsed-content {
  justify-content: flex-start; /* Alinea el logo vertical arriba */
  padding-top: 3.5rem; /* Espacio para el botón de colapso */
}

/* =================================== */
/* --- ESTADO EXPANDIDO (Default) --- */
/* =================================== */

.logo-container {
  text-align: center;
  margin-bottom: 1rem;
  position: relative; 
  height: 85px; 
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; 
  flex-shrink: 0; 
}
.logo {
  max-width: 80%;
  height: auto;
  max-height: 85px; 
}
.menu {
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
  gap: 0.5rem; 
  overflow-y: auto; 
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #4b5563 #1f2937;
}
.menu::-webkit-scrollbar {
  width: 5px;
}
.menu::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 10px;
}
.menu::-webkit-scrollbar-thumb {
  background-color: #4b5563;
  border-radius: 10px;
}

.menu-btn {
  background: none;
  border: none;
  color: #d1d5db; 
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem; 
  text-align: left;
  padding: 0.8rem 1rem; 
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px; 
  font-weight: 500;
  width: 100%;
  display: flex; 
  align-items: center; 
  gap: 0.8rem; 
  white-space: nowrap; 
  overflow: hidden;
}
.menu-btn:hover {
  color: #ffffff; 
  background: #374151; 
}
.menu-btn.activo {
  background: linear-gradient(90deg, #a8161d 0%, #f81f2c 100%); 
  color: #ffffff;
  font-weight: 400;
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3); 
}
.menu-btn .icon {
  width: 18px; 
  text-align: center;
  color: #9ca3af; 
  transition: color 0.2s ease;
  flex-shrink: 0; 
}
.menu-btn.activo .icon {
  color: #ffffff;
}
.menu-btn:hover .icon {
  color: #ffffff;
}
.profile-btn {
  margin-top: auto; 
}
.user-info {
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05); 
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1); 
  overflow: hidden;
  flex-shrink: 0; 
}
.avatar {
  width: 36px;
  height: 36px;
  background: #4b5563; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e5e7eb;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.avatar i { line-height: 1; } 
.user-details {
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  overflow: hidden;
}
.username {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis; 
  max-width: 130px; 
}
.role { 
  font-size: 0.75rem;
  color: #9ca3af;
}
.logout-btn-small {
  background: none;
  border: none;
  color: #9ca3af; 
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: auto; 
  transition: all 0.2s ease;
  line-height: 1; 
  flex-shrink: 0;
}
.logout-btn-small:hover {
  color: #ffffff; 
}

/* Estilos Deep (para slots) */
:deep(.menu-btn) {
  background: none;
  border: none;
  color: #d1d5db; 
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem; 
  text-align: left;
  padding: 0.5rem 1rem; 
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px; 
  font-weight: 500;
  width: 100%;
  display: flex; 
  align-items: center; 
  gap: 0.8rem; 
  white-space: nowrap;
  overflow: hidden;
}
:deep(.menu-btn:hover) {
  color: #ffffff; 
  background: rgba(255, 255, 255, 0.05); 
}
:deep(.menu-btn.activo) {
  background: linear-gradient(90deg, #a70b13 1%, rgba(31, 41, 55, 0.8) 60%); 
  color: #ffffff;
  font-weight: 400;
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3); 
}
:deep(.menu-btn.activo .icon) { 
  color: #ffffff;
}
:deep(.menu-btn .icon) {
  width: 18px; 
  text-align: center;
  color: #9ca3af; 
  transition: color 0.2s ease;
  flex-shrink: 0;
}
:deep(.menu-btn:hover .icon) {
   color: #ffffff; 
}


/* =================================== */
/* --- ESTADO COLAPSADO --- */
/* =================================== */

.sidebar.is-collapsed {
  width: 70px; /* Más fina */
  padding: 1.5rem 0.5rem; /* Padding lateral más angosto */
}

/* Botón colapsado: Arriba y centrado */
.sidebar.is-collapsed .collapse-btn {
  top: 1.5rem;
  right: 50%;
  transform: translateX(50%); /* Centrado */
  border-width: 2px;
}
.sidebar.is-collapsed .collapse-btn i {
  transform: rotate(180deg);
}

/* Logo Vertical Colapsado */
.logo-vertical-collapsed {
  display: flex;
  flex-direction: column; 
  align-items: center;
  justify-content: flex-start; /* Alineado arriba */
  height: 100%;
  user-select: none; 
  overflow: hidden; 
  width: 100%; /* Ocupa el 100% de la barra colapsada */
  position: relative; /* Cambiado de absolute a relative */
}
/* Letras más grandes y gorditas */
.brand-text-vertical-char,
.brand-accent-vertical-char {
  font-size: 1.6rem; /* Más grande */
  font-weight: 700; /* Más gordito */
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;
  line-height: 1.1; 
  display: block; 
}
.brand-text-vertical-char {
  color: #ffffff;
}
.brand-accent-vertical-char {
  color: #e50914; /* Rojo */
}

/* =================================== */
/* --- ANIMACIONES DE TRANSICIÓN --- */
/* =================================== */

/* Animación para el contenido que aparece/desaparece */
.content-fade-enter-active,
.content-fade-leave-active {
  transition: all 0.2s ease-out;
}
.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>