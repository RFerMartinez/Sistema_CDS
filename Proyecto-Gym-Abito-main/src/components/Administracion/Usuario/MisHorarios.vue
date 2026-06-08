<template>
  <div class="contenedor">
    <Titulo texto="Mis Horarios" />
    <p class="subtitulo">Aquí podrás ver tus horarios asignados.</p>
    <div v-if="cargando" class="estado-carga">
      <div class="loader"></div>
      <p>Cargando horarios...</p>
    </div>
    
    <div v-else-if="errorCarga" class="estado-error">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ errorCarga }}</p>
    </div>

    <div v-else class="seccion-horarios">
      <TablaHorarios
        v-if="!isMobile"
        :horarios-alumno="horario"
        :suscripcion="'Día Libre'" 
      />
      
      <HorarioAlumno
        v-else
        :horarios="horario.horarios || []"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Titulo from '../Titulo.vue';
import TablaHorarios from '../Tablas y Filas/TablaHorario/TablaHorarios.vue';
import HorarioAlumno from './HorarioAlumno.vue'; // Asegúrate de ajustar la ruta si es necesario

import { obtenerHorarioCurrentUser } from '@/api/services/alumnoService';

const horario = ref({});
const cargando = ref(true);
const errorCarga = ref(null);
const isMobile = ref(false);

// Función para detectar si es pantalla de celular
const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const cargarHorarios = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    const res = await obtenerHorarioCurrentUser();
    horario.value = res;
  } catch (error) {
    errorCarga.value = 'No se pudieron cargar los horarios.';
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
  cargarHorarios();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile);
});
</script>

<style scoped>
.contenedor {
  padding: 2rem; 
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  overflow: hidden; 
  width: 100%;
}

.estado-carga, .estado-error {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.estado-error {
  color: #e50914;
}

.estado-error i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #e50914;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}
.subtitulo {
  color: #666;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .contenedor {
    width: 100%;
    padding: 1.5rem;
    margin: 0;
    box-sizing: border-box;
    background-color: transparent; /* En móvil queda mejor sin el fondo extra */
    box-shadow: none;
  }
}

@media (max-width: 480px) {
  .contenedor {
    padding: 1rem 0; /* Quitamos padding lateral para aprovechar toda la pantalla */
  }
}
/* Media query para dispositivos móviles */
@media (max-width: 768px) {
  .contenedor {
    width: 100%;
    padding: 1.5rem;
    margin: 0;
    box-sizing: border-box;
    /* RESTAURAMOS EL FONDO Y LA SOMBRA */
    background-color: rgba(255, 255, 255, 0.85); 
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }
}

@media (max-width: 480px) {
  .contenedor {
    padding: 1.2rem; /* Mantenemos un padding agradable para que no toque los bordes */
  }
}
</style>