<template>
  <div class="contenedor-vista-admin"> 

    <template v-if="!mostrarModalExito">

      <div class="encabezado-info">
        <button class="btn-volver-global" @click="volverPersonas">
          <i class="fas fa-arrow-left"></i>
          Volver a Personas
        </button>
        <Titulo texto="INGRESO DE NUEVO ALUMNO" />
      </div>

      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <span>Cargando datos de la persona...</span>
      </div>
      
      <div class="tarjeta-formulario" v-else-if="persona.dni">
        <div class="tarjeta-contenido">
          <DetallePersona :datos="persona" />
          <div class="separador-seccion"></div>

          <div class="seccion-ingreso">
            <div class="seccion-formulario">
              <h3 class="titulo-seccion-formulario">
                <i class="fas fa-tags"></i>
                Seleccionar Suscripción
              </h3>
              <ListadoSuscripciones v-model="nuevaSuscripcion" />
            </div>
            <div class="seccion-formulario">
              <h3 class="titulo-seccion-formulario">
                <i class="fas fa-dumbbell"></i>
                Seleccionar Trabajo/Metodología
              </h3>
              <ListadoTrabajos v-model="nuevoTrabajo" />
            </div>
            <div class="seccion-formulario">
              <h3 class="titulo-seccion-formulario">
                <i class="fas fa-layer-group"></i> Seleccionar Nivel
              </h3>
              <ListadoNiveles v-model="nuevoNivel" />
            </div>
            <div
              class="seccion-formulario seccion-horarios"
              :class="{ 'deshabilitado': !nuevaSuscripcion || nuevaSuscripcion === 'Día Libre' }"
            >
              <p v-if="!nuevaSuscripcion" class="info-horarios">
                <i class="fas fa-info-circle"></i>
                Selecciona una suscripción para habilitar los horarios.
              </p>
              <p v-else-if="nuevaSuscripcion === 'Día Libre'" class="info-horarios">
                <i class="fas fa-info-circle"></i>
                La suscripción "Día Libre" no requiere horarios fijos.
              </p>
              <div class="contenedor-tabla-horarios">
                <TablaHorarios
                  :horarios-alumno="[]"
                  :suscripcion="nuevaSuscripcion"
                  :modo-embebido="true"
                  @horarios-actualizados="actualizarHorarios"
                />
              </div>
            </div>
          </div>

          <div class="seccion-botones">
            <div class="botones-accion">
              <button class="btn-accion btn-cancelar" @click="volverPersonas">
                <i class="fas fa-times"></i>
                Cancelar Ingreso
              </button>
              <button
                class="btn-accion btn-confirmar"
                @click="confirmarIngreso"
                :disabled="!formularioIngresoValido"
              >
                <i class="fas fa-check"></i>
                Confirmar Ingreso
              </button>
            </div>
            <p v-if="mostrarMensajeValidacion" class="mensaje-validacion">
              <i class="fas fa-exclamation-triangle"></i> Por favor, completa Suscripción, Trabajo, Nivel y Horarios (si aplica).
            </p>
          </div>
        </div>
      </div>

      <div v-else class="sin-persona">
        <i class="fas fa-exclamation-triangle fa-3x"></i>
        <h3>No se encontró información de la persona</h3>
        <p>Por favor, vuelve a la lista de personas</p>
        <button class="btn-volver-centrado" @click="volverPersonas">
          <i class="fas fa-arrow-left"></i>
          Volver a Personas
        </button>
      </div>
      
    </template>

    <Transition name="modal-fade">
      <div v-if="mostrarModalConfirmacion" class="modal-overlay">
        <div class="modal-confirmacion"> <div class="modal-header">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Confirmar Ingreso</h3>
          </div>
          <div class="modal-body">
            <p v-if="persona">
              ¿Estás seguro que desea realizar el ingreso de 
              <strong>{{ persona.nombre }} {{ persona.apellido }}</strong>?
            </p>
            <p style="margin-top: 1rem; font-size: 0.95rem; color: #495057;">
              Esta pasará a ser alumno, ocupará los cupos de los horarios asignados y se le generará la cuota pertinente.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-modal btn-cancelar-modal" @click="cancelarIngreso">
              Cancelar
            </button>
            <button class="btn-modal btn-confirmar-modal" @click="realizarIngreso">
              Sí, Confirmar
            </button>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="modal-fade">
      <div v-if="mostrarModalExito" class="modal-overlay">
        <div class="modal-exito">
          <div class="modal-header-exito">
            <i class="fas fa-check-circle"></i>
            <h3>Ingreso Confirmado</h3>
          </div>
          <div class="modal-body-exito">
            <p>
              <b v-if="persona">{{ persona.nombre }} {{ persona.apellido }}</b>
              <b v-else>El alumno</b>
              ha sido ingresado correctamente.
            </p>
            <p>Ya se encuentra activo y se generó la cuota correspondiente.</p>
          </div>
          <div class="modal-footer-exito">
            <button class="btn-modal-continuar" @click="handleContinuar">
              Continuar
            </button>
          </div>
        </div>
      </div>
    </Transition>
    </div> 
</template>
    
<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, watch } from 'vue';
import ListadoSuscripciones from './Listados/ListadoSuscripciones.vue';
import ListadoTrabajos from './Listados/ListadoTrabajos.vue';
import ListadoNiveles from './Listados/ListadoNiveles.vue';
import TablaHorarios from '../Tablas y Filas/TablaHorario/TablaHorarios.vue';
import DetallePersona from './DetallePersona.vue';
import Titulo from '../Titulo.vue';

const props = defineProps({
  personaSeleccionada: Object
});
const personaID = computed(() => props.personaSeleccionada)

const persona = ref({});

const emit = defineEmits(['volverPersonas', 'ingresoConfirmado']);

// Refs para los datos NUEVOS de ingreso
const nuevaSuscripcion = ref('');
const nuevoTrabajo = ref('');
const nuevoNivel = ref('');
const nuevosHorarios = ref([]);
const mostrarMensajeValidacion = ref(false);

import { obtenerPersonaPorDni, activarAlumno } from '@/api/services/personaService';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const loading = ref(false);

// --- MODIFICADO ---
const mostrarModalExito = ref(false);
const mostrarModalConfirmacion = ref(false); // <-- AÑADIDO
const datosParaEmitir = ref(null);
// --- FIN MODIFICADO ---

onMounted(async () => {
  loading.value = true
  
  try {
    if (props.personaSeleccionada && personaID.value["dni"]) {
      const respuestaPersona = await obtenerPersonaPorDni(personaID.value["dni"])
      persona.value = respuestaPersona;
    }
  } catch (error) {
    console.error('Error al cargar la información del alumno:', error)
  } finally {
    loading.value = false
  }
});

// --- VALIDACIÓN (sin cambios) ---
const formularioIngresoValido = computed(() => {
  const tieneSuscripcion = !!nuevaSuscripcion.value;
  const tieneTrabajo = !!nuevoTrabajo.value;
  const tieneNivel = !!nuevoNivel.value;
  let tieneHorariosValidos = true;

  if (tieneSuscripcion && nuevaSuscripcion.value !== 'Día Libre') {
    tieneHorariosValidos = nuevosHorarios.value && nuevosHorarios.value.length > 0;
  }
  return tieneSuscripcion && tieneTrabajo && tieneNivel && tieneHorariosValidos;
});

// --- WATCH (sin cambios) ---
watch(nuevaSuscripcion, (newValue, oldValue) => {
  if (oldValue !== undefined && newValue !== oldValue) {
    console.log(`Suscripción cambiada de "${oldValue}" a "${newValue}". Reseteando horarios seleccionados.`);
    nuevosHorarios.value = [];
    mostrarMensajeValidacion.value = false;
  } else if (newValue === 'Día Libre') {
      nuevosHorarios.value = [];
      mostrarMensajeValidacion.value = false;
  }
});

const volverPersonas = () => { emit('volverPersonas'); };

const actualizarHorarios = (datosEmitidos) => {
  const horariosArray = datosEmitidos?.horarios || []; 
  nuevosHorarios.value = horariosArray;
  console.log("IngresoPersona: Horarios actualizados (array extraído):", nuevosHorarios.value);
  if (formularioIngresoValido.value) {
    mostrarMensajeValidacion.value = false;
  }
};


// --- FUNCIÓN (1) - Se llama al hacer clic en el BOTÓN "Confirmar Ingreso" ---
const confirmarIngreso = () => {
  // 1. Valida el formulario
  if (!formularioIngresoValido.value) {
    console.error("Formulario de ingreso inválido.");
    mostrarMensajeValidacion.value = true;
    return;
  }
  
  // 2. Si es válido, muestra el modal de confirmación
  mostrarMensajeValidacion.value = false;
  mostrarModalConfirmacion.value = true;
};

// --- FUNCIÓN (2) - Se llama al hacer clic en "Cancelar" DENTRO DEL MODAL ---
const cancelarIngreso = () => {
  mostrarModalConfirmacion.value = false;
};

// --- FUNCIÓN (3) - Se llama al hacer clic en "Sí, Confirmar" DENTRO DEL MODAL ---
// (Esta contiene toda la lógica de API que antes estaba en 'confirmarIngreso')
const realizarIngreso = async () => {
  // 1. Oculta el modal de confirmación
  mostrarModalConfirmacion.value = false;

  // 2. Prepara los datos para la API
  const datosParaAPI = {
    dni: persona.value.dni, 
    sexo: persona.value.sexo || 'M',
    nombreTrabajo: nuevoTrabajo.value,
    nombreSuscripcion: nuevaSuscripcion.value,
    nivel: nuevoNivel.value || null, 
    deporte: persona.value.deporte || null,
    horarios: nuevaSuscripcion.value === 'Día Libre' 
      ? []
      : (nuevosHorarios.value || []).map(item => ({
          nroGrupo: item.nroGrupo,
          dia: item.dia
        }))
  };

  // 3. Llama a la API
  try {
    console.log("Enviando datos a la API para activar:", datosParaAPI);
    const alumnoActivado = await activarAlumno(datosParaAPI);
    console.log('Alumno activado con éxito por la API:', alumnoActivado);
    
    // 4. Si la API tuvo éxito, prepara los datos para el modal de ÉXITO
    const datosCompletosIngreso = {
      ...persona.value,
      suscripcion: nuevaSuscripcion.value,
      trabajoactual: nuevoTrabajo.value,
      nivel: nuevoNivel.value,
      horarios: datosParaAPI.horarios,
      activo: true,
      cuotasPendientes: 0,
      turno: '',
    };

    // (Lógica de turno - Sin cambios)
    if (datosCompletosIngreso.horarios && datosCompletosIngreso.horarios.length > 0) {
      const primerHorario = datosCompletosIngreso.horarios[0]?.horario;
      if (primerHorario && typeof primerHorario === 'string') {
          try {
              const horaInicioStr = primerHorario.split(':')[0];
              const horaInicio = parseInt(horaInicioStr);
              if (!isNaN(horaInicio)) {
                  datosCompletosIngreso.turno = horaInicio < 14 ? 'Mañana' : 'Tarde';
              } else { console.warn("No se pudo parsear hora:", primerHorario); }
          } catch (e) { console.error("Error procesando horario:", primerHorario, e); }
      }
    }

    console.log("Confirmando ingreso con datos completos (después de API):", datosCompletosIngreso);
    // Guarda los datos y muestra el modal de ÉXITO
    datosParaEmitir.value = datosCompletosIngreso;
    mostrarModalExito.value = true;
    
  } catch (error) {
    // 5. Si la API falla, muestra un error
    console.error('Fallo al activar alumno en la API:', error);
    alert(`Error al activar: ${error.response?.data?.detail || error.message}`);
  } finally {
    // (Cargando, etc.)
  }
};

// --- FUNCIÓN (4) - Se llama desde el modal de ÉXITO ---
function handleContinuar() {
  if (datosParaEmitir.value) {
    emit('ingresoConfirmado');
  }
  mostrarModalExito.value = false;
}
</script>

<style scoped>
/* Solo quedan los estilos ÚNICOS de este componente: */

.sin-persona { 
  text-align: center; 
  padding: 4rem 2rem; 
  color: #6c757d; 
}
.sin-persona i { 
  margin-bottom: 1.5rem; 
  color: #e9ecef; 
}
.sin-persona h3 { 
  margin-bottom: 1rem; 
  color: #495057; 
  font-size: 1.5rem; 
}
.sin-persona p { 
  margin-bottom: 2rem; 
  font-size: 1rem; 
}

.btn-volver-centrado { 
  display: inline-flex; 
  align-items: center; 
  gap: 0.5rem; 
  padding: 0.8rem 1.5rem; 
  border: 2px solid #e91e63; 
  background: white; 
  border-radius: 25px; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  font-family: 'Poppins', sans-serif; 
  font-weight: 500; 
  color: #e91e63; 
  text-decoration: none; 
}
.btn-volver-centrado:hover { 
  background: #e91e63; 
  color: white; 
  transform: translateY(-1px); 
}

/* El resto de los estilos (botones, layout, etc.)
   vienen del CSS Global. */
</style>