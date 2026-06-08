<template>
  <Background>
    <div class="dashboard">
      <Sidebar
        v-if="!isMobile"
        v-model:isCollapsed="isSidebarCollapsed" :nombre="usuario.nombre"
        :apellido="usuario.apellido"
        @logout="pedirConfirmacionLogout"
      >
        <button class="menu-btn" :class="{ activo: vistaActiva === 'informacion' }" @click="vistaActiva = 'informacion'"> 
          <span class="texto-btn">
            <i class="fas fa-user icon"></i>
            Información Personal
          </span>
        </button>
        <button class="menu-btn" :class="{ activo: vistaActiva === 'horarios' }" @click="vistaActiva = 'horarios'">
          <span class="texto-btn">
            <i class="fas fa-calendar-alt icon"></i>
            Mis Horarios
          </span>
        </button>
        <button class="menu-btn" :class="{ activo: vistaActiva === 'cuotas' }" @click="vistaActiva = 'cuotas'">
          <span class="texto-btn">
            <i class="fas fa-address-book icon"></i>
            Cuotas
          </span>
        </button>
        <button class="menu-btn" :class="{ activo: vistaActiva === 'reclamos' }" @click="vistaActiva = 'reclamos'">
          <span class="texto-btn">
            <i class="fa-solid fa-box-archive icon"></i>
            Observaciones
          </span>
        </button>
        <button class="menu-btn" :class="{ activo: vistaActiva === 'avisos' }" @click="vistaActiva = 'avisos'">
          <span class="texto-btn">
            <i class="fas fa-envelope-square icon"></i>
            Avisos
          </span>
        </button>
      </Sidebar>

      <NavbarMobile
        v-else
        :nombre="usuario.nombre"
        :apellido="usuario.apellido"
        @logout="pedirConfirmacionLogout"
      >
        <button class="menu-btn" :class="{ activo: vistaActiva === 'informacion' }" @click="cambiarVista('informacion')">
            <i class="fas fa-user icon"></i>
            Información Personal 
          </button>
          <button class="menu-btn" :class="{ activo: vistaActiva === 'horarios' }" @click="vistaActiva = 'horarios'">
          <span class="texto-btn">
            <i class="fas fa-calendar-alt icon"></i>
            Mis Horarios
          </span>
        </button>
        <button class="menu-btn" :class="{ activo: vistaActiva === 'cuotas' }" @click="cambiarVista('cuotas')">
           <i class="fas fa-address-book icon"></i>
           Cuotas
        </button>
        <button class="menu-btn" :class="{ activo: vistaActiva === 'reclamos' }" @click="cambiarVista('reclamos')">
          <i class="fa-solid fa-box-archive icon"></i>
          Observaciones
        </button>
        <button class="menu-btn" :class="{ activo: vistaActiva === 'avisos' }" @click="vistaActiva = 'avisos'">
          <span class="texto-btn">
            <i class="fas fa-envelope-square icon"></i>
            Avisos
          </span>
        </button>
      </NavbarMobile>

      <div class="contenido" :class="{ 'contenido-mobile': isMobile, 'sidebar-collapsed': isSidebarCollapsed && !isMobile }">
        <Transition name="fade" mode="out-in">
          <component :is="vistaComponente" :key="vistaActiva" />
        </Transition>
      </div>

      <Transition name="modal-effect">
        <div v-if="mostrarConfirmacionLogout" class="modal-overlay">
          <div class="modal-confirmacion modal-logout">
            <div class="modal-header">
              <i class="fas fa-sign-out-alt"></i>
              <h3>Confirmar Cierre de Sesión</h3>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro que deseas cerrar sesión?</p>
            </div>
            <div class="modal-footer">
              <button class="btn-modal btn-cancelar-modal" @click="cancelarLogoutModal">
                No, Cancelar
              </button>
              <button class="btn-modal btn-confirmar-logout-modal" @click="confirmarLogoutModal">
                Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </Transition>
      </div>
  </Background>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { logout } from '@/api/services/authService'; 

import { ref, computed, onMounted, onUnmounted } from 'vue';
import Background from '@/components/Administracion/Background.vue'; 
import Sidebar from '@/components/Administracion/Sidebar.vue';
import NavbarMobile from '@/components/Administracion/NavBarMobile.vue';
import InformacionPersonal from '@/components/Administracion/Usuario/InformacionPersonal.vue';
import Cuotas from '@/components/Administracion/Usuario/Cuotas.vue';
import Reclamos from '@/components/Administracion/Usuario/Reclamos.vue';
import Horarios from '@/components/Administracion/Usuario/MisHorarios.vue';
import UsuarioAvisos from '@/components/Administracion/Usuario/UsuarioAvisos.vue';
import { getUser } from '@/api/storage/userStorage';


const router = useRouter();

// --- Estado del modal de Logout ---
const mostrarConfirmacionLogout = ref(false);

const pedirConfirmacionLogout = () => {
  mostrarConfirmacionLogout.value = true;
};

const confirmarLogoutModal = () => {
  mostrarConfirmacionLogout.value = false;
  logout(); 
  router.push('/'); 
};

const cancelarLogoutModal = () => {
  mostrarConfirmacionLogout.value = false;
};
// --- Fin Modal Logout ---

// --- AÑADIDO: Estado de la Sidebar ---
const isSidebarCollapsed = ref(false);

// Datos del usuario (mejor cargarlos si es posible)
const usuario = ref({ nombre: 'Usuario', apellido: '' }); 

onMounted(() => {
  const user = getUser();
  if (user) {
    usuario.value.nombre = user.nombre;
    usuario.value.apellido = user.apellido;
  }
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
  window.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile);
  window.removeEventListener('keydown', handleEscapeKey); 
});

// Función para cerrar modal con Escape
const handleEscapeKey = (e) => {
    if (e.key === 'Escape' && mostrarConfirmacionLogout.value) {
        cancelarLogoutModal();
    }
};


// Lógica de vistas (sin cambios)
const vistaActiva = ref('informacion');
const isMobile = ref(false);
const checkIsMobile = () => { isMobile.value = window.innerWidth <= 768; };
const cambiarVista = (vista) => { vistaActiva.value = vista; };
const vistaComponente = computed(() => {
  switch (vistaActiva.value) {
    case 'informacion': return InformacionPersonal;
    case 'cuotas': return Cuotas;
    case 'reclamos': return Reclamos;
    case 'horarios': return Horarios;
    case 'avisos': return UsuarioAvisos;
    default: return InformacionPersonal;
  }
});

</script>

<style scoped>
/* Estilos existentes de PantallaUsuario */
.dashboard { 
  display: flex; 
  min-height: 100vh; 
  width: 100%; 
}

/* CORREGIDO: Ancho de 250px y transición */
.contenido { 
  margin-left: 250px; 
  padding: 2rem; 
  flex: 1; 
  overflow-y: auto; 
  min-height: 100vh; 
  width: calc(100% - 250px); 
  display: flex; 
  flex-direction: column;
  transition: margin-left 0.3s ease-in-out, width 0.3s ease-in-out;
}

/* AÑADIDO: Estilo para contenido colapsado */
.contenido.sidebar-collapsed {
  margin-left: 70px; /* Ancho colapsado de Sidebar.vue */
  width: calc(100% - 70px);
}

.contenido-mobile { 
  margin-left: 0; 
  padding-top: 5rem; 
  width: 100%; 
}
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.4s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}
@media (min-width: 1200px) { 
  .contenido { 
    padding: 2rem 3rem; 
  } 
}
@media (max-width: 768px) { 
  .contenido { 
    margin-left: 0; 
    padding: 1rem; 
    width: 100%; 
  } 
  .contenido-mobile { 
    padding: 1rem; 
    padding-top: 5rem; 
  } 
}


/* Estilos del Modal (Sin cambios) */
.modal-overlay {
  position: fixed; 
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; 
  backdrop-filter: blur(5px);
}

.modal-confirmacion {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.3s ease;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.modal-logout .modal-header i { 
  color: #f44336; 
}
.modal-header { 
  display: flex; 
  align-items: center; 
  gap: 1rem; 
  margin-bottom: 1rem; 
  justify-content: center; 
}
.modal-header i { 
  font-size: 2rem; 
}
.modal-header h3 { 
  margin: 0; 
  color: #2c3e50; 
  font-size: 1.4rem; 
}
.modal-body { 
  margin-bottom: 2rem; 
}
.modal-body p { 
  margin: 0; 
  font-size: 1.1rem; 
  color: #495057; 
}
.modal-footer { 
  display: flex; 
  gap: 1rem; 
  justify-content: center; 
  flex-wrap: wrap; 
}
.btn-modal { 
  padding: 0.8rem 1.5rem; 
  border: none; 
  border-radius: 8px; 
  font-family: 'Poppins', sans-serif; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  font-size: 1rem; 
}
.btn-cancelar-modal { 
  background: #6c757d; 
  color: white; 
  order: 2; 
}
.btn-cancelar-modal:hover { 
  background: #5a6268; 
}
.btn-confirmar-logout-modal { 
  background: #f44336; 
  color: white; 
  order: 1; 
}
.btn-confirmar-logout-modal:hover { 
  background: #d32f2f; 
}
@keyframes modalAppear { 
  from { opacity: 0; transform: scale(0.8); } 
  to { opacity: 1; transform: scale(1); } 
}
@media (max-width: 768px) {
  .modal-confirmacion { 
    padding: 1.5rem; 
    margin: 1rem; 
  }
  .modal-footer { 
    flex-direction: column-reverse; 
  }
}
</style>