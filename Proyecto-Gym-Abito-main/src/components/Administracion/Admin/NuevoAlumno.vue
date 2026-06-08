<template>
  <div class="contenedor-vista-admin">
    
    <template v-if="!mostrarModalExito">
      <Titulo texto="INGRESO DE NUEVO ALUMNO" />
      <div class="tarjeta-formulario">
        <div class="tarjeta-contenido">

          <h3 class="titulo-seccion-formulario">
            <i class="fas fa-user-edit"></i>
            Datos Personales
          </h3>

          <div class="formulario-grid-datos">
            
            <div class="columna-formulario">
              <div class="form-group" :class="{ 'con-error': errores.dni }">
                <label class="form-label" for="dni"><i class="fas fa-id-card"></i>DNI</label>
                <input type="text" inputmode="numeric" id="dni" class="form-control input-numero-sin-flechas" v-model.trim="alumnoDatos.dni" placeholder="Ej: 45104930">
                <p class="error-texto" v-if="errores.dni">{{ errores.dni }}</p>
              </div>
              
              <div class="form-group" :class="{ 'con-error': errores.nombre }">
                <label class="form-label" for="nombre"><i class="fas fa-user"></i>Nombre</label>
                <input type="text" id="nombre" class="form-control" v-model.trim="alumnoDatos.nombre" placeholder="Ej: Juan">
                <p class="error-texto" v-if="errores.nombre">{{ errores.nombre }}</p>
              </div>
              
              <div class="form-group" :class="{ 'con-error': errores.apellido }">
                <label class="form-label" for="apellido"><i class="fas fa-user"></i>Apellido</label>
                <input type="text" id="apellido" class="form-control" v-model.trim="alumnoDatos.apellido" placeholder="Ej: Pérez">
                <p class="error-texto" v-if="errores.apellido">{{ errores.apellido }}</p>
              </div>
              
              <div class="form-group" :class="{ 'con-error': errores.sexo }">
                <label class="form-label" for="sexo"><i class="fas fa-venus-mars"></i>Sexo</label>
                <select id="sexo" class="form-control" v-model="alumnoDatos.sexo">
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
                <p class="error-texto" v-if="errores.sexo">{{ errores.sexo }}</p>
              </div>

              <div class="form-group" :class="{ 'con-error': errores.email }">
                <label class="form-label" for="email"><i class="fas fa-envelope"></i>Email</label>
                <input type="email" id="email" class="form-control" v-model.trim="alumnoDatos.email" placeholder="ejemplo@gmail.com">
                <p class="error-texto" v-if="errores.email">{{ errores.email }}</p>
              </div>
            </div>
            
            <div class="columna-formulario">
              <div class="form-group" :class="{ 'con-error': errores.telefono }">
                <label class="form-label" for="telefono"><i class="fas fa-phone"></i>Teléfono</label>
                <input type="tel" inputmode="numeric" id="telefono" class="form-control input-numero-sin-flechas" v-model.trim="alumnoDatos.telefono" placeholder="Solo números (Ej: 3624123456)">
                <p class="error-texto" v-if="errores.telefono">{{ errores.telefono }}</p>
              </div>

              <div class="form-group" :class="{ 'con-error': errores.provincia }">
                <label class="form-label" for="provincia"><i class="fas fa-map-marked-alt"></i>Provincia</label>
                <select 
                  id="provincia" 
                  class="form-control" 
                  v-model="alumnoDatos.provincia" 
                  @change="manejarCambioProvincia"
                  :disabled="cargandoProvincias"
                >
                  <option value="" disabled>Seleccione una provincia...</option>
                  <option v-if="cargandoProvincias" disabled>Cargando...</option>
                  
                  <option 
                    v-for="prov in listaProvincias" 
                    :key="prov.id" 
                    :value="prov.nombre"
                  >
                    {{ prov.nombre }}
                  </option>
                </select>
                <p class="error-texto" v-if="errores.provincia">{{ errores.provincia }}</p>
              </div>

              <div class="form-group" :class="{ 'con-error': errores.localidad }">
                <label class="form-label" for="localidad"><i class="fas fa-map-marker-alt"></i>Localidad</label>
                <select 
                  id="localidad" 
                  class="form-control select-localidad" 
                  v-model="alumnoDatos.localidad" 
                  :disabled="!alumnoDatos.provincia || cargandoLocalidades"
                >
                  <option value="" disabled>Seleccione una localidad...</option>
                  <option v-if="cargandoLocalidades" disabled>Cargando...</option>
                  
                  <option 
                    v-for="loc in listaLocalidades" 
                    :key="loc.id" 
                    :value="loc.nombre"
                  >
                    {{ loc.nombre }}
                  </option>
                </select>
                <p class="error-texto" v-if="errores.localidad">{{ errores.localidad }}</p>
              </div>

              <div class="form-group" :class="{ 'con-error': errores.calle }">
                <label class="form-label" for="calle"><i class="fas fa-road"></i>Calle</label>
                <input type="text" id="calle" class="form-control" v-model.trim="alumnoDatos.calle" placeholder="Ej: Av. 9 de Julio">
                <p class="error-texto" v-if="errores.calle">{{ errores.calle }}</p>
              </div>

              <div class="form-group" :class="{ 'con-error': errores.nro }">
                <label class="form-label" for="nro"><i class="fas fa-hashtag"></i>Número</label>
                <input type="text" inputmode="numeric" id="nro" class="form-control input-numero-sin-flechas" v-model.trim="alumnoDatos.nro" placeholder="Ej: 123">
                <p class="error-texto" v-if="errores.nro">{{ errores.nro }}</p>
              </div>
            </div>
          </div>

          <div class="separador-seccion"></div>

          <div class="seccion-ingreso">
            <div class="seccion-formulario" :class="{ 'con-error': errores.suscripcion }">
              <h3 class="titulo-seccion-formulario">
                <i class="fas fa-tags"></i>
                Seleccionar Suscripción
              </h3>
              <ListadoSuscripciones v-model="nuevaSuscripcion" />
              <p class="error-texto" v-if="errores.suscripcion">{{ errores.suscripcion }}</p>
            </div>

            <div class="seccion-formulario" :class="{ 'con-error': errores.trabajo }">
              <h3 class="titulo-seccion-formulario">
                <i class="fas fa-dumbbell"></i>
                Seleccionar Trabajo/Metodología
              </h3>
              <ListadoTrabajos v-model="nuevoTrabajo" />
              <p class="error-texto" v-if="errores.trabajo">{{ errores.trabajo }}</p>
            </div>

            <div class="seccion-formulario" :class="{ 'con-error': errores.nivel }">
              <h3 class="titulo-seccion-formulario">
                <i class="fas fa-layer-group"></i> Seleccionar Nivel
              </h3>
              <ListadoNiveles v-model="nuevoNivel" />
              <p class="error-texto" v-if="errores.nivel">{{ errores.nivel }}</p>
            </div>

            <div
              class="seccion-formulario seccion-horarios"
              :class="{ 'deshabilitado': !nuevaSuscripcion || nuevaSuscripcion === 'Día Libre', 'con-error': errores.horarios }"
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
              <p class="error-texto" v-if="errores.horarios">{{ errores.horarios }}</p>
            </div>
          </div>

          <div class="seccion-botones">
            <div class="botones-accion">
              <button class="btn-accion btn-cancelar" @click="cancelarIngreso">
                <i class="fas fa-times"></i>
                Cancelar Ingreso
              </button>
              
              <div class="tooltip-wrapper" :data-tooltip="!formularioCompletoValido ? mensajeBotonDeshabilitado : ''">
                <button
                  class="btn-accion btn-confirmar"
                  @click="confirmarNuevoIngreso"
                  :disabled="!formularioCompletoValido"
                >
                  <i class="fas fa-check"></i>
                  Confirmar Ingreso
                </button>
              </div>
              
            </div>
            <p v-if="mostrarMensajeValidacion" class="mensaje-validacion full-width">
              <i class="fas fa-exclamation-triangle"></i> Por favor, corrige los errores marcados en el formulario.
            </p>
          </div>

        </div>
      </div>
    </template>
    
    <Transition name="modal-fade">
      <div v-if="mostrarModalConfirmacion" class="modal-overlay">
        <div class="modal-confirmacion"> <div class="modal-header">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Confirmar Ingreso</h3>
          </div>
          <div class="modal-body">
            <p>
              ¿Estás seguro que desea realizar el ingreso de 
              <strong>{{ alumnoDatos.nombre }} {{ alumnoDatos.apellido }}</strong>?
            </p>
            <p style="margin-top: 1rem; font-size: 0.95rem; color: #495057;">
              Esta pasará a ser alumno, ocupará los cupos de los horarios asignados y se le generará la cuota pertinente.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-modal btn-cancelar-modal" @click="cancelarConfirmacion">
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
            <h3>Ingreso Completado</h3>
          </div>
          <div class="modal-body-exito">
            <p>El alumno se ha ingresado y registrado correctamente.</p>
            <p>Podrá iniciar sesión con su <b>DNI</b> como nombre de usuario y contraseña.</p>
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
import { ref, computed, watch, onMounted } from 'vue';
import ListadoSuscripciones from './Listados/ListadoSuscripciones.vue';
import ListadoTrabajos from './Listados/ListadoTrabajos.vue';
import ListadoNiveles from './Listados/ListadoNiveles.vue';
import TablaHorarios from '../Tablas y Filas/TablaHorario/TablaHorarios.vue';
import Titulo from '../Titulo.vue';

import { obtenerProvinciasArg, obtenerLocalidadesArg } from '@/api/services/georefService';

const emit = defineEmits(['cancelarIngreso','nuevoIngresoConfirmado']);

// --- Refs para Modales (MODIFICADO) ---
const mostrarModalExito = ref(false);
const mostrarModalConfirmacion = ref(false); // <-- AÑADIDO

// --- Datos del Alumno ---
const alumnoDatos = ref({
  dni: '',
  nombre: '',
  apellido: '',
  sexo: 'M',
  email: '',
  telefono: '',
  provincia: '',
  localidad: '',
  calle: '',
  nro: ''
});

const listaProvincias = ref([]);
const listaLocalidades = ref([]);
const cargandoProvincias = ref(false);
const cargandoLocalidades = ref(false);

const cargarProvincias = async () => {
  cargandoProvincias.value = true;
  try {
    listaProvincias.value = await obtenerProvinciasArg();
  } catch (e) {
    console.error("Error al cargar provincias:", e);
  } finally {
    cargandoProvincias.value = false;
  }
};

const manejarCambioProvincia = async () => {
  // Reseteamos la localidad al cambiar provincia
  alumnoDatos.value.localidad = '';
  listaLocalidades.value = [];
  
  const nombreSeleccionado = alumnoDatos.value.provincia;
  // Buscamos el objeto provincia para obtener su ID
  const provinciaObj = listaProvincias.value.find(p => p.nombre === nombreSeleccionado);

  if (provinciaObj) {
    cargandoLocalidades.value = true;
    try {
      listaLocalidades.value = await obtenerLocalidadesArg(provinciaObj.id);
    } catch (e) {
      console.error("Error al cargar localidades:", e);
    } finally {
      cargandoLocalidades.value = false;
    }
  }
};

onMounted(() => {
  cargarProvincias();
});

// --- Lógica de Gimnasio ---
const nuevaSuscripcion = ref('');
const nuevoTrabajo = ref('');
const nuevoNivel = ref('');
const nuevosHorarios = ref([]);
const mostrarMensajeValidacion = ref(false);

// --- Validación Instantánea (Sin cambios) ---
const errores = ref({});
const validarCampo = (campo, valor) => {
  if (!valor || (Array.isArray(valor) && valor.length === 0)) {
    return `Falta completar el campo: ${campo}.`;
  }
  if (campo === 'Email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(valor)) {
      return 'El formato del Email no es válido.';
    }
  }
  if (campo === 'DNI' || campo === 'Teléfono' || campo === 'Número') {
    const numRegex = /^[0-9]+$/;
    if (!numRegex.test(valor)) {
      return `El campo ${campo} solo acepta números.`;
    }
  }
  return null;
};
watch(() => alumnoDatos.value.dni, (val) => { errores.value.dni = validarCampo('DNI', val); });
watch(() => alumnoDatos.value.nombre, (val) => { errores.value.nombre = validarCampo('Nombre', val); });
watch(() => alumnoDatos.value.apellido, (val) => { errores.value.apellido = validarCampo('Apellido', val); });
// watch(() => alumnoDatos.value.usuario, (val) => { errores.value.usuario = validarCampo('Usuario', val); });
watch(() => alumnoDatos.value.email, (val) => { errores.value.email = validarCampo('Email', val); });
watch(() => alumnoDatos.value.telefono, (val) => { errores.value.telefono = validarCampo('Teléfono', val); });
watch(() => alumnoDatos.value.provincia, (val) => { errores.value.provincia = validarCampo('Provincia', val); });
watch(() => alumnoDatos.value.localidad, (val) => { errores.value.localidad = validarCampo('Localidad', val); });
watch(() => alumnoDatos.value.calle, (val) => { errores.value.calle = validarCampo('Calle', val); });
watch(() => alumnoDatos.value.nro, (val) => { errores.value.nro = validarCampo('Número', val); });
watch(nuevaSuscripcion, (val) => { 
  errores.value.suscripcion = validarCampo('Suscripción', val); 
  validarHorarios();
});
watch(nuevoTrabajo, (val) => { errores.value.trabajo = validarCampo('Trabajo', val); });
watch(nuevoNivel, (val) => { errores.value.nivel = validarCampo('Nivel', val); });
const actualizarHorarios = (datosEmitidos) => {
  nuevosHorarios.value = datosEmitidos?.horarios || []; 
  validarHorarios();
};
const validarHorarios = () => {
  if (nuevaSuscripcion.value && nuevaSuscripcion.value !== 'Día Libre') {
    if (nuevosHorarios.value.length === 0) {
      errores.value.horarios = 'Debe seleccionar al menos un horario.';
      return false;
    }
  }
  delete errores.value.horarios;
  return true;
};
const checkFormularioCompleto = () => {
  for (const key in alumnoDatos.value) {
    if (validarCampo(key, alumnoDatos.value[key])) return false;
  }
  if (validarCampo('Suscripción', nuevaSuscripcion.value)) return false;
  if (validarCampo('Trabajo', nuevoTrabajo.value)) return false;
  if (validarCampo('Nivel', nuevoNivel.value)) return false;
  if (nuevaSuscripcion.value && nuevaSuscripcion.value !== 'Día Libre' && nuevosHorarios.value.length === 0) {
    return false;
  }
  return true;
};
const formularioCompletoValido = computed(() => {
  return checkFormularioCompleto();
});
const mensajeBotonDeshabilitado = computed(() => {
  // (Lógica del tooltip sin cambios)
  if (formularioCompletoValido.value) return '';
  let camposInvalidos = [];
  let camposFaltantes = [];
  Object.keys(alumnoDatos.value).forEach(key => {
    const errorMsg = validarCampo(key.charAt(0).toUpperCase() + key.slice(1), alumnoDatos.value[key]);
    if (errorMsg) {
      (errorMsg.startsWith('Falta') ? camposFaltantes : camposInvalidos).push({ key, errorMsg });
    }
  });
  const susError = validarCampo('Suscripción', nuevaSuscripcion.value);
  if (susError) camposFaltantes.push({ key: 'Suscripción', errorMsg: susError });
  const traError = validarCampo('Trabajo', nuevoTrabajo.value);
  if (traError) camposFaltantes.push({ key: 'Trabajo', errorMsg: traError });
  const nivError = validarCampo('Nivel', nuevoNivel.value);
  if (nivError) camposFaltantes.push({ key: 'Nivel', errorMsg: nivError });
  if (nuevaSuscripcion.value && nuevaSuscripcion.value !== 'Día Libre' && nuevosHorarios.value.length === 0) {
    camposFaltantes.push({ key: 'Horarios', errorMsg: 'Falta seleccionar horarios.' });
  }
  if (camposInvalidos.length > 0) {
    return camposInvalidos[0].errorMsg;
  }
  if (camposFaltantes.length > 1) {
    return 'Faltan completar campos obligatorios.';
  }
  if (camposFaltantes.length === 1) {
    return camposFaltantes[0].errorMsg;
  }
  return 'Por favor, revise el formulario.';
});
const validarFormularioParaEnvio = () => {
  let esValido = true;
  Object.keys(alumnoDatos.value).forEach(key => {
    const errorMsg = validarCampo(key.charAt(0).toUpperCase() + key.slice(1), alumnoDatos.value[key]);
    errores.value[key] = errorMsg;
    if (errorMsg) esValido = false;
  });
  errores.value.suscripcion = validarCampo('Suscripción', nuevaSuscripcion.value);
  if (errores.value.suscripcion) esValido = false;
  errores.value.trabajo = validarCampo('Trabajo', nuevoTrabajo.value);
  if (errores.value.trabajo) esValido = false;
  errores.value.nivel = validarCampo('Nivel', nuevoNivel.value);
  if (errores.value.nivel) esValido = false;
  if (!validarHorarios()) esValido = false;
  return esValido;
};
// --- FIN VALIDACIÓN ---


const cancelarIngreso = () => {
  emit('cancelarIngreso'); 
};

// --- (1) Se llama al hacer clic en el BOTÓN "Confirmar Ingreso" ---
const confirmarNuevoIngreso = () => {
  const esValido = validarFormularioParaEnvio();

  if (!esValido) {
    console.error("Formulario incompleto o con errores.");
    mostrarMensajeValidacion.value = true;
    return;
  }
  // Si es válido, muestra el modal de confirmación
  mostrarMensajeValidacion.value = false;
  mostrarModalConfirmacion.value = true; // <-- MODIFICADO
};

// --- (2) Se llama al hacer clic en "Cancelar" DENTRO DEL MODAL ---
const cancelarConfirmacion = () => {
  mostrarModalConfirmacion.value = false;
};


import { crearNuevoAlumno } from '@/api/services/alumnoService'; // <--- IMPORTANTE
// --- (3) Se llama al hacer clic en "Sí, Confirmar" DENTRO DEL MODAL ---
const realizarIngreso = async () => {
  mostrarModalConfirmacion.value = false;

  // --- TODO: AQUÍ VA EL LLAMADO A LA API ---
  // 1. Construye el payload
  const payload = {
    datosPersonales: alumnoDatos.value,
    suscripcion: nuevaSuscripcion.value,
    trabajo: nuevoTrabajo.value,
    nivel: nuevoNivel.value,
    horarios: nuevaSuscripcion.value === 'Día Libre' 
      ? [] 
      : (nuevosHorarios.value || []).map(item => ({ 
          nroGrupo: item.nroGrupo,
          dia: item.dia
        }))
  };

  try {
    console.log("Enviando a la API...");
    
    // --- LLAMADA REAL ---
    await crearNuevoAlumno(payload); 
    // --------------------
    
    console.log("Alumno registrado con éxito");
    mostrarModalExito.value = true;

  } catch (error) {
    console.error("Error al registrar:", error);
    // Mostrar mensaje de error (usando el mensaje que viene del backend si existe)
    const mensaje = error.response?.data?.detail || 'Error al registrar al alumno.';
    alert(mensaje); // O usa tu lógica de modales de error si tienes uno
  }
};
// --- FIN TODO ---

// --- (4) Se llama desde el modal de ÉXITO ---
function handleContinuar() {
  emit('nuevoIngresoConfirmado'); 
  mostrarModalExito.value = false;
  // Opcional: podrías querer resetear el formulario aquí
  // resetForm();
}

</script>

<style scoped>
/* Grid del formulario principal */
.formulario-grid-datos {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Dos columnas */
  gap: 1.5rem 2rem;
}

/* Contenedores de cada columna */
.columna-formulario {
  display: flex;
  flex-direction: column;
  gap: 1.2rem; /* Espacio entre cada .form-group */
}

/* Estilos para errores */
.error-texto {
  color: #d32f2f;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  min-height: 1.2em; 
}
.form-group.con-error .form-control {
  border-color: #d32f2f;
  background-color: #fff8f8;
}
.form-group.con-error .form-label {
  color: #d32f2f;
}

/* Ocultar spinners en inputs numéricos */
.input-numero-sin-flechas::-webkit-inner-spin-button,
.input-numero-sin-flechas::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


/* Estilos para Tooltip Personalizado */
.tooltip-wrapper {
  position: relative;
  width: 100%;
  display: inline-block;
}
.tooltip-wrapper .btn-confirmar {
  width: 100%;
}
.tooltip-wrapper .btn-confirmar:disabled {
  pointer-events: none;
  width: 100%; 
}
.tooltip-wrapper[data-tooltip]:not([data-tooltip=""])::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #2c3e50;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: normal;
  width: 280px;
  text-align: center;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  pointer-events: none;
}
.tooltip-wrapper[data-tooltip]:not([data-tooltip=""]):hover::after {
  opacity: 1;
  visibility: visible;
}

/* Responsive */
@media (max-width: 768px) {
  .formulario-grid-datos {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .columna-formulario {
    gap: 1.2rem;
  }
  .columna-formulario + .columna-formulario {
    margin-top: 1.2rem;
  }
  .tooltip-wrapper[data-tooltip]:not([data-tooltip=""])::after {
      bottom: auto;
      top: 110%;
      left: 50%;
      width: 90%;
      min-width: 250px;
  }
}

</style>