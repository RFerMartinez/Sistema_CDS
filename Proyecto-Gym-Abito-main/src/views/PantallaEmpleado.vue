<template>
  <Background>
    <div class="dashboard">
      <Sidebar
        v-if="!isMobile"
        v-model:isCollapsed="isSidebarCollapsed"
        :nombre="usuario.nombre"
        :apellido="usuario.apellido"
        @logout="pedirConfirmacionLogout"
      >
        <button
          class="menu-btn dashboard-btn"
          :class="{ activo: vistaActiva === 'dashboard' }"
          @click="cambiarVista('dashboard')"
        >
          <i class="fas fa-tachometer-alt icon"></i>
          Estadísticas
        </button>
        <hr class="separator" style="margin: 0.5rem 0;"/>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'alumnos' }"
          @click="cambiarVista('alumnos')"
        >
          <i class="fas fa-users icon"></i>
          Alumnos
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'suscripciones' }"
          @click="cambiarVista('suscripciones')"
        >
          <i class="fas fa-tags icon"></i>
          Suscripciones
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'trabajo' }"
          @click="cambiarVista('trabajo')"
        >
          <i class="fas fa-dumbbell icon"></i>
          Trabajos Metodologías
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'personas' }"
          @click="cambiarVista('personas')"
        >
          <i class="fas fa-id-card icon"></i>
          Personas
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'nuevoalumno' }"
          @click="cambiarVista('nuevoalumno')"
        >
          <i class="fas fa-user-plus icon"></i>
          Nuevo Alumno
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'modificarGrupos' }"
          @click="cambiarVista('modificarGrupos')"
        >
          <i class="fas fa-calendar-alt icon"></i>
          Modificar Grupos
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'avisos' }"
          @click="cambiarVista('avisos')"
        >
          <i class="fas fa-envelope-square icon"></i>
          Avisos
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'ReportesContables' }"
          @click="cambiarVista('ReportesContables')"
        >
          <i class="fas fa-file-invoice-dollar icon"></i>
          Reportes Contables
        </button>
      </Sidebar>

      <NavbarMobile
        v-else
        :nombre="usuario.nombre"
        :apellido="usuario.apellido"
        @logout="pedirConfirmacionLogout"
      >
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'dashboard' }"
          @click="cambiarVista('dashboard')"
        >
          <i class="fas fa-tachometer-alt icon"></i>
          Estadísticas
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'alumnos' }"
          @click="cambiarVista('alumnos')"
        >
          <i class="fas fa-users icon"></i>
          Alumnos
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'suscripciones' }"
          @click="cambiarVista('suscripciones')"
        >
          <i class="fas fa-tags icon"></i>
          Suscripciones
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'trabajo' }"
          @click="cambiarVista('trabajo')"
        >
          <i class="fas fa-dumbbell icon"></i>
          Trabajos Metodologías
        </button>
         <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'personas' }"
          @click="cambiarVista('personas')"
        >
          <i class="fas fa-id-card icon"></i>
          Personas
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'nuevoalumno' }"
          @click="cambiarVista('nuevoalumno')"
        >
          <i class="fas fa-user-plus icon"></i>
          Nuevo Alumno
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'modificarGrupos' }"
          @click="cambiarVista('modificarGrupos')"
        >
          <i class="fas fa-calendar-alt icon"></i>
          Modificar Grupos
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'avisos' }"
          @click="cambiarVista('avisos')"
        >
          <i class="fas fa-envelope-square icon"></i>
          Avisos
        </button>
        <button
          class="menu-btn"
          :class="{ activo: vistaActiva === 'ReportesContables' }"
          @click="cambiarVista('ReportesContables')"
        >
          <i class="fas fa-file-invoice-dollar icon"></i>
          Reportes Contables
        </button>
      </NavbarMobile>

      <div class="contenido" :class="{ 'contenido-mobile': isMobile, 'sidebar-collapsed': isSidebarCollapsed && !isMobile }">
        <Transition name="fade" mode="out-in">
          <component
            :is="vistaComponente"
            :key="vistaSecundaria ? (datosSecundarios?.id || datosSecundarios?.dni) : vistaActiva"
            :alumno-seleccionado="vistaSecundaria === 'infoAlumno' ? datosSecundarios : undefined"
            :personaSeleccionada="vistaSecundaria === 'ingresoPersona' ? datosSecundarios : undefined"
            :empleado-seleccionado="vistaSecundaria === 'infoEmpleado' ? datosSecundarios : undefined"
            @ver-alumno="verAlumno"
            @volver-alumnos="volverAlumnos"
            @verIngreso="verIngresoPersona"
            @volverPersonas="volverDesdeIngreso"
            @ingresoConfirmado="manejarIngresoConfirmado"
            @nuevoIngresoConfirmado="irAAlumnos"
            @cancelarIngreso="irADashboard"
            @operacionFinalizada="volverEmpleados"
          />
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
// Imports ferchu :)
import { useRouter } from 'vue-router'; // Importa useRouter
import { logout } from '@/api/services/authService'; // Importa la función de logout
import { getUser } from '@/api/storage/userStorage';
import { ref, computed, onMounted, onUnmounted } from 'vue'
// Tus imports originales (SIN CAMBIOS)
import Background from '@/components/Administracion/Background.vue'
import Sidebar from '@/components/Administracion/Sidebar.vue'
import NavbarMobile from '@/components/Administracion/NavBarMobile.vue'
import Alumnos from '@/components/Administracion/Admin/Alumnos/Alumnos.vue'
import InfoAlumno from '@/components/Administracion/Admin/Alumnos/InfoAlumno.vue'
import Suscripciones from '@/components/Administracion/Admin/SuscripcionesTrabajos/Suscripciones.vue'
import Trabajos_Metodologias from '@/components/Administracion/Admin/SuscripcionesTrabajos/Trabajos_Metodologias.vue'
import NuevoAlumno from '@/components/Administracion/Admin/NuevoAlumno.vue';
import ModificarGrupos from '@/components/Administracion/Admin/Grupos/ModificarGrupos.vue';
import Avisos from '@/components/Administracion/Admin/Avisos/AdminAvisos.vue';
import ReportesContables from '@/components/Administracion/Admin/Contabilidad/ReportesContables.vue';
// *** ===================== NUEVO: Importar Personas e IngresoPersona ===================== ***
// *** USA TUS RUTAS CORRECTAS ***
import Personas from '@/components/Administracion/Admin/Personas.vue'
import IngresoPersona from '@/components/Administracion/Admin/IngresoPersona.vue'
import Dashboard from '@/components/Administracion/Admin/Dashboard.vue'
// *****************************************************************************************

const isSidebarCollapsed = ref(false);

const router = useRouter(); // Obtén la instancia del router

// --- V V V NUEVO: LÓGICA DE MODAL LOGOUT (COPIADO DE PANTALLAUSUARIO) V V V ---
const mostrarConfirmacionLogout = ref(false);

const pedirConfirmacionLogout = () => {
  mostrarConfirmacionLogout.value = true;
};

const confirmarLogoutModal = () => {
  mostrarConfirmacionLogout.value = false;
  logout(); // Llama a la función de logout que limpia el localStorage
  router.push('/'); // Redirige al login
};

const cancelarLogoutModal = () => {
  mostrarConfirmacionLogout.value = false;
};

// Función para cerrar modal con Escape
const handleEscapeKey = (e) => {
    if (e.key === 'Escape' && mostrarConfirmacionLogout.value) {
        cancelarLogoutModal();
    }
};
// --- ^ ^ ^ FIN LÓGICA MODAL ^ ^ ^ ---


const alumnoSeleccionado = ref(null); // Para guardar el alumno al que se le hizo clic

// ... (Resto de tus IMPORTANTE, SIN CAMBIOS) ...
const usuario = ref({ nombre: '', apellido: '' });
// ... (Resto de tus IMPORTANTE, SIN CAMBIOS) ...

const vistaActiva = ref('dashboard'); // O la que prefieras como inicial
const isMobile = ref(false);

// ... (Resto de tu lógica de vistas, SIN CAMBIOS) ...
const vistaSecundaria = ref(null); 
const datosSecundarios = ref(null); 

const checkIsMobile = () => { isMobile.value = window.innerWidth <= 768; };

const cambiarVista = (vista) => {
  vistaActiva.value = vista
  vistaSecundaria.value = null;
  datosSecundarios.value = null;
  alumnoSeleccionado.value = null;
}

const verAlumno = (alumno) => {
  datosSecundarios.value = alumno;
  vistaSecundaria.value = 'infoAlumno';
  vistaActiva.value = 'alumnos';
}

const volverAlumnos = () => {
  vistaSecundaria.value = null;
  datosSecundarios.value = null;
}

const verIngresoPersona = (persona) => {
  datosSecundarios.value = persona;
  vistaSecundaria.value = 'ingresoPersona';
  vistaActiva.value = 'personas';
}

const volverDesdeIngreso = () => {
  vistaSecundaria.value = null;
  datosSecundarios.value = null;
}

const manejarIngresoConfirmado = () => {
  volverDesdeIngreso();
}
// ... (FIN LÓGICA DE VISTAS) ...


// Tu computed original (adaptado para incluir vistaSecundaria y los nuevos componentes)
const vistaComponente = computed(() => {
  if (vistaSecundaria.value === 'infoAlumno') {
    return InfoAlumno;
  }
  if (vistaSecundaria.value === 'ingresoPersona') {
    return IngresoPersona;
  }


  switch (vistaActiva.value) {
    case 'dashboard': return Dashboard;
    case 'alumnos': return Alumnos;
    case 'suscripciones': return Suscripciones;
    case 'trabajo': return Trabajos_Metodologias;
    case 'personas': return Personas; 
    case 'nuevoalumno': return NuevoAlumno;
    case 'modificarGrupos': return ModificarGrupos;
    case 'avisos': return Avisos;
    case 'ReportesContables': return ReportesContables
    default: return Alumnos;
  }
})

// Tus onMounted/onUnmounted (MODIFICADOS para incluir handleEscapeKey)
onMounted(() => { 
  // --- Cargar datos reales ---
  const user = getUser();
  if (user) {
    usuario.value.nombre = user.nombre || 'Empleado';
    usuario.value.apellido = user.apellido || '';
  }
  // --------------------------

  checkIsMobile(); 
  window.addEventListener('resize', checkIsMobile); 
  window.addEventListener('keydown', handleEscapeKey); 
});

//Para que muestre Alumnos cuando se confirma un ingreso
const irAAlumnos = () => {
  cambiarVista('alumnos');
}

const irADashboard= () => {
  cambiarVista('Dashboard');
}


//Logica PARA MSOTRAR TODO LO DE LOS EMPELADOS
const MostrarInfoEmpelado = (empleado) => {
  console.log("Datos recibidos en PantallaAdmin:", empleado);
  datosSecundarios.value = empleado;
  vistaSecundaria.value = 'infoEmpleado';
  vistaActiva.value = 'empleados'; // Mantiene 'Empleados' activo en el sidebar
}
const volverEmpleados = () => {
  vistaSecundaria.value = null;
  datosSecundarios.value = null;
  vistaActiva.value = 'empleados';
}

const MostrarNuevoEmpleado = () => {
  datosSecundarios.value = null; // No hay datos que pasar
  vistaSecundaria.value = 'nuevoEmpleado';
  vistaActiva.value = 'empleados';
}
</script>

<style scoped>
/* TUS ESTILOS ORIGINALES (SIN CAMBIOS) */
.dashboard {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.contenido {
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
  min-height: 100vh;
  width: calc(100% - 250px);
  display: flex;
  flex-direction: column;
}

.contenido-mobile {
  margin-left: 0;
  padding-top: 5rem;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 1200px) {
  .contenido {
    padding: 2rem 3rem;
  }
}

@media (max-width: 768px) {
  .contenido {
    padding: 1rem;
    width: 100%;
  }
  
  .contenido-mobile {
    padding: 1rem;
    padding-top: 5rem;
  }
}

/* V V V NUEVOS ESTILOS PARA MODAL (COPIADOS DE PANTALLAUSUARIO) V V V */
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
.modal-logout .modal-header i { color: #f44336; }
.modal-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; justify-content: center; }
.modal-header i { font-size: 2rem; }
.modal-header h3 { margin: 0; color: #2c3e50; font-size: 1.4rem; }
.modal-body { margin-bottom: 2rem; }
.modal-body p { margin: 0; font-size: 1.1rem; color: #495057; }
.modal-footer { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn-modal { padding: 0.8rem 1.5rem; border: none; border-radius: 8px; font-family: 'Poppins', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-size: 1rem; }
.btn-cancelar-modal { background: #6c757d; color: white; order: 2; }
.btn-cancelar-modal:hover { background: #5a6268; }
.btn-confirmar-logout-modal { background: #f44336; color: white; order: 1; }
.btn-confirmar-logout-modal:hover { background: #d32f2f; }
@keyframes modalAppear { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
@media (max-width: 768px) {
  .modal-confirmacion { padding: 1.5rem; margin: 1rem; }
  .modal-footer { flex-direction: column-reverse; }
}
/* ^ ^ ^ FIN NUEVOS ESTILOS ^ ^ ^ */
.contenido.sidebar-collapsed {
  /* El ancho original era 250px, el colapsado es 70px.
    Ajusta '70px' si cambiaste el ancho en Sidebar.vue
  */
  margin-left: 70px;
  width: calc(100% - 70px);
}

/* Añadimos una transición suave para que el contenido 
  se "deslice" junto con la sidebar.
*/
.contenido {
  transition: margin-left 0.3s ease-in-out, width 0.3s ease-in-out;
}
</style>