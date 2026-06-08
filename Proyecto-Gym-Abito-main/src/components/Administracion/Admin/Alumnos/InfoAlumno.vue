<template>
  <div class="contenedor-info-alumno">
    <div class="encabezado-info" v-if="!mostrandoModificacion">
      <button class="btn-volver-global" @click="volverAlumnos">
        <i class="fas fa-arrow-left"></i>
        Volver a Alumnos
      </button>
      <Titulo texto="INFORMACIÓN DEL ALUMNO" />
    </div>
    <div v-if="mostrandoModificacion === 'datos'">
      <ModificarDatosAlumno
        :alumno="alumno"
        @guardar-cambios="manejarGuardarDatos"
        @cancelar="mostrandoModificacion = null"
      />
    </div>
    <div v-if="mostrandoModificacion === 'suscripcion-trabajo'">
      <ModificarSusTrabAlumno
        :alumno="alumno"
        :horarioAlumno="horariosAlumno"
        @guardar-cambios="manejarGuardarSuscripcionTrabajo"
        @cancelar="mostrandoModificacion = null"
      />
    </div>
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <span>Cargando información del alumno...</span>
    </div>
    <div class="tarjeta-alumno" v-else-if="alumno && !mostrandoModificacion">
      <div class="tarjeta-contenido">
        <DetallePersona :datos="alumno" />
        <div class="separador-seccion"></div>

        <div class="seccion-info">
          <TablaHorarios
            :horarios-alumno="horariosAlumno"
            :suscripcion="alumno.suscripcion"
            @horarios-actualizados="manejarHorariosActualizados"
          />
        </div>

        <div class="separador-seccion"></div>

        <div class="seccion-info">
          <h3 class="titulo-seccion">
            <i class="fas fa-history"></i>
            Historial de Cuotas
          </h3>
          <template v-if="!mostrandoModificadorCuota">
            <TablaCuota 
              :modo="'infoAlumno'" 
              :cuotas="cuotas" 
              :cargando="loading"
              @solicitud-modificar-cuota="manejarSolicitudModificar"
              @solicitud-eliminar-cuota="manejarSolicitudEliminar"
              @PagoExitoso="ProcesarPagoExistoso"
            />
          </template>
          <template v-else>
            <ModificarCuota
              :cuota-original="cuotaParaModificar"
              @cancelar-modificacion="cancelarModificacionCuota"
              @guardar-modificacion-cuota="guardarModificacionCuota"
            />
          </template>
        </div>

        <div class="seccion-botones">
          <div class="botones-accion">
            <button class="btn-accion btn-modificar" @click="modificarDatos">
              <i class="fas fa-edit"></i>
              Modificar Datos
            </button>
            <button class="btn-accion btn-suscripcion" @click="modificarSuscripcionTrabajo">
              <i class="fas fa-sync-alt"></i>
              Modificar Suscripción y Trabajo
            </button>
            <button 
              class="btn-accion" 
              :class="alumno.activo ? 'btn-estado-inactivo' : 'btn-estado-activo'" 
              @click="iniciarCambioEstado"
            >
              <i class="fas fa-power-off"></i>
              {{ alumno.activo ? 'Poner Inactivo' : 'Activar Alumno' }}
            </button>
            <button class="btn-accion btn-eliminar" @click="eliminarAlumno">
              <i class="fas fa-trash"></i>
              Eliminar Alumno
            </button>
          </div>
        </div>
        <!-- ================================================= -->
    <!-- ===            MODALES GENÉRICOS              === -->
    <!-- ================================================= -->

    <!-- 1. Modal de Confirmación Genérico -->
          <Transition name="modal-fade">
            <div v-if="mostrarModalConfirmacion" class="modal-overlay">
              <!-- Borde superior dinámico según el tipo de acción (rojo o naranja/verde) -->
              <div class="modal-confirmacion" :style="estiloBotonConfirmar === 'btn-confirmar-peligro' ? 'border-top: 5px solid #F44336;' : 'border-top: 5px solid #FF9800;'"> 
                
                <div class="modal-header">
                  <i class="fas fa-exclamation-triangle" 
                    :style="estiloBotonConfirmar === 'btn-confirmar-peligro' ? 'color: #F44336;' : 'color: #FF9800;'">
                  </i>
                  <h3>{{ tituloModalConfirmacion }}</h3>
                </div>
                
                <div class="modal-body">
                  <!-- Usamos v-html para inyectar el mensaje formateado desde el script -->
                  <div v-html="mensajeModalConfirmacion"></div>
                </div>
                
                <div class="modal-footer">
                  <button class="btn-modal btn-cancelar-modal" @click="mostrarModalConfirmacion = false">
                    Cancelar
                  </button>
                  <!-- El estilo del botón confirmar también es dinámico -->
                  <button 
                    class="btn-modal" 
                    :class="estiloBotonConfirmar === 'btn-confirmar-peligro' ? 'btn-cancelar-modal' : 'btn-confirmar-modal'"
                    :style="estiloBotonConfirmar === 'btn-confirmar-peligro' ? 'background-color: #F44336; color: white;' : ''"
                    @click="ejecutarAccionConfirmada"
                  >
                    Sí, Confirmar
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <!-- 2. Modal de Éxito -->
          <Transition name="modal-fade">
            <div v-if="mostrarModalExito" class="modal-overlay">
              <div class="modal-exito">
                <div class="modal-header-exito">
                  <i class="fas fa-check-circle"></i>
                  <h3>Operación Exitosa</h3>
                </div>
                <div class="modal-body-exito">
                  <p>{{ mensajeModalExito }}</p>
                </div>
                <div class="modal-footer-exito">
                  <button class="btn-modal-continuar" @click="handleContinuarExito">
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <!-- 3. Modal de Error -->
          <Transition name="modal-fade">
            <div v-if="mostrarModalError" class="modal-overlay">
              <div class="modal-error"> 
                <div class="modal-header-error">
                  <i class="fas fa-exclamation-triangle"></i> 
                  <h3>Error</h3>
                </div>
                <div class="modal-body-error">
                  <p>{{ mensajeModalError }}</p> 
                </div>
                <div class="modal-footer-error">
                  <button class="btn-modal-error" @click="handleContinuarError">
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
    </div>

    <div v-else-if="!mostrandoModificacion" class="sin-alumno">
        <i class="fas fa-exclamation-triangle fa-3x"></i>
        <h3>No se encontró información del alumno</h3>
        <p>Por favor, vuelve a la lista de alumnos</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TablaCuota from '../../Tablas y Filas/TablaCuotas/TablaCuotas.vue'
import TablaHorarios from '../../Tablas y Filas/TablaHorario/TablaHorarios.vue'
import ModificarDatosAlumno from './ModificarDatosAlumno.vue'
import ModificarSusTrabAlumno from './ModificarSusTrabAlumno.vue'
import DetallePersona from '../DetallePersona.vue'; // <-- Importado
import Titulo from '../../Titulo.vue';
import ModificarCuota from './ModificarCuota.vue'; 

import {
  eliminarAlumnoAPI,
  desactivarAlumnoAPI,
  reactivarAlumnoAPI
} from '@/api/services/alumnoService';

/**
 * Compara dos listas de horarios para ver si son idénticas en contenido.
 * @param {Array} horariosA - Lista de horarios [{ dia: 'Lunes', nroGrupo: '1' }]
 * @param {Array} horariosB - Otra lista de horarios
 * @returns {boolean} - True si son iguales, false si no.
 */
function sonHorariosIguales(horariosA, horariosB) {
  if (!horariosA || !horariosB) {
      // Maneja el caso de que uno sea nulo o undefined
      return !horariosA && !horariosB;
  }

  if (horariosA.length !== horariosB.length) {
      return false; // Diferente cantidad
  }

  // Normaliza y crea un Set para comparación
  // Usamos trim() para limpiar espacios como "4 " -> "4"
  const setA = new Set(
      horariosA.map(h => `${h.dia}|${h.nroGrupo.trim()}`)
  );

  for (const h of horariosB) {
      if (!setA.has(`${h.dia}|${h.nroGrupo.trim()}`)) {
      // Si un horario de B no está en A, no son iguales
      return false;
      }
  }

  return true; // Si pasó todas las pruebas, son iguales
}

// <-- AÑADE ESTA LÍNEA (ajusta la ruta si es necesario)

// ... (debajo de 'const cuotas = ref([])')
const cuotaParaModificar = ref(null); // <-- AÑADE ESTA LÍNEA

// ... (debajo de 'const alumnoID = computed(...)')
const mostrandoModificadorCuota = computed(() => cuotaParaModificar.value !== null); // <-- AÑADE ESTA LÍNEA
const props = defineProps({
  alumnoSeleccionado: Object
})

const emit = defineEmits(['volverAlumnos', 'actualizarHorarios'])

const mostrarModalConfirmacion = ref(false);
const tituloModalConfirmacion = ref('');
const mensajeModalConfirmacion = ref('');
const funcionConfirmar = ref(null); // Guardará la función a ejecutar al confirmar
const claseBotonConfirmar = ref(''); // 'btn-confirmar-normal' o 'btn-confirmar-peligro'
const estiloBordeModal = ref(''); // Para cambiar color del borde superior
const estiloIconoModal = ref(''); // Para cambiar color del icono
const mostrandoModificacion = ref(null);
const mostrarModalExito = ref(false);
const mensajeModalExito = ref('');


// Función maestra que ejecuta la acción guardada
const ejecutarAccionConfirmada = async () => { // <--- NOMBRE CORREGIDO
  mostrarModalConfirmacion.value = false;
  if (funcionConfirmar.value) {
    await funcionConfirmar.value();
  }
}

 // Para el texto del modal de éxito
const alumnoID = computed(() => props.alumnoSeleccionado)

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

import {
  obtenerAlumnoPorDni,
  obtenerHorariosPorDni,
  actualizarHorariosAlumno,
  actualizarPerfilAlumno
} from '@/api/services/alumnoService'

import {
  obtenerCuotasDeAlumno,
  modificarCuota,
  eliminarCuota
} from '@/api/services/cuotasService'

const loading = ref(false)
const alumno = ref(null)
const horariosAlumno = ref([])
const cuotas = ref([])

async function cargarDatosCompletosAlumno() {
  // 1. Inicia el estado de carga
  loading.value = true
  // Opcional: Simula un retraso (quizás para UI)
  await sleep(700) 
  try {
    const dni = alumnoID.value?.dni // Acceso seguro usando optional chaining
    // 2. Verifica si tenemos un DNI válido antes de hacer las llamadas
    if (dni) {
      // 3. Ejecuta todas las peticiones
      // (Puedes ejecutarlas en paralelo si no dependen entre sí)
      const respuestaAlumno = await obtenerAlumnoPorDni(dni)
      alumno.value = respuestaAlumno

      const respuestaHorarios = await obtenerHorariosPorDni(dni)
      horariosAlumno.value = respuestaHorarios

      const respuestaCuotas = await obtenerCuotasDeAlumno(dni)
      cuotas.value = respuestaCuotas
      
    } else {
      console.warn('No se proporcionó un DNI para cargar los datos.');
    }
  } catch (error) {
    // 4. Manejo centralizado de errores
    console.error('Error al cargar la información del alumno:', error)
  } finally {
    // 5. Finaliza el estado de carga (siempre)
    loading.value = false
  }
}

onMounted(async () => {
  await cargarDatosCompletosAlumno()
  // alert(JSON.stringify(alumno.value, null, 2));
})




const volverAlumnos = () => { emit('volverAlumnos') }

const manejarHorariosActualizados = async (nuevosHorarios) => {
  try {
    await actualizarHorariosAlumno(alumnoID.value["dni"], nuevosHorarios["horarios"]);
    // 3. MANEJO DE ÉXITO (Profesional)
    console.log(`Horarios actualizados exitosamente para ${alumnoID.value["dni"]}`);
    // (Opcional: mostrar mensaje de éxito en la UI)
    // mensajeConfirmacion.value = "Horarios guardados con éxito.";
    // setTimeout(() => mensajeConfirmacion.value = '', 3000);
  } catch (error) {
    // 4. MANEJO DE ERRORES (Profesional)
    console.error("Error al modificar los datos:", error);
    // Muestra un mensaje de error claro al usuario
    alert(`Error al guardar: ${error.response?.data?.error || 'No se pudieron actualizar los horarios. Verifique la capacidad.'}`);
  } finally {
    // Una vez finalizada la actualización, refresca los horarios
    console.log(`Refrescando horarios para ${alumnoID.value["dni"]}...`);
    
    try {
      // --- Tu lógica de API (Obtener horarios) ---
      const respuestaHorarios = await obtenerHorariosPorDni(alumnoID.value["dni"]);
      horariosAlumno.value = respuestaHorarios;
    } catch (fetchError) {
        console.error("Error al refrescar los horarios:", fetchError);
        alert("Se intentó guardar, pero hubo un error al recargar la vista. Por favor, verifique.");
    }
    // (Opcional: finalizar estado de carga)
    // actualizando.value = false;
  }
}

const modificarDatos = () => { mostrandoModificacion.value = 'datos' }
const modificarSuscripcionTrabajo = () => { mostrandoModificacion.value = 'suscripcion-trabajo' }

// ----- INICIO: Manejo de activar o descativar alumno (CON MODALES) -----

// 1. Muestra el modal de confirmación
const iniciarCambioEstado = () => {
  const esActivo = alumno.value.activo;
  
  // 1. Configuramos textos y estilos
  tituloModalConfirmacion.value = 'Confirmar Cambio de Estado';
  
  if (esActivo) {
    // Va a desactivar -> Peligroso (Rojo/Naranja)
    claseBotonConfirmar.value = 'btn-confirmar-peligro';
    estiloBordeModal.value = 'border-top: 5px solid #E65100 !important;';
    estiloIconoModal.value = 'color: #E65100;';
    
    // Mensaje HTML con advertencia
    mensajeModalConfirmacion.value = `
      <p>¿Está seguro que desea poner en inactivo a <strong>${alumno.value.nombre} ${alumno.value.apellido}</strong>?</p>
      <p class="advertencia-modal" style="margin-top: 1rem; font-size: 0.95rem; color: #B71C1C; background-color: #FFEBEE; padding: 1rem; border-radius: 10px; border: 1px solid #FFCDD2; text-align: center;">
        <i class="fas fa-exclamation-circle"></i> Si confirma, se lo eliminará de los grupos a los que asiste y se le dejarán de generar las cuotas.
      </p>
    `;
  } else {
    // Va a activar -> Normal (Verde)
    claseBotonConfirmar.value = 'btn-confirmar-normal';
    estiloBordeModal.value = 'border-top: 5px solid #4CAF50 !important;';
    estiloIconoModal.value = 'color: #4CAF50;';
    
    mensajeModalConfirmacion.value = `
      <p>¿Está seguro que desea <strong>activar</strong> a ${alumno.value.nombre} ${alumno.value.apellido}?</p>
      <p><strong>ADVERTENCIA:</strong> Cuando se active al alumno debera de asignarle horarios obligatoriamente</p>
    `;
  }

  // 2. Asignamos la función que se ejecutará al confirmar
  funcionConfirmar.value = ejecutarCambioEstado;
  
  // 3. Abrimos modal
  mostrarModalConfirmacion.value = true;
}

const ejecutarCambioEstado = async () => {
  const nuevoEstado = !alumno.value.activo;
  
  // --- TODO: AQUÍ VA LA LLAMADA A LA API REAL ---
  // await api.actualizarEstadoAlumno(alumno.value.dni, nuevoEstado);
  if (nuevoEstado === false) {
    // Si se está desactivando, llamamos a la API correspondiente
    try {
      await desactivarAlumnoAPI(alumno.value.dni);
    } catch (error) {
      console.error("Error al desactivar el alumno:", error);
      mensajeModalError.value = error.response?.data?.detail || 'No se pudo desactivar al alumno. Intente nuevamente.';
      mostrarModalError.value = true;
      return; // Salimos si hay error
    }
  }
  
  if (nuevoEstado === true) {
    // Si se está activando, llamamos a la API correspondiente
    try {
      await reactivarAlumnoAPI(alumno.value.dni);
    } catch (error) {
      console.error("Error al activar el alumno:", error);
      mensajeModalError.value = error.response?.data?.detail || 'No se pudo activar al alumno. Intente nuevamente.';
      mostrarModalError.value = true;
      return; // Salimos si hay error
    }
  }
  
  // Simulación Éxito:
  alumno.value.activo = nuevoEstado;
  mensajeModalExito.value = nuevoEstado 
    ? 'El alumno se activó correctamente, POR FAVOR ASIGNE LOS HORARIOS PARA EL ALUMNO' 
    : 'El alumno se desactivó correctamente';
  mostrarModalExito.value = true;
}


// 3. Se llama desde el modal de éxito (igual que en IngresoPersona)
const handleContinuarExito = async () => {
  mostrarModalExito.value = false;
  
  // Si acabamos de eliminar al alumno, volvemos a la lista
  if (tituloModalConfirmacion.value === 'Eliminar Alumno') {
    emit('volverAlumnos');
    return;
  }

  // Si no, recargamos los datos normalmente
  await cargarDatosCompletosAlumno();
};
// ----- FIN: Manejo de activar o descativar alumno -----

//manejador para eliminar al alumno
// =============================================================
// ===  LÓGICA ELIMINAR ALUMNO  ===
// =============================================================
const eliminarAlumno = () => {
  // 1. Configurar Modal (Rojo = Peligro)
  tituloModalConfirmacion.value = 'Eliminar Alumno';
  claseBotonConfirmar.value = 'btn-confirmar-peligro';
  estiloBordeModal.value = 'border-top: 5px solid #F44336 !important;';
  estiloIconoModal.value = 'color: #F44336;';

  // 2. Mensaje HTML con los datos del alumno
  mensajeModalConfirmacion.value = `
    <p>¿Está seguro que desea eliminar a <strong>${alumno.value.nombre} ${alumno.value.apellido}</strong>?</p>
    <p style="margin-top: 1rem; font-size: 0.9rem; color: #d32f2f; font-weight: 500;">
      Se borrarán todos los datos del alumno del sistema, incluyendo sus cuotas.
      <br>Esta operación no se puede deshacer.
    </p>
  `;

  // 3. Asignar la función que se ejecutará al confirmar
  funcionConfirmar.value = confirmarEliminarAlumno;
  
  // 4. Mostrar el modal
  mostrarModalConfirmacion.value = true;
}

/**
 * Se ejecuta al hacer clic en "Sí, Confirmar" dentro del modal
 */
const confirmarEliminarAlumno = async () => {
  
  try {
    await eliminarAlumnoAPI(alumnoID.value.dni);
    mensajeModalExito.value = 'El alumno ha sido eliminado correctamente.';
    mostrarModalExito.value = true;
    
  } catch (e) {
    mensajeModalError.value = e.response?.data?.error || 'No se pudo eliminar al alumno.';
    mostrarModalError.value = true;
  }
};

// await cargarDatosCompletosAlumno();

const manejarGuardarDatos = async (datosActualizados) => {
  try {
    const dni = alumnoID.value["dni"];

    const payload = {
      nombre: datosActualizados["nombre"],
      apellido: datosActualizados["apellido"],
      sexo: datosActualizados["sexo"],
      email: datosActualizados["email"],
      telefono: datosActualizados["telefono"],
      nomProvincia: datosActualizados["provincia"],
      nomLocalidad: datosActualizados["localidad"],
      calle: datosActualizados["calle"],
      numero: datosActualizados["nro"]
    };

    await actualizarPerfilAlumno(dni, payload);
    
  } catch (error) {
    console.error("error", error);
    mensajeModalError.value = e.response?.data?.detail || 'No se pudieron guardar los cambios';
    mostrarModalError.value = true;
  } 
  // El bloque 'finally' se ha eliminado.

  // Ocultamos el formulario y mostramos el modal de éxito INMEDIATAMENTE
  mostrandoModificacion.value = null;
  mensajeModalExito.value = 'Los datos del alumno se actualizaron correctamente';
  mostrarModalExito.value = true;
}


import {
  actualizarPlanAlumno,
  guardarModificacionesPlanYHorarios
} from '@/api/services/alumnoService'
// actualizarHorariosAlumno()
// obtenerHorariosPorDni()

const manejarGuardarSuscripcionTrabajo = async (datosActualizados) => {
  // datosActualizados es el JSON: { alumno: {...}, horarios: [...] }

  // Habilitamos el estado de carga
  loading.value = true; 

  try {
    // 1. Obtenemos los 3 argumentos que necesitamos
    const dni = alumno.value.dni;
    const alumnoOriginal = alumno.value; // 'alumno.value' tiene los datos ANTES de la modificación
    const nuevosDatos = datosActualizados; // El payload del evento
    
    // 2. Llamamos a la función orquestadora que creamos en el service
    // Esta función HARÁ AMBAS llamadas a la API (plan y horarios)
    // si es necesario, y ya incluye la lógica de comparación.
    const { planActualizado, horariosActualizados } = await guardarModificacionesPlanYHorarios(
      dni,
      alumnoOriginal,
      nuevosDatos
    );

    // 3. Si todo sale bien, cerramos el formulario y mostramos el modal de éxito
    mostrandoModificacion.value = null; // Ocultar el formulario
    
    // Personalizar el mensaje basado en lo que se hizo
    if (planActualizado && horariosActualizados) {
      mensajeModalExito.value = 'El plan y los horarios se actualizaron correctamente.';
    } else if (planActualizado) {
      mensajeModalExito.value = 'El plan se actualizó. Los horarios no necesitaron cambios.';
    }
    
    mostrarModalExito.value = true;
    
    // NOTA: Tu función 'handleContinuarExito' se encargará de
    // recargar los datos del alumno (con 'cargarDatosCompletosAlumno')
    // cuando el usuario cierre el modal de éxito. ¡Eso está perfecto!

  } catch (error) {
    // 4. Si algo falla (la API de plan o la de horarios), mostramos un error
    console.error("Error al guardar modificaciones de suscripción/trabajo:", error);
    alert(`Error al guardar: ${error.message || 'Ocurrió un error inesperado.'}`);
    
  } finally {
    // 5. Pase lo que pase, quitamos el estado de carga
    loading.value = false;
  }
}


// ----- INICIO: Manejo de Modificación/Eliminación de Cuotas -----
const cuotaParaEliminar = ref(null);
const mostrarModalError = ref(false);
const mensajeModalError = ref('');

// =============================================================
// ===            LÓGICA DE ELIMINACIÓN DE CUOTA             ===
// =============================================================

/**
 * 1. Función DISPARADORA (Se llama desde el botón Eliminar de la tabla)
 * Configura el modal y pide confirmación.
 */
const manejarSolicitudEliminar = (cuota) => {
  
  // Guardamos la cuota en la variable reactiva para usarla luego en la confirmación
  cuotaParaEliminar.value = cuota;

  // 1. Configuramos el aspecto del Modal (Rojo = Peligro)
  tituloModalConfirmacion.value = 'Eliminar Cuota';
  claseBotonConfirmar.value = 'btn-confirmar-peligro';
  estiloBordeModal.value = 'border-top: 5px solid #F44336 !important;'; 
  estiloIconoModal.value = 'color: #F44336;';

  // 2. Armamos el mensaje HTML con los datos
  mensajeModalConfirmacion.value = `
    <p>¿Estás seguro que desea borrar la cuota del mes de <strong>${cuota.mes}</strong> de un valor de <strong>$${cuota.monto}</strong>?</p>
    <p style="margin-top: 1rem; font-size: 0.9rem; color: #d32f2f; font-weight: 500;">Esta acción no se puede deshacer.</p>
  `;

  // 3. Asignamos la función que contiene la lógica de la API
  funcionConfirmar.value = confirmarEliminarCuota;

  // 4. Abrimos el modal
  mostrarModalConfirmacion.value = true;
};

/**
 * 2. Función DE EJECUCIÓN (Se llama al dar click en "Sí, Confirmar")
 * Contiene la llamada a la API.
 */
const confirmarEliminarCuota = async () => {
  // Obtenemos el ID de la variable que guardamos en el paso anterior
  const idCuota = cuotaParaEliminar.value.idCuota;

  try {

    // LLAMADA REAL A LA API
    await eliminarCuota(idCuota);

    // Éxito: Configuramos y mostramos el modal de éxito
    mensajeModalExito.value = 'La cuota se eliminó correctamente.';
    mostrarModalExito.value = true;
    
    // NOTA: Cuando cierres el modal de éxito, se ejecutará 'handleContinuarExito'
    // que recargará los datos del alumno automáticamente.

  } catch (error) {
    // Error: Configuramos y mostramos el modal de error
    console.error("Error al eliminar la cuota:", error);
    mensajeModalError.value = error.response?.data?.detail || 'No se pudo eliminar la cuota. Intente nuevamente.';
    mostrarModalError.value = true;
  } finally {
    // loading.value = false;
    // Limpiamos la variable auxiliar
    cuotaParaEliminar.value = null;
  }
};

// Función para cerrar el modal de error
const handleContinuarError = () => {
  mostrarModalError.value = false;
};

/**
 * (Handler para "Modificar")
 * Se activa cuando FilaCuota -> TablaCuota emiten 'solicitud-modificar-cuota'.
 * Oculta la tabla y muestra el formulario de edición.
 */
const manejarSolicitudModificar = (cuota) => {
  console.log('Solicitud para MODIFICAR cuota InfoAlumno:', cuota);
  cuotaParaModificar.value = cuota;
};

/**
 * Se activa cuando ModificarCuota emite 'cancelar-modificacion'.
 * Oculta el formulario y muestra la tabla.
 */
const cancelarModificacionCuota = () => {
  cuotaParaModificar.value = null;
};

/**
 * (Handler para "Guardar")
 * Se activa cuando ModificarCuota emite 'guardar-modificacion-cuota'.
 */
const guardarModificacionCuota = async (cuotaModificada) => {
  
  try {
    loading.value = true;

    const payload = {
      ...cuotaModificada,
      monto: parseFloat(cuotaModificada.monto),
      anio: parseInt(cuotaModificada.anio),
      // Si se desmarcó 'pagada', forzamos null en el método de pago 
      // (aunque el backend también lo hace, es bueno tenerlo limpio desde acá)
      metodoDePago: cuotaModificada.pagada ? cuotaModificada.metodoDePago : null 
    };

    await modificarCuota(payload.idCuota, payload);
    
    cuotaParaModificar.value = null;

    mensajeModalExito.value = 'La cuota se modificó correctamente.';
    mostrarModalExito.value = true;
    

  } catch (error) {
    console.error('Error al guardar la cuota:', error);
    mensajeModalError.value = error.response?.data?.detail || 'Ocurrió un error al intentar guardar los cambios de la cuota.';
    mostrarModalError.value = true;
  } finally {
    loading.value = false;
  }
};

// ----- FIN: Manejo de Cuotas -----

const ProcesarPagoExistoso = (cuotaPagada) => {
  console.log('Pago exitoso recibido en Cuotas.vue:', cuotaPagada);
  // 1. Configuramos el mensaje del modal
  mensajeModalExito.value = `La cuota del mes ${cuotaPagada.mes} fue pagada correctamente.`;
  // 2. Mostramos el modal
  mostrarModalExito.value = true;
}

</script>

<style scoped>
/* ESTILOS ORIGINALES COMPLETOS */
.contenedor-info-alumno {
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

.encabezado-info {
  display: grid; 
  grid-template-columns: 1fr auto 1fr; 
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap; 
  gap: 1rem;
}
.encabezado-info .btn-volver-global {
  justify-self: start; 
}

.tarjeta-alumno {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tarjeta-contenido {
  padding: 0;
}

.separador-seccion {
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 2rem 2rem; 
}

.seccion-info {
  margin-bottom: 2.5rem;
  padding: 1.5rem 2rem;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  margin-left: 2rem;
  margin-right: 2rem;
}
.seccion-info .titulo-seccion {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
  border-bottom: 2px solid #d32f2f;
  padding-bottom: 0.5rem;
}
.seccion-info .titulo-seccion i { color: #d32f2f; }

.seccion-info:last-child {
  margin-bottom: 0;
}

.sin-alumno {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}
.sin-alumno i { margin-bottom: 1.5rem; color: #e9ecef; }
.sin-alumno h3 { margin-bottom: 1rem; color: #495057; font-size: 1.5rem; }
.sin-alumno p { margin-bottom: 2rem; font-size: 1rem; }

.seccion-botones { 
  margin-top: 3rem; 
  padding: 2rem;
  border-top: 2px solid #e0e0e0; 
}
.botones-accion { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
  gap: 1rem; 
}
.btn-accion { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 0.5rem; 
  padding: 1rem 1.5rem; 
  border: none; 
  border-radius: 10px; 
  font-family: 'Poppins', sans-serif; 
  font-weight: 600; 
  font-size: 1rem; 
  cursor: pointer; 
  transition: all 0.3s ease; 
}
.btn-modificar { background: #2196F3; color: white; }
.btn-modificar:hover { background: #1976D2; transform: translateY(-2px); }
.btn-suscripcion { background: #FF9800; color: white; }
.btn-suscripcion:hover { background: #F57C00; transform: translateY(-2px); }
.btn-estado-activo { 
  background: #4CAF50; /* Verde */
  color: white; 
}
.btn-estado-activo:hover { 
  background: #388E3C; 
  transform: translateY(-2px); 
}
.btn-estado-inactivo { 
  background: #FF7043; /* Naranja Intenso */ 
  color: white; 
}
.btn-estado-inactivo:hover { 
  background: #F4511E; /* Naranja más oscuro */ 
  transform: translateY(-2px); 
}
.btn-eliminar { background: #F44336; color: white; }
.btn-eliminar:hover { background: #D32F2F; transform: translateY(-2px); }

/* ----- Estilos para Modales (Locales de este componente) ----- */
.modal-confirmacion {
  border-top: 5px solid #E65100 !important;
}
.modal-header-advertencia {
  flex-direction: column; 
  align-items: center; 
  padding-top: 1.5rem; 
  padding-bottom: 0.5rem; 
  border-bottom: none; 
}
.modal-header-advertencia i {
  color: #E65100; 
  font-size: 3.5rem; 
  margin-bottom: 0.8rem; 
}
.modal-header-advertencia h3 {
  font-size: 1.6rem; 
  font-weight: 600;
  color: #333; 
  margin: 0;
  text-align: center;
}
.modal-body-exito p:not(.advertencia-modal) {
  font-size: 1.05rem; 
  line-height: 1.5;
  color: #444;
  text-align: center; 
}
.advertencia-modal {
  font-size: 0.95rem; 
  font-weight: 500;
  color: #B71C1C; 
  background-color: #FFEBEE; 
  padding: 1rem 1.2rem; 
  border-radius: 10px; 
  border: 1px solid #FFCDD2;
  margin-top: 1.5rem; 
  text-align: center; 
  max-width: 90%; 
  margin-left: auto; 
  margin-right: auto; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); 
}
.modal-footer-exito {
  justify-content: center; 
  gap: 1.2rem; 
  padding-top: 1.5rem; 
  padding-bottom: 1.5rem; 
  border-top: none; 
  background: none; 
}
.btn-modal-cancelar, .btn-modal-confirmar {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1rem; 
  padding: 0.8rem 1.8rem; 
  border-radius: 30px; 
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
}
.btn-modal-cancelar {
  background: #EEEEEE; 
  color: #555;
}
.btn-modal-cancelar:hover {
  background: #D5D5D5;
  transform: translateY(-1px); 
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
.btn-confirmar-normal {
  background-color: #4CAF50; 
  color: white;
}
.btn-confirmar-normal:hover {
  background-color: #388E3C;
  transform: translateY(-1px); 
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
.btn-confirmar-peligro {
  background-color: #F44336; 
  color: white;
}
.btn-confirmar-peligro:hover {
  background-color: #D32F2F;
  transform: translateY(-1px); 
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

@media (max-width: 600px) {
  .modal-footer-exito {
    flex-direction: column; 
    gap: 0.8rem; 
  }
  .btn-modal-cancelar, .btn-modal-confirmar {
    width: 100%; 
  }
}
/* ----- FIN Estilos Modales ----- */

/* --- RESPONSIVE --- */
/* (Esta regla estaba mal anidada, ahora está separada) */
@media (max-width: 1560px) { 
  .botones-accion { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 1rem; 
  } 
}

/* Para tablets y pantallas medianas */
@media (max-width: 768px) {
  /*
    ===== CORRECCIÓN APLICADA AQUÍ =====
    Reduce el padding del contenedor principal para dar
    más espacio a los componentes hijos.
  */
  .contenedor-info-alumno { 
    padding: 1rem; /* Antes era 1.5rem */
  } 

  .encabezado-info {
    display: flex; 
    flex-direction: column;
    text-align: center;
    align-items: stretch;
    grid-template-columns: none; 
  }
  .encabezado-info .btn-volver-global {
    justify-content: center;
    margin-bottom: 1rem;
    justify-self: auto;
  }

  /* Reduce el padding de la tarjeta (vista info) */
  .tarjeta-contenido { 
    padding: 1rem; /* Antes era 1.5rem */
  }

  .separador-seccion { 
    margin: 1.5rem 0; 
  }

  .seccion-info { 
    padding: 1rem 0; 
    border: none;
    background: none; 
    margin-left: 0;
    margin-right: 0;
  }

  .seccion-info .titulo-seccion {
    /* Ajusta el padding para que coincida con el nuevo padding de la tarjeta */
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .seccion-botones {
    padding: 2rem 1rem 0 1rem; /* Ajustado */
  }

  .botones-accion { 
    grid-template-columns: 1fr; 
  }
  .btn-accion { 
    padding: 0.8rem 1rem; 
    font-size: 0.9rem; 
  }
}

/* Para celulares */
@media (max-width: 480px) {
  /*
    ===== CORRECCIÓN APLICADA AQUÍ =====
    Reduce el padding aún más en celulares.
  */
  .contenedor-info-alumno { 
    padding: 0.5rem; /* Antes era 1rem */
  } 

  .tarjeta-contenido { 
    padding: 0.5rem; /* Antes era 1rem */
  }

  .separador-seccion { 
    margin: 1rem 0; 
  }

  .seccion-info { 
    padding: 0.8rem 0; 
  }

  .seccion-info .titulo-seccion {
    padding-left: 0.5rem; /* Ajustado */
    padding-right: 0.5rem; /* Ajustado */
  }

  .seccion-botones {
    padding: 2rem 0.5rem 0 0.5rem; /* Ajustado */
  }
}
/* --- FIN DE CAMBIOS RESPONSIVE --- */
.modal-footer {
  display: flex;
  justify-content: center; /* <--- ESTO centra los botones */
  align-items: center;
  gap: 1.5rem; /* Espacio entre los botones Cancelar y Confirmar */
  padding-bottom: 1.5rem; /* Un poco de aire abajo si lo necesitas */
  width: 100%;
}
</style>