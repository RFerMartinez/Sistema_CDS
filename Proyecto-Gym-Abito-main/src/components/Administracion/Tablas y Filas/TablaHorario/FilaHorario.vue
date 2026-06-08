<template>
  <div class="fila-horario">
    <div class="celda-horario">
      <div class="celda-horario-contenido">
        <span class="nro-grupo-texto">Grupo {{ horarioObj.nroGrupo }}</span>
        <span class="horario-texto">{{ horarioFormateado }}</span>
      </div>
    </div>
    
    <div 
      v-for="dia in dias" 
      :key="dia" 
      class="celda-dia"
    >
      <template v-if="trabajaEseDia(dia)">
        <DiaHora
          :dia="dia"
          :horario="props.horarioObj.horario"
          :cuposDisponibles="obtenerCupos(dia)"
          :seleccionado="estaSeleccionado(dia)"
          :modo-edicion="modoEdicion"
          :disponible="estaDisponible(dia)"
          :modo-empleado="props.modoEmpleado" @seleccionar="onSeleccionar"
        />
      </template>
      <template v-else>
        <div class="celda-dia-no-trabaja">
          <span>-</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DiaHora from './DiaHora.vue'

const props = defineProps({
  horarioObj: Object,
  dias: Array,
  horariosSeleccionados: Array,
  modoEdicion: Boolean,
  modoEmpleado: Boolean // <-- 1. ACEPTAR NUEVA PROP
})

const emit = defineEmits(['seleccionar'])

const horarioFormateado = computed(() => {
  const [inicio, fin] = props.horarioObj.horario.split('-')
  return `${inicio} a ${fin}`
})

const trabajaEseDia = (dia) => {
  return props.horarioObj.dias_asignados.some(d => d.dia === dia)
}

const obtenerCupos = (dia) => {
  const diaInfo = props.horarioObj.dias_asignados.find(d => d.dia === dia)
  return diaInfo ? diaInfo.capacidadMax - diaInfo.alumnos_inscritos : 0
}

// --- 2. MODIFICAR ESTA FUNCIÓN ---
const estaDisponible = (dia) => {
  if (props.modoEmpleado) return true; // <-- CAMBIO CLAVE
  return obtenerCupos(dia) > 0
}
// --- FIN MODIFICACIÓN ---

const estaSeleccionado = (dia) => {
  return props.horariosSeleccionados.some(h => 
    h.dia === dia && h.horario === props.horarioObj.horario
  )
}

const onSeleccionar = (dia, horario, seleccionado) => {
  emit('seleccionar', { dia, horario }, seleccionado);
}
</script>

<style scoped>
/* MODIFICADO: repeat(7, 1fr) para 7 días */
.fila-horario {
  display: grid;
  grid-template-columns: 150px repeat(7, 1fr);
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.celda-horario {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0.5rem; /* Ajustado para dar espacio al nuevo texto */
  text-align: center;
  color: #495057;
  height: 80px;
  display: flex;
  flex-direction: column; /* AÑADIDO: para apilar texto */
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

/* AÑADIDO: Estilos para el texto de la celda de horario */
.celda-horario-contenido {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.nro-grupo-texto {
  font-weight: 600;
  font-size: 0.9rem;
  color: #343a40;
}
.horario-texto {
  font-weight: 500;
  font-size: 0.85rem;
  color: #6c757d;
}
/* FIN AÑADIDO */


.celda-dia {
  height: 80px;
}

/* AÑADIDO: Estilo para la celda gris de "no trabaja" */
.celda-dia-no-trabaja {
  height: 100%;
  width: 100%;
  background-color: #e9ecef; /* Gris oscuro sutil */
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #adb5bd;
  cursor: not-allowed;
  border: 1px dashed #ced4da;
}
/* FIN AÑADIDO */


/* Responsive mejorado */
@media (max-width: 768px) {
  /* MODIFICADO: repeat(7, 1fr) para 7 días */
  .fila-horario {
    grid-template-columns: 120px repeat(7, 1fr);
    gap: 0.3rem;
    margin-bottom: 0.3rem;
  }
  .celda-horario {
    height: 70px;
    padding: 0.5rem 0.3rem;
  }
  .nro-grupo-texto { font-size: 0.85rem; }
  .horario-texto { font-size: 0.8rem; }
  .celda-dia {
    height: 70px;
  }
}

/* Para pantallas muy pequeñas */
@media (max-width: 480px) {
  /* MODIFICADO: repeat(7, 1fr) para 7 días */
  .fila-horario {
    grid-template-columns: 100px repeat(7, 1fr);
    gap: 0.2rem;
  }
  .celda-horario {
    height: 60px;
    padding: 0.3rem 0.2rem;
  }
  .nro-grupo-texto { font-size: 0.8rem; }
  .horario-texto { font-size: 0.7rem; }
  .celda-dia {
    height: 60px;
  }
}

/* Mejora para tablets */
@media (min-width: 769px) and (max-width: 1024px) {
  /* MODIFICADO: repeat(7, 1fr) para 7 días */
  .fila-horario {
    grid-template-columns: 140px repeat(7, 1fr);
  }
  .celda-horario {
    font-size: 0.85rem;
  }
}
</style>