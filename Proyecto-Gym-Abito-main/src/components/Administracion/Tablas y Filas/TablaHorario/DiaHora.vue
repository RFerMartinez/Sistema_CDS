<template>
  <div 
    class="dia-hora"
    :class="clasesCelda"
    @click="manejarClick"
  >
    <div class="contenido-celda">
      <!-- Modo Visualización (normal) -->
      <div v-if="!modoEdicion" class="modo-visualizacion">
        <div v-if="seleccionado" class="horario-asignado">
          <i class="fas fa-check"></i>
          <span class="texto-asignado">Asignado</span>
        </div>
        <div v-else class="horario-vacio">
          <span>-</span>
        </div>
      </div>
      
      <!-- Modo Edición -->
      <div v-else class="modo-edicion">
        
        <!-- ========================================================= -->
        <!-- ===      MODIFICACIÓN: Ocultar cupos si es Empleado     === -->
        <!-- ========================================================= -->
        <div v-if="!props.modoEmpleado" class="info-cupos">
          <span class="texto-cupos">Cupos:</span>
          <span class="numero-cupos">{{ displayedCupos }}</span>
        </div>
        <!-- ========================================================= -->
        
        <div class="estado-celda" :class="estadoClase">
          <i class="icono-estado" :class="iconoClase"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  dia: String,
  horario: String,
  cuposDisponibles: Number,
  seleccionado: Boolean,
  modoEdicion: Boolean,
  disponible: Boolean,
  modoEmpleado: Boolean // <-- 1. ACEPTAR LA NUEVA PROP
})

const emit = defineEmits(['seleccionar'])

const clasesCelda = computed(() => {
  // Si es modo empleado, 'disponible' es siempre true (ignora cupos)
  const estaDisponible = props.modoEmpleado ? true : props.disponible;

  return {
    'seleccionado': props.seleccionado,
    'disponible': props.modoEdicion && estaDisponible,
    'no-disponible': props.modoEdicion && !estaDisponible,
    'modo-visualizacion': !props.modoEdicion,
    'mobile-seleccionado': props.seleccionado,
    'modo-empleado': props.modoEmpleado // Clase para centrar el icono
  }
})

const estadoClase = computed(() => {
  const estaDisponible = props.modoEmpleado ? true : props.disponible;
  if (!estaDisponible) return 'estado-no-disponible'
  if (props.seleccionado) return 'estado-seleccionado'
  return 'estado-disponible'
})

const iconoClase = computed(() => {
  const estaDisponible = props.modoEmpleado ? true : props.disponible;
  if (!estaDisponible) return 'fas fa-lock'
  if (props.seleccionado) return 'fas fa-check'
  return 'fas fa-plus'
})


// =========================================================
// ===     MODIFICACIÓN: Permitir click si es Empleado     ===
// =========================================================
const manejarClick = () => {
  if (!props.modoEdicion) return;

  // 2. Si es modo empleado, ignora la prop 'disponible' y permite el click
  if (props.modoEmpleado) {
    emit('seleccionar', props.dia, props.horario, !props.seleccionado)
    return;
  }
  
  // Lógica original para alumnos
  if (props.disponible) {
    emit('seleccionar', props.dia, props.horario, !props.seleccionado)
  }
}
// =========================================================


const displayedCupos = computed(() => {
  // Esta lógica no se ejecutará visualmente en modoEmpleado
  // porque el div estará oculto (v-if="!props.modoEmpleado")
  if (props.modoEdicion && props.seleccionado) {
    return props.cuposDisponibles - 1;
  }
  return props.cuposDisponibles;
})
</script>

<style scoped>
.dia-hora {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: #fafafa;
}

/* Modo Visualización (normal) */
.modo-visualizacion {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.horario-asignado {
  text-align: center;
  color: #4caf50;
}

.horario-asignado .fa-check {
  font-size: 1.2rem;
  margin-bottom: 0.2rem;
}

.texto-asignado {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
}

.horario-vacio span {
  color: #bdbdbd;
  font-size: 0.9rem;
}

/* Estados en modo visualización */
.modo-visualizacion.seleccionado {
  background: #e8f5e9;
  border-color: #4caf50;
}

/* Modo Edición */
.modo-edicion {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Centrado original (con cupos) */
  padding: 0.3rem;
}

/* ========================================================= */
/* ===    MODIFICACIÓN: Centrar icono en modo Empleado     === */
/* ========================================================= */
.dia-hora.modo-empleado .modo-edicion {
  justify-content: center; /* Centra el icono verticalmente */
}
.dia-hora.modo-empleado .estado-celda {
  margin-top: 0; /* Quita el margen que tenía */
}
.dia-hora.modo-empleado .icono-estado {
  font-size: 1.2rem; /* Lo hacemos un poco más grande */
}
/* ========================================================= */


.info-cupos {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.3rem;
}

.texto-cupos {
  font-size: 0.7rem;
  color: #666;
  margin-bottom: 0.1rem;
}

.numero-cupos {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}

.estado-celda {
  margin-top: 0.2rem;
}

.icono-estado {
  font-size: 0.9rem;
}

/* Estados en modo edición */
.dia-hora.disponible {
  background: #f8f9fa;
  border-color: #dee2e6;
  cursor: pointer;
}

.dia-hora.disponible:hover {
  background: #e3f2fd;
  border-color: #2196f3;
  transform: translateY(-1px);
}

.dia-hora.seleccionado {
  background: #e3f2fd;
  border-color: #2196f3;
}

.dia-hora.seleccionado .numero-cupos {
  color: #1976d2;
}

.dia-hora.no-disponible {
  background: #f5f5f5;
  border-color: #e0e0e0;
  cursor: not-allowed;
  opacity: 0.6;
}

/* En modo empleado, esta clase no se aplicará, pero la dejamos */
.dia-hora.no-disponible .numero-cupos {
  color: #999;
}

.estado-disponible .icono-estado {
  color: #66bb6a;
}

.estado-seleccionado .icono-estado {
  color: #2196f3;
}

.estado-no-disponible .icono-estado {
  color: #f44336;
}

/* Mejoras para móviles */
@media (max-width: 768px) {
  .dia-hora {
    height: 70px;
    min-height: 70px;
  }
  
  .info-cupos {
    flex-direction: row;
    gap: 0.2rem;
    align-items: center;
  }
  
  .texto-cupos {
    font-size: 0.6rem;
    margin-bottom: 0;
  }
  
  .numero-cupos {
    font-size: 0.9rem;
  }
  
  .icono-estado {
    font-size: 0.8rem;
  }

  /* Centrado en móvil para modo empleado */
  .dia-hora.modo-empleado .icono-estado {
    font-size: 1rem;
  }
  
  /* Indicador visual claro para móviles */
  .dia-hora.mobile-seleccionado {
    border: 2px solid #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
    background: #e3f2fd;
  }
  
  .dia-hora.mobile-seleccionado::after {
    content: '✓';
    position: absolute;
    top: -8px;
    right: -8px;
    background: #2196f3;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
  }
}

/* Para pantallas muy pequeñas */
@media (max-width: 480px) {
  .dia-hora {
    height: 60px;
    min-height: 60px;
  }
  
  .modo-edicion {
    padding: 0.2rem;
  }
  
  .info-cupos {
    flex-direction: column;
    gap: 0;
  }
  
  .texto-cupos {
    font-size: 0.55rem;
  }
  
  .numero-cupos {
    font-size: 0.8rem;
  }
}
</style>