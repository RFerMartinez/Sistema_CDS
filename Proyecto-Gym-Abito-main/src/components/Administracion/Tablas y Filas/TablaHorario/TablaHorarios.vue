<template>
  <div class="tabla-horarios">
    <div class="tabla-header">
      <h3 class="titulo">
        <i class="fas fa-calendar-alt"></i>
        {{ modoEdicion ? 'Horarios Disponibles' : 'Horarios Asignados' }}
      </h3>
      <div v-if="!esSuscripcionLibre" class="controles">
        <button 
          class="btn-accion"
          @click="toggleModoEdicion"
          :disabled="modoEdicion && !esSeleccionValida"
        >
          <i class="fas" :class="iconoBoton"></i>
          {{ textoBoton }}
        </button>
        
        <div v-if="modoEdicion && !props.modoEmpleado" class="contador-seleccion">
          <span class="contador-texto">
            {{ horariosSeleccionados.length }}/{{ limiteDias }} días seleccionados
          </span>
        </div>
      </div>
    </div>

    <div v-if="!isMobile" class="tabla-desktop">
      <div class="fila-header">
        <div class="celda-horario-header">
          <i class="fas fa-clock"></i>
          HORARIO
        </div>
        <div 
          v-for="dia in DIAS_SEMANA" 
          :key="dia" 
          class="celda-dia-header"
        >
          <i class="fas fa-calendar-day"></i>
          {{ dia.toUpperCase() }}
        </div>
      </div>

      <div class="contenedor-filas">
        <FilaHorario
          v-for="horarioObj in horariosProcesados"
          :key="horarioObj.nroGrupo"
          :horario-obj="horarioObj"
          :dias="DIAS_SEMANA" 
          :horarios-seleccionados="horariosSeleccionados"
          :modo-edicion="modoEdicion"
          :modo-empleado="props.modoEmpleado" @seleccionar="manejarSeleccion"
        />
      </div>
    </div>

    <div v-else class="tabla-mobile">
      <div class="mobile-contenedor">
        <div class="mobile-instructions" v-if="modoEdicion && !props.modoEmpleado">
          <i class="fas fa-info-circle"></i>
          <p>Selecciona {{ limiteDias }} días diferentes para completar tu horario</p>
        </div>
        
        <div v-if="modoEdicion && !props.modoEmpleado" class="mobile-selection-info">
          <div class="selection-count">
            <span class="count-number">{{ horariosSeleccionados.length }}</span>
            <span class="count-text">/{{ limiteDias }} días seleccionados</span>
          </div>
        </div>
        
        <div 
          v-for="dia in DIAS_SEMANA" 
          :key="dia" 
          class="dia-mobile-card"
          :class="{ 'expandido': diaExpandido === dia }"
        >
          <div class="dia-header-mobile" @click="toggleDiaMobile(dia)">
            <div class="dia-info">
              <i class="fas fa-calendar-day"></i>
              <span class="dia-nombre">{{ dia }}</span>
              <span v-if="modoEdicion && !props.modoEmpleado" class="dia-cupos">
                • {{ obtenerTotalCuposDia(dia) }} cupos
              </span>
            </div>
            <div class="dia-estado">
              <span v-if="modoEdicion && obtenerSeleccionadosDia(dia).length > 0" 
                    class="seleccionados-count">
                {{ obtenerSeleccionadosDia(dia).length }} sel.
              </span>
              <span v-else-if="!modoEdicion && obtenerAsignadosDia(dia).length > 0"
                    class="asignados-count">
                {{ obtenerAsignadosDia(dia).length }} Seleccionado.
              </span>
              <i class="fas fa-chevron-down" :class="{ 'rotado': diaExpandido === dia }"></i>
            </div>
          </div>
          
          <transition name="slide">
            <div v-if="diaExpandido === dia" class="horarios-mobile-list">
              <template v-for="horarioObj in horariosProcesados" :key="horarioObj.nroGrupo">
                <div
                  v-if="horarioObj.dias_asignados.some(d => d.dia === dia)"
                  class="horario-mobile-item"
                  :class="getClasesHorarioMobile(dia, horarioObj)"
                  @click="manejarSeleccionMobile(dia, horarioObj.horario)"
                >
                  <div class="horario-info">
                    <span class="horario-texto">{{ horarioObj.horario.replace('-', ' a ') }}</span>
                    <span class="cupos-mobile" v-if="modoEdicion && !props.modoEmpleado">
                      {{ obtenerCuposDia(dia, horarioObj) }} cupos
                    </span>
                  </div>
                  <div class="estado-mobile">
                    <i :class="getIconoHorarioMobile(dia, horarioObj)"></i>
                  </div>
                </div>
                <div
                  v-else
                  class="horario-mobile-item no-trabaja"
                >
                    <span class="horario-texto">{{ horarioObj.horario.replace('-', ' a ') }}</span>
                    <span class="cupos-mobile">No disponible</span>
                </div>
              </template>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div v-if="modoEdicion" class="mensajes-estado">
      </div>

    <div v-if="modoEdicion" class="leyenda">
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import FilaHorario from './FilaHorario.vue';

// --- (props, emit, y datos sin cambios) ---
const props = defineProps({
  horariosAlumno: {
    type: [Array, Object, null],
    default: () => ([])
  },
  suscripcion: {
    type: String,
    default: ''
  },
  modoEmbebido: {
    type: Boolean,
    default: false
  },
  modoEmpleado: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['horarios-actualizados']);
const datosGrupos = ref([]);
const isMobile = ref(false);
const modoEdicion = ref(props.modoEmbebido);
const horariosSeleccionados = ref([]); 
const diaExpandido = ref(null);
const datosListos = ref(false);

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// --- (horariosProcesados sin cambios) ---
const horariosProcesados = computed(() => {
    return datosGrupos.value.map(grupo => ({
        nroGrupo: String(grupo.nroGrupo).trim(),
        horario: `${grupo.horaInicio.slice(0, 5)}-${grupo.horaFin.slice(0, 5)}`,
        dias_asignados: grupo.dias_asignados || []
    }));
});

// --- (Funciones de Traducción sin cambios) ---
const convertirFormatoApiAInterno = (data) => {
  if (!datosListos.value) {
      console.warn("Traducción pausada: El diccionario (grupos.json) no está listo.");
      return []; 
  }
  let horariosAPI = []; 
  if (data && typeof data === 'object' && !Array.isArray(data) && data.hasOwnProperty('horarios')) {
    horariosAPI = data.horarios || [];
  } 
  else if (Array.isArray(data)) {
    if (data.length > 0 && data[0].hasOwnProperty('horario')) {
        
        return [...data]; 
    }
    horariosAPI = data; 
  }
  if (!Array.isArray(horariosAPI)) {
     console.warn("TablaHorarios: No se pudo determinar un array de horarios desde props.", data);
     return [];
  }
  return horariosAPI
    .map(hApi => {
      const nroGrupoLimpio = String(hApi.nroGrupo).trim();
      const grupoCorrespondiente = horariosProcesados.value.find(g => g.nroGrupo === nroGrupoLimpio);
      if (grupoCorrespondiente) {
        return { dia: hApi.dia, horario: grupoCorrespondiente.horario };
      }
      console.warn(`No se encontró grupo para nroGrupo: ${hApi.nroGrupo} (limpio: ${nroGrupoLimpio})`);
      return null;
    })
    .filter(Boolean); 
};
const revertirFormatoInternoAApi = (horariosInternos) => {
  if (!Array.isArray(horariosInternos) || !datosListos.value) return [];
  return horariosInternos
    .map(hInterno => {
      const grupoCorrespondiente = horariosProcesados.value.find(g => g.horario === hInterno.horario);
      if (grupoCorrespondiente) {
        return { nroGrupo: grupoCorrespondiente.nroGrupo, dia: hInterno.dia };
      }
      console.warn(`No se encontró grupo para horario: ${hInterno.horario}`);
      return null;
    })
    .filter(Boolean);
};
// --- (Watch de props sin cambios) ---
watch(() => props.horariosAlumno, (nuevosHorariosProp) => {
  if (datosListos.value) { 
    if (!modoEdicion.value) { 
      
      horariosSeleccionados.value = convertirFormatoApiAInterno(nuevosHorariosProp);
    } else if (props.modoEmbebido) { 
      let arrayEntrante = [];
      if (nuevosHorariosProp && typeof nuevosHorariosProp === 'object' && !Array.isArray(nuevosHorariosProp) && nuevosHorariosProp.hasOwnProperty('horarios')) {
        arrayEntrante = nuevosHorariosProp.horarios || [];
      } else if (Array.isArray(nuevosHorariosProp)) {
        arrayEntrante = nuevosHorariosProp;
      }
      if (arrayEntrante.length === 0) {
        
        horariosSeleccionados.value = [];
      }
    }
  }
}, { deep: true });

// --- (cargarDatos sin cambios) ---
import { obtenerHorariosCompletos } from '@/api/services/dashboardService';
const cargarDatos = async () => {
  try {
    const response = await obtenerHorariosCompletos();
    datosGrupos.value = response;
    datosListos.value = true; 
    
  } catch (error) {
    console.error('Error cargando grupos.json:', error);
  }
};

// --- (Computed Properties sin cambios, ya manejan modoEmpleado) ---
const esSuscripcionLibre = computed(() => props.suscripcion.toLowerCase().includes('libre'));
const limiteDias = computed(() => {
    if (props.modoEmpleado) return Infinity; 
    if (esSuscripcionLibre.value) return 0;
    const match = props.suscripcion.match(/\d+/);
    return match ? parseInt(match[0]) : 3;
});
const textoBoton = computed(() => modoEdicion.value ? 'Guardar Cambios' : 'Modificar Horarios');
const iconoBoton = computed(() => modoEdicion.value ? 'fa-save' : 'fa-edit');
const esSeleccionValida = computed(() => {
    if (props.modoEmpleado) return true; 
    if (!modoEdicion.value) return true;
    return horariosSeleccionados.value.length === limiteDias.value;
});

// --- (Métodos Mobile MODIFICADOS) ---
const getClasesHorarioMobile = (dia, horarioObj) => {
    const estaSeleccionadoActual = estaSeleccionado(dia, horarioObj.horario); 
    if (!modoEdicion.value) {
        return { 'asignado': estaSeleccionadoActual, 'no-asignado': !estaSeleccionadoActual };
    }
    
    // --- LÓGICA MODIFICADA ---
    if (props.modoEmpleado) {
        // En modo empleado, solo importa si está seleccionado o disponible
        return {
            'seleccionado': estaSeleccionadoActual,
            'disponible': !estaSeleccionadoActual
        };
    }
    // --- FIN LÓGICA MODIFICADA ---

    // Lógica original para alumnos
    const cupos = obtenerCuposDia(dia, horarioObj);
    return {
        'seleccionado': estaSeleccionadoActual,
        'disponible': cupos > 0 && !estaSeleccionadoActual,
        'no-disponible': cupos === 0 && !estaSeleccionadoActual
    };
};

const getIconoHorarioMobile = (dia, horarioObj) => {
    const estaSeleccionadoActual = estaSeleccionado(dia, horarioObj.horario); 
    if (!modoEdicion.value) {
        return estaSeleccionadoActual ? 'fas fa-check asignado' : 'fas fa-minus no-asignado';
    }
    
    if (estaSeleccionadoActual) return 'fas fa-check-circle seleccionado';

    // --- LÓGICA MODIFICADA ---
    if (props.modoEmpleado) {
        // En modo empleado, nunca está "no disponible" (lock)
        return 'fas fa-plus-circle disponible';
    }
    // --- FIN LÓGICA MODIFICADA ---
    
    const cupos = obtenerCuposDia(dia, horarioObj);
    if (cupos === 0) return 'fas fa-lock no-disponible';
    return 'fas fa-plus-circle disponible';
};
const obtenerAsignadosDia = (dia) => { return horariosSeleccionados.value.filter(h => h.dia === dia); };

// --- (toggleModoEdicion sin cambios) ---
const toggleModoEdicion = () => {
  if (modoEdicion.value) {
    if (esSeleccionValida.value) {
      const horariosTraducidos = revertirFormatoInternoAApi(horariosSeleccionados.value);
      const datosParaEmitir = { horarios: horariosTraducidos }; 
      emit('horarios-actualizados', datosParaEmitir); 
      modoEdicion.value = false; 
    } else {
        alert(`Debes seleccionar exactamente ${limiteDias.value} días diferentes.`);
    }
  } else {
    horariosSeleccionados.value = convertirFormatoApiAInterno(props.horariosAlumno);
    modoEdicion.value = true;
  }
};

// --- (manejarSeleccion (Desktop) sin cambios, ya maneja modoEmpleado) ---
const manejarSeleccion = (horario, seleccionado) => {
  if (!modoEdicion.value) return;
  const dia = horario.dia;
  const horarioStr = horario.horario;
  const yaSeleccionado = estaSeleccionado(dia, horarioStr);
  
  if (yaSeleccionado) {
    horariosSeleccionados.value = horariosSeleccionados.value.filter(h => !(h.dia === dia && h.horario === horarioStr));
  } else {
    if (!props.modoEmpleado) {
      horariosSeleccionados.value = horariosSeleccionados.value.filter(h => h.dia !== dia);
    }
    if (horariosSeleccionados.value.length < limiteDias.value) {
        horariosSeleccionados.value.push({ dia, horario: horarioStr });
    }
  }
};

// --- (manejarSeleccionMobile MODIFICADO) ---
const manejarSeleccionMobile = (dia, horario) => {
  if (!modoEdicion.value) return;
  const horarioObjCompleto = horariosProcesados.value.find(h => h.horario === horario);
  if (!horarioObjCompleto) return;
  const yaSeleccionado = estaSeleccionado(dia, horario);
  
  // --- LÓGICA MODIFICADA ---
  // Si NO es modo empleado, aplicamos la restricción de cupos
  if (!props.modoEmpleado) {
      const cupos = obtenerCuposDia(dia, horarioObjCompleto);
      if (cupos === 0 && !yaSeleccionado) return; // Bloquea si no hay cupos
  }
  // Si ES modo empleado, esta comprobación se ignora y se permite seleccionar.
  // --- FIN LÓGICA MODIFICADA ---

  if (yaSeleccionado) {
      horariosSeleccionados.value = horariosSeleccionados.value.filter(h => !(h.dia === dia && h.horario === horario));
  } else {
      if (!props.modoEmpleado) {
        horariosSeleccionados.value = horariosSeleccionados.value.filter(h => h.dia !== dia);
      }
      if (horariosSeleccionados.value.length < limiteDias.value) {
          horariosSeleccionados.value.push({ dia, horario });
      }
  }
};

// --- (Resto de métodos y hooks sin cambios) ---
const toggleDiaMobile = (dia) => { diaExpandido.value = diaExpandido.value === dia ? null : dia; };
const obtenerCuposDia = (dia, horarioObj) => {
  if (!horarioObj || !horarioObj.dias_asignados) return 0;
  const diaInfo = horarioObj.dias_asignados.find(d => d.dia === dia);
  return diaInfo ? (diaInfo.capacidadMax || 0) - (diaInfo.alumnos_inscritos || 0) : 0;
};
const obtenerTotalCuposDia = (dia) => {
  return horariosProcesados.value.reduce((total, horario) => {
    const diaInfo = horario.dias_asignados?.find(d => d.dia === dia);
    return total + (diaInfo ? obtenerCuposDia(dia, horario) : 0);
  }, 0);
};
const obtenerSeleccionadosDia = (dia) => { return horariosSeleccionados.value.filter(h => h.dia === dia); };
const estaSeleccionado = (dia, horario) => {
    return horariosSeleccionados.value.some(h => h.dia === dia && h.horario === horario);
};
const checkIsMobile = () => { isMobile.value = window.innerWidth <= 768; };

onMounted(async () => {
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
  await cargarDatos(); 
  horariosSeleccionados.value = convertirFormatoApiAInterno(props.horariosAlumno);
});
onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile);
});
</script>
<style scoped>
/* --- ESTILOS MODIFICADOS --- */
.tabla-horarios {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}
.tabla-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.titulo {
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.titulo i {
  color: #d32f2f;
}
.controles {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.btn-accion {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}
.btn-accion:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}
.btn-accion:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
  box-shadow: none;
}
.contador-seleccion {
  background: #e3f2fd;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1976d2;
  border: 1px solid #bbdefb;
}
.contador-texto {
  font-weight: 600;
}
/* Vista Desktop */
.tabla-desktop {
  width: 100%;
  overflow-x: auto;
}

/* MODIFICADO: repeat(7, 1fr) para 7 días */
.fila-header {
  display: grid;
  grid-template-columns: 150px repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.celda-horario-header {
  background: linear-gradient(135deg, #e91e63, #d33838);
  color: white;
  padding: 1rem 0.5rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.celda-dia-header {
  background: linear-gradient(135deg, #78909c, #546e7a);
  color: white;
  padding: 1rem 0.5rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.contenedor-filas {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* VISTA MÓVIL MEJORADA */
.tabla-mobile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.mobile-instructions {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}
.mobile-instructions i {
  color: #1976d2;
  font-size: 1.1rem;
  margin-top: 0.1rem;
}
.mobile-instructions p {
  margin: 0;
  color: #1976d2;
  font-size: 0.9rem;
  line-height: 1.4;
}
.mobile-selection-info {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}
.selection-count {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
}
.count-number {
  font-size: 1.5rem;
  color: #e91e63;
}
.count-text {
  font-size: 1rem;
  color: #6c757d;
}
.dia-mobile-card {
  background: white;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  transition: all 0.3s ease;
}
.dia-mobile-card.expandido {
  border-color: #e91e63;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);
}
.dia-header-mobile {
  padding: 1rem;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-height: 60px;
}
.dia-header-mobile:hover {
  background: #e9ecef;
}
.dia-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
  flex-wrap: wrap;
}
.dia-info i {
  color: #e91e63;
  font-size: 1rem;
}
.dia-nombre {
  font-size: 1rem;
  min-width: 80px;
}
.dia-cupos {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: normal;
}
.dia-estado {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.asignados-count {
  font-size: 0.8rem;
  color: #4caf50;
  font-weight: 500;
  white-space: nowrap;
}
.seleccionados-count {
  font-size: 0.8rem;
  color: #2196f3;
  font-weight: 500;
  white-space: nowrap;
}
.fa-chevron-down {
  transition: transform 0.3s ease;
  color: #6c757d;
  font-size: 0.9rem;
}
.fa-chevron-down.rotado {
  transform: rotate(180deg);
}
.horarios-mobile-list {
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.horario-mobile-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
}
.horario-mobile-item.asignado {
  background: #e8f5e9;
  border-color: #4caf50;
  cursor: default;
}
.horario-mobile-item.no-asignado {
  background: #fafafa;
  border-color: #e0e0e0;
  cursor: default;
  opacity: 0.6;
}
.horario-mobile-item.seleccionado {
  background: #e3f2fd;
  border-color: #2196f3;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
  cursor: pointer;
}
.horario-mobile-item.disponible {
  background: #f8f9fa;
  border-color: #dee2e6;
  cursor: pointer;
}
.horario-mobile-item.disponible:hover {
  background: #e3f2fd;
  border-color: #2196f3;
}
.horario-mobile-item.no-disponible {
  background: #f5f5f5;
  border-color: #e0e0e0;
  cursor: not-allowed;
  opacity: 0.6;
}
/* AÑADIDO: Estilo para "no trabaja" en móvil */
.horario-mobile-item.no-trabaja {
  background: #6c757d;
  border-color: #5a6268;
  cursor: not-allowed;
  opacity: 0.5;
}
.horario-mobile-item.no-trabaja .horario-texto,
.horario-mobile-item.no-trabaja .cupos-mobile {
  color: white;
  text-decoration: line-through;
}

.horario-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.horario-texto {
  font-weight: 600;
  font-size: 0.9rem;
  color: #2c3e50;
}
.cupos-mobile {
  font-size: 0.75rem;
  color: #6c757d;
}
.estado-mobile i {
  font-size: 1.1rem;
}
.estado-mobile .asignado { color: #4caf50; }
.estado-mobile .no-asignado { color: #bdbdbd; }
.estado-mobile .seleccionado { color: #2196f3; }
.estado-mobile .no-disponible { color: #6c757d; }
.estado-mobile .disponible { color: #28a745; }

/* Mensajes de estado */
.mensajes-estado { margin-top: 1.5rem; }
.mensaje {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.2rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.mensaje-info {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  color: #e91e63;
}
.mensaje-success {
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  color: #2e7d32;
}
.mensaje i {
  font-size: 1.3rem;
  margin-top: 0.1rem;
}
.mensaje strong {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 1rem;
}
.mensaje p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Leyenda */
.leyenda {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}
.leyenda h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1rem;
}
.leyenda-items {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.leyenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #546e7a;
}
.leyenda-item i { font-size: 1rem; }
.leyenda-item .disponible { color: #28a745; }
.leyenda-item .seleccionado { color: #2196f3; }
.leyenda-item .no-disponible { color: #6c757d; }

/* Animaciones */
@keyframes pulse {
  0% { border-color: #90caf9; }
  50% { border-color: #42a5f5; }
  100% { border-color: #90caf9; }
}
.slide-enter-active { transition: all 0.3s ease-out; }
.slide-leave-active { transition: all 0.2s ease-in; }
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

/* RESPONSIVE MEJORADO */
@media (max-width: 768px) {
  /* ... (código sin cambios) ... */
  /* MODIFICADO: repeat(7, 1fr) para 7 días */
  .fila-horario {
    grid-template-columns: 120px repeat(7, 1fr);
  }
}
@media (max-width: 480px) {
  /* ... (código sin cambios) ... */
  /* MODIFICADO: repeat(7, 1fr) para 7 días */
  .fila-horario {
    grid-template-columns: 100px repeat(7, 1fr);
  }
}
@media (min-width: 769px) and (max-width: 1024px) {
  /* MODIFICADO: repeat(7, 1fr) para 7 días */
  .fila-horario {
    grid-template-columns: 140px repeat(7, 1fr);
  }
}
/* ============================================================
   NUEVA VISTA MOBILE MEJORADA (Corregida sin tocar estética)
   ============================================================ */
@media (max-width: 768px) {
  /* SOLUCIÓN AL FOCO: Aplicado a los elementos interactivos */
  .dia-header-mobile, 
  .dia-mobile-card,
  .horario-mobile-item {
    -webkit-tap-highlight-color: transparent !important;
    outline: none !important;
    user-select: none;
  }

  /* Evita que el navegador emule un hover persistente en móviles */
  @media (hover: none) {
    .dia-header-mobile:hover,
    .dia-mobile-card:hover {
      background-color: white !important;
    }
  }

  .tabla-horarios {
    padding: 1rem;
    background: #f8fafc; 
    border: none;
  }

  .titulo {
    font-size: 1.2rem;
    justify-content: center;
    width: 100%;
    margin-bottom: 1rem;
  }

  .controles {
    width: 100%;
    justify-content: center;
    flex-direction: column;
    gap: 0.8rem;
  }

  .btn-accion {
    width: 100%;
    justify-content: center;
    padding: 0.8rem;
    font-size: 1rem;
  }

  .mobile-contenedor {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .dia-mobile-card {
    border: none;
    border-radius: 16px;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 5px solid #e0e0e0;
  }

  .dia-mobile-card.expandido {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    border-left-color: #e91e63;
  }

  .dia-header-mobile {
    padding: 1.2rem;
    background: white;
    min-height: 70px;
    display: flex; /* Asegura alineación */
    justify-content: space-between;
    align-items: center;
    border-radius: 16px;
  }

  .dia-nombre {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
  }

  .dia-cupos {
    background: #f1f5f9;
    padding: 2px 10px;
    border-radius: 20px;
    font-weight: 600;
    color: #64748b;
  }

  .horarios-mobile-list {
    padding: 0 1rem 1.2rem 1rem;
    gap: 10px;
  }

  .horario-mobile-item {
    border: 1px solid #f1f5f9;
    background: #f8fafc;
    border-radius: 12px;
    padding: 1rem;
    min-height: auto;
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .horario-mobile-item.seleccionado {
    background: #eff6ff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }

  .horario-texto {
    font-size: 1rem;
    color: #1e293b;
  }

  .cupos-mobile {
    font-weight: 500;
    color: #64748b;
    margin-top: 2px;
  }

  .estado-mobile i {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.9rem;
    background: #f1f5f9;
  }

  .estado-mobile i.seleccionado {
    background: #3b82f6;
    color: white !important;
  }

  .estado-mobile i.disponible {
    background: #dcfce7;
    color: #16a34a !important;
  }

  .horario-mobile-item.no-disponible {
    background: #fdf2f2;
    border-color: #fee2e2;
    opacity: 0.8;
  }

  .estado-mobile i.no-disponible {
    background: #fee2e2;
    color: #ef4444 !important;
  }

  .horario-mobile-item.no-trabaja {
    background: #f1f5f9;
    border: 1px dashed #cbd5e1;
    opacity: 0.5;
  }

  .fila-horario {
    grid-template-columns: 100px repeat(7, 1fr);
    gap: 4px;
  }

  .celda-horario {
    height: 65px;
    font-size: 0.75rem;
  }

  .celda-dia {
    height: 65px;
  }
}
</style>