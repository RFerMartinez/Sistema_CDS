<template>
  <div class="contenedor">
    <div class="encabezado">
      <Titulo texto="Avisos" />
      <p class="subtitulo">Ultimas novedades y noticias del gimnasio</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <span>Cargando avisos...</span>
    </div>

    <div v-else-if="error" class="error-container">
      <p>No se pudieron cargar los avisos. Intenta nuevamente más tarde.</p>
    </div>

    <div v-else-if="avisos.length === 0" class="empty-state">
      <p>No hay avisos recientes.</p>
    </div>

    <div v-else class="lista-avisos">
      <Aviso
        v-for="aviso in avisos"
        :key="aviso.idAviso" 
        :aviso="aviso"
        :showControls="false" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Titulo from '../Titulo.vue'; // Ajusta la ruta si es necesario (según tu estructura de carpetas)
import Aviso from '../Admin/Avisos/Aviso.vue'; // Reutilizamos el componente visual

// Importamos el servicio real y los formateadores
import { listarAvisos } from '@/api/services/avisosService';
import { formatearFecha, formatearHora } from '@/utils/formatters';

// --- Refs de Estado ---
const avisos = ref([]);
const loading = ref(true);
const error = ref(false);

const cargarAvisos = async () => {
  loading.value = true;
  error.value = false;
  try {
    // Llamada a la API real
    const data = await listarAvisos();
    
    // Procesamos los datos para formatear fechas y horas
    avisos.value = data.map(aviso => ({
      ...aviso,
      fecha: formatearFecha ? formatearFecha(aviso.fecha) : aviso.fecha,
      hora: formatearHora ? formatearHora(aviso.hora) : aviso.hora
    }));

  } catch (err) {
    console.error("Error al cargar los avisos:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(cargarAvisos);
</script>

<style scoped>
/* Estilos del contenedor principal */
.contenedor {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
}

.encabezado {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitulo {
  color: #666;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.lista-avisos {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Estilos simples para estados de carga/error si no son globales */
.loading-container, .error-container, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-family: 'Inter', sans-serif;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #e50914;
  animation: spin 1s ease infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .contenedor {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .contenedor {
    padding: 1rem;
  }
}
</style>