<template>
  <div class="tabla-completa">
    
    <div class="tabla-container" :class="{ 'mobile': isMobile }">
      <div v-if="cargando" class="loading-container">
        <div class="spinner"></div>
        <span>{{ loadingText }}</span>
      </div>

      <div v-else-if="!cargando && (!alumnos || alumnos.length === 0)" class="no-datos-mensaje">
        <i class="fas fa-info-circle"></i>
        <span>{{ modo === 'alumnos' ? 'No se encontraron alumnos' : 'No se encontraron personas' }}</span>
      </div>

      <template v-else-if="!cargando && alumnos && alumnos.length > 0">
        
        <table v-if="!isMobile" class="tabla-alumnos">
          <thead>
            <tr v-if="modo === 'alumnos'">
              <th class="col-dni">DNI</th>
              <th class="col-nombre">NOMBRE COMPLETO</th>
              <th class="col-cuotas">CUOTAS PENDIENTES</th>
              <th class="col-estado-alumno">ESTADO</th>
              <th class="col-acciones">ACCIONES</th>
            </tr>
            <tr v-else-if="modo === 'personas'">
              <th class="col-dni">DNI</th>
              <th class="col-nombre-personas">NOMBRE COMPLETO</th>
              <th class="col-acciones-personas">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <FilaAlumno
              v-for="(item, index) in alumnosPaginados" :key="index"
              :alumno="item" :is-mobile="isMobile"
              :modo="modo"
              @verDetalles="$emit('verDetalles', item)"
              @realizarIngreso="$emit('realizarIngreso', item)"
              @eliminarPersona="$emit('eliminarPersona', item)" /> </tbody>
        </table>

        <div v-else class="mobile-view">
          <FilaAlumno
            v-for="(item, index) in alumnosPaginados"
            :key="index"
            :alumno="item"
            :is-mobile="isMobile"
            :modo="modo"
            @verDetalles="$emit('verDetalles', item)"
            @realizarIngreso="$emit('realizarIngreso', item)"
            @eliminarPersona="$emit('eliminarPersona', item)" />
        </div>
      </template>
    </div>

    <div class="paginacion-inferior" v-if="!cargando && totalPaginas > 1">
      <div class="paginacion-controles">
        <button
          class="btn-paginacion"
          :disabled="paginaActual === 1"
          @click="cambiarPagina(paginaActual - 1)"
          aria-label="Página anterior"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <div class="numeros-pagina">
          <span
            v-for="numero in numerosPaginas"
            :key="numero.toString() + '-' + paginaActual" class="numero-pagina"
            :class="{ 'activa': numero === paginaActual, 'puntos': numero === '...' }"
            @click="cambiarPagina(numero)"
          >
            {{ numero === '...' ? '…' : numero }}
          </span>
        </div>

        <button
          class="btn-paginacion"
          :disabled="paginaActual === totalPaginas"
          @click="cambiarPagina(paginaActual + 1)"
          aria-label="Página siguiente"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
// MODIFICADO: Se añaden computed y watch
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import FilaAlumno from './FilaAlumno.vue';

// MODIFICADO: Se renombró 'props' para usarlo en el script
const props = defineProps({
  alumnos: Array,
  modo: {
    type: String,
    default: 'alumnos',
    validator: (value) => ['alumnos', 'personas'].includes(value)
  },
  cargando: {
    type: Boolean,
    default: false
  },
  // --- V V V NUEVAS PROPS AÑADIDAS V V V ---
  elementosPorPagina: {
    type: Number,
    default: 10 // Coincide con el default de Alumnos.vue
  },
  loadingText: {
    type: String,
    default: 'Cargando datos...'
  }
  // --- ^ ^ ^ FIN NUEVAS PROPS ^ ^ ^ ---
});

defineEmits(['verDetalles', 'realizarIngreso', 'eliminarPersona']);

const isMobile = ref(false);
const checkIsMobile = () => { isMobile.value = window.innerWidth <= 768; };

// --- V V V LÓGICA DE PAGINACIÓN AÑADIDA (copiada de TablaCuotas) V V V ---
const paginaActual = ref(1);

// Watch para resetear la página si los filtros cambian (la lista de alumnos cambia)
watch(() => props.alumnos, (newAlumnos, oldAlumnos) => {
    if (newAlumnos && oldAlumnos && newAlumnos.length !== oldAlumnos.length) {
        paginaActual.value = 1;
    }
}, { deep: true });

// Computed properties
const totalPaginas = computed(() => Math.ceil((props.alumnos?.length || 0) / props.elementosPorPagina));

// Ahora 'alumnosPaginados' se calcula aquí
const alumnosPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * props.elementosPorPagina;
    const fin = inicio + props.elementosPorPagina;
    return props.alumnos?.slice(inicio, fin) || [];
});

const numerosPaginas = computed(() => {
    const total = totalPaginas.value;
    if (!total || total === Infinity || total <= 1) return [1];
    const current = paginaActual.value;
    const delta = 1;
    let range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) { range.push(i); }
    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    range.unshift(1);
    if (total > 1) range.push(total);
    return range.filter((item, index, arr) => {
        if (item === '...') {
            if (index === 1 && arr[0] === 1) return false;
            if (index === arr.length - 2 && arr[arr.length - 1] === total) return false;
            if (index > 0 && arr[index - 1] === '...') return false;
        }
        return true;
    });
});

// Métodos
const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina !== '...' && nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
        paginaActual.value = nuevaPagina;
        // Scroll al inicio de la tabla
        const tablaElement = document.querySelector('.tabla-completa'); 
        if (tablaElement) {
            tablaElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
};
// --- ^ ^ ^ FIN LÓGICA DE PAGINACIÓN ^ ^ ^ ---

onMounted(() => { checkIsMobile(); window.addEventListener('resize', checkIsMobile); });
onUnmounted(() => { window.removeEventListener('resize', checkIsMobile); });
</script>

<style scoped>
/* NUEVO: Contenedor principal */
.tabla-completa {
  width: 100%;
}

/* (Estilos de .tabla-container, .tabla-alumnos, etc. sin cambios) */
.tabla-container {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 0;
  overflow-x: auto;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative; 
  min-height: 150px; 
}
.tabla-alumnos { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 0.95rem; min-width: 600px; }
.tabla-alumnos th { text-align: center; padding: 0.75rem 0.5rem; color: #2c3e50; font-weight: 700; font-size: 0.9rem; border-bottom: 2px solid #e1e8ed; background-color: #f8fafc; position: sticky; top: 0; text-transform: uppercase; letter-spacing: 0.5px; height: 60px; box-sizing: border-box; vertical-align: middle; }
.tabla-alumnos th.col-dni { width: 15%; }
.tabla-alumnos th.col-nombre { width: 35%; text-align: left; padding-left: 1.5rem !important; }
.tabla-alumnos th.col-cuotas { width: 15%; padding-right: 1.5rem !important; text-align: right;}
.tabla-alumnos th.col-estado-alumno { width: 15%; }
.tabla-alumnos th.col-acciones { width: 20%; }
.tabla-alumnos th.col-nombre-personas { width: 55%; text-align: left; padding-left: 1.5rem !important; }
.tabla-alumnos th.col-acciones-personas { width: 30%; }
.mobile-view { width: 100%; display: flex; flex-direction: column; gap: 1rem; }

/* --- ¡ESTILOS DE SPINNER BORRADOS DE AQUÍ! --- */

/* (Estilo .no-datos-mensaje sin cambios) */
.no-datos-mensaje {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
  font-style: italic;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-height: 150px;
  justify-content: center;
}
.no-datos-mensaje i {
  font-size: 2rem;
  color: #adb5bd;
}


/* --- (Estilos de paginación sin cambios) --- */
.paginacion-inferior {
  margin-top: 2.5rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  border: 1px solid #dee2e6;
  display: flex;
  justify-content: center;
  align-items: center;
}
.paginacion-controles {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.btn-paginacion {
  width: 40px;
  height: 40px;
  border: 2px solid #e91e63;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #e91e63;
  font-size: 0.9rem;
}
.btn-paginacion:hover:not(:disabled) {
  background: #e91e63;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
}
.btn-paginacion:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #ccc;
  color: #ccc;
}
.numeros-pagina {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}
.numero-pagina {
  width: 35px;
  height: 35px;
  border: 2px solid #dee2e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #6c757d;
  font-size: 0.85rem;
}
.numero-pagina:hover:not(.puntos) {
  border-color: #e91e63;
  color: #e91e63;
  transform: scale(1.05);
}
.numero-pagina.activa {
  background: #e91e63;
  border-color: #e91e63;
  color: white;
  transform: scale(1.1);
}
.numero-pagina.puntos {
  cursor: default;
  border: none;
  font-weight: bold;
}

@media (max-width: 768px) {
  .tabla-container { padding: 1rem; border-radius: 12px; }
  .mobile-view { gap: 0.8rem; }
  .no-datos-mensaje { padding: 2rem 1rem; font-size: 1rem;}
  /* Paginación responsive */
  .paginacion-inferior { margin-top: 2rem; padding: 1rem; }
  .btn-paginacion { width: 35px; height: 35px; font-size: 0.8rem; }
  .numero-pagina { width: 30px; height: 30px; font-size: 0.8rem; }
}
@media (max-width: 480px) {
  .tabla-container { padding: 0.8rem; }
  .no-datos-mensaje { font-size: 0.9rem;}
  /* Paginación responsive */
  .paginacion-inferior { margin-top: 1.5rem; padding: 0.8rem; }
  .paginacion-controles { gap: 0.6rem; }
  .btn-paginacion { width: 32px; height: 32px; font-size: 0.75rem; }
  .numero-pagina { width: 28px; height: 28px; font-size: 0.75rem; }
  .numeros-pagina { gap: 0.3rem; }
}
</style>