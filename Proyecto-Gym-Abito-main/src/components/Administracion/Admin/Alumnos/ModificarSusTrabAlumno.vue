<template>
  <div class="contenedor-modificar-sustrab">
    <div class="tarjeta-modificacion">
      <div class="header-modificacion">
        <h2 class="titulo-modificacion">
          <i class="fas fa-sync-alt"></i>
          Modificar Suscripción, Trabajo y Nivel
        </h2>
        <p class="subtitulo-modificacion">Editando información de {{ alumno.nombre }} {{ alumno.apellido }}</p>
      </div>

      <div class="contenido-modificacion">
        <div class="formulario-modificacion">
          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">Suscripción</h3>
            <ListadoSuscripciones v-model="datosModificados.suscripcion" />
          </div>

          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">Trabajo Actual</h3>
            <ListadoTrabajos v-model="datosModificados.trabajoactual" />
          </div>

          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">Nivel</h3>
            <ListadoNiveles v-model="datosModificados.nivel" />
          </div>

          <div class="seccion-formulario" v-show="debeMostrarHorarios">
            <h3 class="titulo-seccion-formulario">Horarios</h3>
            <p v-if="suscripcionCambiada" class="advertencia-horarios">
              <i class="fas fa-exclamation-triangle"></i>
              La suscripción ha cambiado. Debes actualizar los horarios del alumno.
            </p>
            <div class="contenedor-tabla-horarios" @click.stop>
              <TablaHorarios
                :horarios-alumno="props.horarioAlumno"
                :suscripcion="datosModificados.suscripcion"
                :modo-embebido="true"
                @horarios-actualizados="actualizarHorarios"
              />
            </div>
          </div>

          <div class="botones-formulario">
            <button type="button" class="btn-cancelar" @click="cancelar">
              <i class="fas fa-times"></i>
              Cancelar Operación
            </button>
            <button type="button" class="btn-guardar" @click="confirmarGuardar" :disabled="!formularioValido">
              <i class="fas fa-save"></i>
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarConfirmacion" class="modal-overlay">
      <div class="modal-confirmacion">
        <div class="modal-header">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Confirmar Cambios</h3>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro que deseas actualizar la suscripción, trabajo y nivel del alumno?</p>
        </div>
        <div class="modal-footer">
          <button class="btn-modal btn-cancelar-modal" @click="cancelarGuardar">
            No, Cancelar
          </button>
          <button class="btn-modal btn-confirmar-modal" @click="guardarCambios">
            Sí, Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import TablaHorarios from '../../Tablas y Filas/TablaHorario/TablaHorarios.vue';
import ListadoSuscripciones from '../Listados/ListadoSuscripciones.vue';
import ListadoTrabajos from '../Listados/ListadoTrabajos.vue';
import ListadoNiveles from '../Listados/ListadoNiveles.vue';

const props = defineProps({
  alumno: Object,
  horarioAlumno: Object // Espera { horarios: [...] }
});

const emit = defineEmits(['guardar-cambios', 'cancelar']);

// --- Estado Local ---
const datosModificados = ref({
  suscripcion: '',
  trabajoactual: '',
  nivel: ''
});
const horariosModificados = ref([]); 
const suscripcionOriginal = ref('');
const trabajoOriginal = ref('');
const nivelOriginal = ref('');
const mostrarConfirmacion = ref(false);

const horariosConfirmadosDespuesDeCambio = ref(true); 

// --- Computed Properties ---

const suscripcionCambiada = computed(() => {
  return datosModificados.value.suscripcion !== suscripcionOriginal.value;
});

const debeMostrarHorarios = computed(() => {
  return suscripcionCambiada.value && datosModificados.value.suscripcion !== 'Día Libre';
});

const formularioValido = computed(() => {
  const baseValido = datosModificados.value.suscripcion &&
                      datosModificados.value.trabajoactual &&
                      datosModificados.value.nivel;
  if (!baseValido) return false;
  if (datosModificados.value.suscripcion === 'Día Libre') {
    return true;
  }
  if (!suscripcionCambiada.value) {
    return true;
  }
  return horariosConfirmadosDespuesDeCambio.value;
});

const hayCambios = () => {
  const sortFn = (a, b) => a.dia.localeCompare(b.dia) || String(a.nroGrupo).localeCompare(String(b.nroGrupo));
  
  const horariosModificadosSorted = JSON.stringify([...(horariosModificados.value.horarios || [])].sort(sortFn));
  const horariosOriginalesSorted = JSON.stringify([...(props.horarioAlumno.horarios || [])].sort(sortFn));

  // Compara si los datos base cambiaron
  const datosBaseCambiados = datosModificados.value.suscripcion !== suscripcionOriginal.value ||
                          datosModificados.value.trabajoactual !== trabajoOriginal.value ||
                          datosModificados.value.nivel !== nivelOriginal.value;

  // Si la suscripción cambió, los horarios *deben* ser diferentes (incluso si están vacíos)
  if (suscripcionCambiada.value) {
    return datosBaseCambiados || (horariosModificadosSorted !== horariosOriginalesSorted);
  }
  
  // Si la suscripción no cambió, no nos importa si los horarios cambiaron (ya que no se deberían poder cambiar)
  return datosBaseCambiados;
};


// --- Funciones de Normalización y Montaje ---

const normalizarNombreTrabajo = (nombre) => {
  if (!nombre) return nombre;
  const mapeoNombres = {
    'Musculacion': 'Musculación', 'Musculación': 'Musculación', 'Funcional': 'Funcional',
    'Mantenimiento': 'Mantenimiento', 'Rehabilitacion': 'Rehabilitación',
    'Rehabilitación': 'Rehabilitación', 'Aerobico': 'Aeróbico', 'Aeróbico': 'Aeróbico',
    'Preparación física para deportes': 'Preparación física para deportes'
  };
  return mapeoNombres[nombre] || nombre;
};

onMounted(() => {
  if (props.alumno) {
      const trabajoNormalizado = normalizarNombreTrabajo(props.alumno.trabajoactual);
      datosModificados.value.suscripcion = props.alumno.suscripcion;
      datosModificados.value.trabajoactual = trabajoNormalizado;
      datosModificados.value.nivel = props.alumno.nivel || '';
      suscripcionOriginal.value = props.alumno.suscripcion;
      trabajoOriginal.value = trabajoNormalizado;
      nivelOriginal.value = props.alumno.nivel || '';
  }
  if (props.horarioAlumno) {
      // horariosModificados.value = JSON.parse(JSON.stringify(props.horarioAlumno));
      horariosModificados.value == props.horarioAlumno;
      console.log("asdadasad", props.horarioAlumno)
  } else {
      horariosModificados.value = { horarios: [] };
  }
  horariosConfirmadosDespuesDeCambio.value = true;
});

// --- LÓGICA DE ACTUALIZACIÓN (Watch y Handlers) ---

watch(() => datosModificados.value.suscripcion, (nuevaSuscripcion, viejaSuscripcion) => {
  if (viejaSuscripcion === undefined) {
    return; 
  }
  if (nuevaSuscripcion !== suscripcionOriginal.value) {
    console.log('Suscripción cambiada -> Forzando re-selección de horarios.');
    horariosConfirmadosDespuesDeCambio.value = false;
    horariosModificados.value = { horarios: [] };
  } else if (nuevaSuscripcion === suscripcionOriginal.value) {
    console.log('Suscripción volvió a la original -> Restaurando horarios originales.');
    horariosConfirmadosDespuesDeCambio.value = true;
    horariosModificados.value = JSON.parse(JSON.stringify(props.horarioAlumno));
  }
});

const actualizarHorarios = (nuevosHorariosObjeto) => {
  console.log('Horarios actualizados y confirmados desde TablaHorarios:', nuevosHorariosObjeto);
  horariosModificados.value = JSON.parse(JSON.stringify(nuevosHorariosObjeto));
  horariosConfirmadosDespuesDeCambio.value = true;
};

// --- Lógica de Guardado (CORREGIDA) ---

const confirmarGuardar = () => {
  if (!hayCambios()) {
    emit('cancelar');
    return;
  }
  if (!formularioValido.value) {
    if (suscripcionCambiada.value && !horariosConfirmadosDespuesDeCambio.value && datosModificados.value.suscripcion !== 'Día Libre') {
        alert('La suscripción cambió. Debes seleccionar y guardar los nuevos horarios usando el botón "Guardar Cambios" dentro de la tabla de horarios.');
    } else if (!datosModificados.value.suscripcion || !datosModificados.value.trabajoactual || !datosModificados.value.nivel) {
        alert('Por favor, completa los campos de Suscripción, Trabajo Actual y Nivel.');
    } else {
        alert('El formulario no es válido. Revisa los campos requeridos.');
    }
    return;
  }
  mostrarConfirmacion.value = true;
};

/**
 * Se llama desde el modal de confirmación.
 * Prepara y emite el payload final con la ESTRUCTURA CORRECTA.
 */
const guardarCambios = () => {
  mostrarConfirmacion.value = false;
  try {
    
    // 1. Define el array de horarios que se va a enviar
    let horariosArrayFinal = [];

    // 2. Comprueba si la suscripción se cambió
    if (suscripcionCambiada.value) {
      
      // Si cambió y es "Día Libre", envía un array vacío
      if (datosModificados.value.suscripcion === 'Día Libre') {
        horariosArrayFinal = [];
      } else {
        // Si cambió y NO es "Día Libre", extrae el array de 'horariosModificados'
        horariosArrayFinal = horariosModificados.value.horarios || [];
      }

    } else {
      // Si la suscripción NO cambió, envía los horarios originales que vinieron del padre
      horariosArrayFinal = props.horarioAlumno.horarios || [];
    }

    // 3. Construye el payload con la ESTRUCTURA CORRECTA
    const datosEnviar = {
      alumno: {
        suscripcion: datosModificados.value.suscripcion,
        trabajoactual: datosModificados.value.trabajoactual,
        nivel: datosModificados.value.nivel
      },
      // Asigna el ARRAY (horariosArrayFinal) a la clave 'horarios'
      horarios: horariosArrayFinal 
    };

    console.log('Guardando cambios (Payload Corregido):', datosEnviar);
    emit('guardar-cambios', datosEnviar);

  } catch (error) {
    console.error('Error al guardar cambios:', error);
    alert('Error al guardar los cambios. Por favor, intenta nuevamente.');
  }
};

const cancelarGuardar = () => { mostrarConfirmacion.value = false; };
const cancelar = () => { emit('cancelar'); };

</script>

<style scoped>
/* Tus estilos (sin cambios) */
.contenedor-modificar-sustrab {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
}
.tarjeta-modificacion {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.header-modificacion {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  padding: 2rem;
  color: white;
}
.titulo-modificacion {
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.subtitulo-modificacion {
  margin: 0;
  opacity: 0.9;
}
.contenido-modificacion {
  padding: 2rem;
}
.seccion-formulario {
  margin-bottom: 2.5rem;
}
.titulo-seccion-formulario {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #FF9800;
  padding-bottom: 0.5rem;
}

.advertencia-horarios {
  background: #FFF3E0;
  border: 1px solid #FF9800;
  border-radius: 8px;
  padding: 1rem;
  color: #E65100;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.contenedor-tabla-horarios {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
}
.seccion-formulario {
  transition: all 0.3s ease-in-out;
}
.seccion-formulario:last-of-type {
  animation: fadeInUp 0.5s ease-out;
}
.botones-formulario {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}
.btn-cancelar, .btn-guardar { 
  display: flex; 
  align-items: center; 
  gap: 0.5rem; 
  padding: 0.8rem 1.5rem; 
  border: none; 
  border-radius: 8px; 
  font-family: 'Poppins', sans-serif; 
  font-weight: 600; 
  font-size: 1rem; 
  cursor: pointer; 
  transition: all 0.3s ease; 
}
.btn-cancelar { 
  background: #f44336; 
  color: white; 
}
.btn-cancelar:hover { 
  background: #d32f2f; 
  transform: translateY(-1px); 
}
.btn-guardar { 
  background: #4caf50; 
  color: white; 
}
.btn-guardar:hover:not(:disabled) { 
  background: #388e3c; 
  transform: translateY(-1px); 
}
.btn-guardar:disabled { 
  background: #cccccc; 
  cursor: not-allowed; 
  transform: none; 
}

/* ===== INICIO: CORRECCIÓN RESPONSIVE ===== */

@media (max-width: 768px) { 
  /* Quitamos el padding del contenedor hijo para que 
    herede el padding del padre (InfoAlumno) 
  */
  .contenedor-modificar-sustrab { 
    padding: 0; 
    border-radius: 0;
    box-shadow: none;
    background: none;
    min-height: auto; /* Deja que el contenido defina la altura */
  } 
  
  /* Reducimos el padding interno del contenido */
  .contenido-modificacion {
    padding: 1rem;
  }
  
  /* Reducimos el padding del header */
  .header-modificacion {
    padding: 1.5rem;
  }
  
  /* Reducimos el padding de la tabla */
  .contenedor-tabla-horarios {
    padding: 0.5rem;
  }
  
  .botones-formulario { 
    flex-direction: column; 
  } 
}

@media (max-width: 480px) {
  /* Reducimos aún más el padding en celulares */
  .contenido-modificacion {
    padding: 0.5rem;
  }
  
  .header-modificacion {
    padding: 1.5rem 1rem;
  }
  
  /* Quitamos el padding y bordes del contenedor de la tabla
    para darle el máximo espacio posible.
  */
  .contenedor-tabla-horarios {
    padding: 0;
    border: none;
    background: none;
  }
}
/* ===== FIN: CORRECCIÓN RESPONSIVE ===== */
</style>