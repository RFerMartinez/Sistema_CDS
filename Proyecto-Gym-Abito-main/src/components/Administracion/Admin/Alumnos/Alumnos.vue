<template>
  <div class="contenedor-alumnos">
    <div class="encabezado-alumnos">
      <Titulo texto="ALUMNOS" />

      <div class="filtros-busqueda">
        <div class="busqueda-input-container">
          <i class="fas fa-search icono-busqueda"></i>
          <input
            v-model="terminoBusqueda"
            type="text"
            class="input-busqueda"
            placeholder="Buscar por DNI, nombre o apellido..."
            @input="aplicarFiltros"
          >
          <button
            v-if="terminoBusqueda"
            class="btn-limpiar-busqueda"
            @click="limpiarBusqueda"
            aria-label="Limpiar búsqueda"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="filtros-turno">
          <button
            class="btn-turno"
            :class="{ 'activo': filtroTurno === 'Mañana' }"
            @click="toggleTurno('Mañana')"
          >
            <i class="fas fa-sun"></i>
            Mañana
          </button>
          <button
            class="btn-turno"
            :class="{ 'activo': filtroTurno === 'Tarde' }"
            @click="toggleTurno('Tarde')"
          >
            <i class="fas fa-moon"></i>
            Tarde
          </button>
        </div>
      </div>

      <div class="controles-superiores">
        <div class="estado-alumnos-sutil">
          <div class="info-alumno-sutil">
            <span class="numero-sutil">{{ loading ? '-' : alumnosFiltrados.length }}</span>
            <span class="texto-sutil">Mostrando</span>
          </div>
          <div class="separador"></div>
          <div class="info-alumno-sutil">
            <span class="numero-sutil activo">{{ loading ? '-' : alumnosActivos }}</span>
            <span class="texto-sutil">Activos</span>
          </div>
          <div class="separador"></div>
          <div class="info-alumno-sutil">
            <span class="numero-sutil inactivo">{{ loading ? '-' : alumnosInactivos }}</span>
            <span class="texto-sutil">Inactivos</span>
          </div>
          <div class="separador"></div>
          <div class="info-alumno-sutil">
            <span class="numero-sutil deudor">{{ loading ? '-' : alumnosDeudores }}</span>
            <span class="texto-sutil">Deudores</span>
          </div>
        </div>

        <div class="botones-filtros">
            <button
              class="btn-filtrar"
              :class="{ 'activo': mostrarSoloActivos }"
              @click="toggleFiltroActivos"
              aria-label="Filtrar alumnos activos"
            >
              <i class="fas fa-user-check"></i>
              <span class="btn-texto">Solo Activos</span>
              <span class="btn-badge badge-activos" v-if="mostrarSoloActivos && !loading">{{ alumnosActivos }}</span>
            </button>

            <button
              class="btn-filtrar btn-filtrar-deudor"
              :class="{ 'activo': mostrarSoloDeudores }"
              @click="toggleFiltroDeudores"
              aria-label="Filtrar alumnos deudores"
            >
              <i class="fas fa-dollar-sign"></i>
              <span class="btn-texto">Solo Deudores</span>
              <span class="btn-badge badge-deudores" v-if="mostrarSoloDeudores && !loading">{{ alumnosDeudores }}</span>
            </button>
          </div>
        </div>
    </div>

    <TablaAlumnos
      :alumnos="alumnosFiltrados"
      :cargando="loading"
      :elementos-por-pagina="elementosPorPagina"
      :loading-text="'Cargando alumnos...'"
      :modo="'alumnos'"
      @ver-detalles="verAlumno"
    />

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TablaAlumnos from '../../Tablas y Filas/TablaAlumnosPersonas/TablaAlumnos.vue';
import { obtenerTodosLosAlumnos } from '@/api/services/alumnoService';
import Titulo from '../../Titulo.vue';
import { filterItems } from '@/utils/formatters';

const alumnos = ref([]);
const loading = ref(true); 
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

onMounted(async () => {
  loading.value = true;
  // await sleep(700) // Simulación de carga
  try {
    const respuesta = await obtenerTodosLosAlumnos();
    alumnos.value = respuesta.sort((a, b) =>
        (a.apellido || '').localeCompare(b.apellido || '') ||
        (a.nombre || '').localeCompare(b.nombre || '')
    );
  } catch (error) {
    console.error('Error al obtener los alumnos:', error);
    alumnos.value = [];
  } finally {
    loading.value = false;
  }
});

// --- LÓGICA DE FILTROS (SIN CAMBIOS) ---
const elementosPorPagina = 30; // Lo mantenemos para pasarlo como prop
const mostrarSoloActivos = ref(false);
const terminoBusqueda = ref('');
const filtroTurno = ref(null);
const mostrarSoloDeudores = ref(false);
const emit = defineEmits(['verAlumno']);

const alumnosFiltrados = computed(() => {
  if (loading.value || !alumnos.value) return [];
  const filtros = {
    turno: filtroTurno.value,
    activo: mostrarSoloActivos.value ? true : undefined,
    deudor: mostrarSoloDeudores.value ? true : undefined
  };
  return filterItems(alumnos.value, terminoBusqueda.value, filtros);
});

// --- COMPUTEDS DE ESTADÍSTICAS (SIN CAMBIOS) ---
const alumnosActivos = computed(() =>
  alumnosFiltrados.value.filter(alumno => alumno.activo).length
);
const alumnosInactivos = computed(() =>
  alumnosFiltrados.value.filter(alumno => !alumno.activo).length
);
const alumnosDeudores = computed(() =>
  alumnosFiltrados.value.filter(alumno => alumno.cuotasPendientes > 0).length
);


// --- LÓGICA DE PAGINACIÓN ELIMINADA ---
// Se eliminaron: paginaActual, totalPaginas, alumnosPaginados, numerosPaginas
// Se eliminó: cambiarPagina

// --- MÉTODOS DE FILTROS (MODIFICADOS) ---
// Se eliminó el reseteo de 'paginaActual.value = 1'
const toggleFiltroActivos = () => {
  mostrarSoloActivos.value = !mostrarSoloActivos.value;
};
const toggleTurno = (turno) => {
  filtroTurno.value = filtroTurno.value === turno ? null : turno;
};
const toggleFiltroDeudores = () => {
  mostrarSoloDeudores.value = !mostrarSoloDeudores.value;
};
const aplicarFiltros = () => { /* Ya no necesita resetear página */ };
const limpiarBusqueda = () => { terminoBusqueda.value = ''; };

const verAlumno = (alumno) => { emit('verAlumno', alumno); };
</script>

<style scoped>
/* --- Contenedor Principal --- */
.contenedor-alumnos {
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
}

/* --- Encabezado y Título --- */
.encabezado-alumnos {
  text-align: center;
  margin-bottom: 2rem;
}

/* --- Filtros (Búsqueda y Turno) --- */
.filtros-busqueda {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.busqueda-input-container {
  position: relative;
  flex: 1;
  max-width: 400px;
  min-width: 250px;
}

.icono-busqueda {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 2;
}

.input-busqueda {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: white;
  font-family: 'Poppins', sans-serif;
}

.input-busqueda:focus {
  outline: none;
  border-color: #ea280ae0;
  box-shadow: 0 0 0 3px rgba(233, 44, 30, 0.1);
}

.btn-limpiar-busqueda {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-limpiar-busqueda:hover {
  background: #f8f9fa;
  color: #e91e63;
}

.filtros-turno {
  display: flex;
  gap: 0.8rem;
}

.btn-turno {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  border: 2px solid #adb5bd; /* Gris neutral */
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #495057; /* Texto gris oscuro */
  white-space: nowrap;
}

.btn-turno:hover {
  border-color: #2c3e50; /* Gris oscuro */
  color: #2c3e50;
  background: #f8f9fa;
  transform: translateY(-1px);
}

.btn-turno.activo {
  background: #2c3e50;    /* Carbón */
  border-color: #2c3e50;
  color: white;
  box-shadow: 0 4px 10px rgba(44, 62, 80, 0.2);
}

/* --- Controles Superiores (Contadores y Botones Filtro) --- */
.controles-superiores {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.estado-alumnos-sutil {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 12px;
  padding: 0.8rem 1.5rem;
  border: 1px solid #e9ecef;
  flex: 1;
}

.info-alumno-sutil {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  flex: 1;
}

.numero-sutil {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 0.3rem;
}
.numero-sutil.activo { color: #4caf50; }
.numero-sutil.inactivo { color: #ff4d4d; }
.numero-sutil.deudor { color: #ff9800; }

.texto-sutil {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.separador {
  width: 1px;
  height: 30px;
  background: linear-gradient(to bottom, transparent 0%, #dee2e6 50%, transparent 100%);
  margin: 0 0.5rem;
}

/* Contenedor para botones de filtro */
.botones-filtros {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Estilo BASE para TODOS los botones de filtro */
.btn-filtrar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  border: 2px solid #adb5bd; /* Gris neutral */
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #495057; /* Texto gris oscuro */
  white-space: nowrap;
  position: relative;
}
.btn-filtrar .btn-texto {
  font-size: 0.85rem;
}
.btn-filtrar:hover {
  border-color: #6c757d; /* Borde gris más oscuro */
  color: #212529;
  background: #f8f9fa; /* Fondo gris suave */
  transform: translateY(-1px);
}

/* Estilo para "Solo Activos" (Verde) */
.btn-filtrar.activo:not(.btn-filtrar-deudor) {
  background: #4caf50;
  border-color: #4caf50;
  color: white;
}
.btn-filtrar.activo:not(.btn-filtrar-deudor):hover {
  background: #43a047;
  border-color: #43a047;
}

/* Estilo para "Solo Deudores" (Naranja) */
.btn-filtrar-deudor {
  border-color: #ff9800; 
  color: #ff9800; 
}
.btn-filtrar-deudor:hover {
  border-color: #fb8c00; 
  color: #fb8c00;
  background: #fff8e1;
}
.btn-filtrar.btn-filtrar-deudor.activo {
  background: #ff9800;
  border-color: #ff9800;
  color: white;
}
.btn-filtrar.btn-filtrar-deudor.activo:hover {
  background: #fb8c00;
  border-color: #fb8c00;
}

/* --- Badges (Contadores internos) --- */
.btn-badge {
  color: white;
  border-radius: 12px;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.3rem;
  transition: all 0.3s ease;
}
/* Badge "Activos" (Inactivo) */
.btn-badge.badge-activos {
  background: #4caf50;
}
/* Badge "Activos" (Activo -> INVERTIDO) */
.btn-filtrar:not(.btn-filtrar-deudor).activo .btn-badge.badge-activos {
  background: white;
  color: #4caf50; /* Texto verde */
}
/* Badge "Deudores" (Inactivo) */
.btn-badge.badge-deudores {
  background: #ff9800;
}
/* Badge "Deudores" (Activo -> INVERTIDO - CORREGIDO) */
.btn-filtrar.btn-filtrar-deudor.activo .btn-badge.badge-deudores {
  background: white;     /* Fondo blanco */
  color: #E65100; /* Texto naranja oscuro (legible) */
}


/* --- ESTILOS DE CARGA, PAGINACIÓN Y SIN RESULTADOS ELIMINADOS --- */


/* --- Responsive --- */
@media (max-width: 992px) {
  .controles-superiores {
    justify-content: center;
    flex-direction: column;
  }
  .botones-filtros {
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .contenedor-alumnos { padding: 1.5rem; }
  .filtros-busqueda { flex-direction: column; gap: 1rem; }
  .busqueda-input-container {
    position: relative;
    flex: 1;
    max-width: 400px;
    min-width: 300px;
  }
  .filtros-turno { width: 100%; justify-content: center; }
  .btn-turno { flex: 1; justify-content: center; }
  .controles-superiores { flex-direction: column; gap: 1rem; }
  .estado-alumnos-sutil { padding: 0.7rem 1.2rem; width: 100%; }
  .info-alumno-sutil { padding: 0.4rem 0.8rem; }
  .numero-sutil { font-size: 1.1rem; }
  .texto-sutil { font-size: 0.7rem; }
  .separador { height: 25px; }
  .botones-filtros { width: 100%; }
  .btn-filtrar { width: 100%; justify-content: center; padding: 0.6rem 1rem; }
  /* Paginación eliminada */
}

@media (max-width: 480px) {
  .contenedor-alumnos { padding: 1rem; }
  .filtros-busqueda { gap: 0.8rem; }
  .input-busqueda { padding: 0.7rem 0.9rem 0.7rem 2.8rem; font-size: 0.85rem; }
  .btn-turno { padding: 0.6rem 1rem; font-size: 0.85rem; }
  .estado-alumnos-sutil { padding: 0.6rem 1rem; }
  .info-alumno-sutil { padding: 0.3rem 0.6rem; }
  .numero-sutil { font-size: 1rem; margin-bottom: 0.2rem; }
  .texto-sutil { font-size: 0.65rem; letter-spacing: 0.2px; }
  .separador { height: 20px; margin: 0 0.3rem; }
  .btn-filtrar { padding: 0.5rem 0.8rem; }
  .btn-texto { font-size: 0.8rem; }
  /* Paginación eliminada */
}
</style>