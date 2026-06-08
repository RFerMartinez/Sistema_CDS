<template>
  <div class="contenedor-vista-admin">
    
    <template v-if="!mostrarModalExito">
      <div class="encabezado-info">
        <button class="btn-volver-global" @click="emitirCancelar">
        <i class="fas fa-arrow-left"></i>
        Volver a Empleados
        </button>
        <Titulo texto="INGRESO DE NUEVO EMPLEADO" />
      </div>
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
                <input type="text" inputmode="numeric" id="dni" class="form-control input-numero-sin-flechas" v-model.trim="EmpleadoDatos.dni" placeholder="Ej: 45104930">
                <p class="error-texto" v-if="errores.dni">{{ errores.dni }}</p>
              </div>
              
              <div class="form-group" :class="{ 'con-error': errores.nombre }">
                <label class="form-label" for="nombre"><i class="fas fa-user"></i>Nombre</label>
                <input type="text" id="nombre" class="form-control" v-model.trim="EmpleadoDatos.nombre" placeholder="Ej: Juan">
                <p class="error-texto" v-if="errores.nombre">{{ errores.nombre }}</p>
              </div>
              
              <div class="form-group" :class="{ 'con-error': errores.apellido }">
                <label class="form-label" for="apellido"><i class="fas fa-user"></i>Apellido</label>
                <input type="text" id="apellido" class="form-control" v-model.trim="EmpleadoDatos.apellido" placeholder="Ej: Pérez">
                <p class="error-texto" v-if="errores.apellido">{{ errores.apellido }}</p>
              </div>
              
              <div class="form-group" :class="{ 'con-error': errores.sexo }">
                <label class="form-label" for="sexo"><i class="fas fa-venus-mars"></i>Sexo</label>
                <select id="sexo" class="form-control" v-model="EmpleadoDatos.sexo">
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
                <p class="error-texto" v-if="errores.sexo">{{ errores.sexo }}</p>
              </div>

              <div class="form-group" :class="{ 'con-error': errores.rol }">
                <label class="form-label" for="rol"><i class="fas fa-briefcase"></i>Rol / Puesto</label>
                <input type="text" id="rol" class="form-control" v-model.trim="EmpleadoDatos.rol" placeholder="Ej: Entrenador / Administrativo">
                <p class="error-texto" v-if="errores.rol">{{ errores.rol }}</p>
              </div>
              
            </div>
            
            <div class="columna-formulario">
              <div class="form-group" :class="{ 'con-error': errores.email }">
                <label class="form-label" for="email"><i class="fas fa-envelope"></i>Email</label>
                <input type="email" id="email" class="form-control" v-model.trim="EmpleadoDatos.email" placeholder="ejemplo@gmail.com">
                <p class="error-texto" v-if="errores.email">{{ errores.email }}</p>
              </div>

              <div class="form-group" :class="{ 'con-error': errores.telefono }">
                <label class="form-label" for="telefono"><i class="fas fa-phone"></i>Teléfono</label>
                <input type="tel" inputmode="numeric" id="telefono" class="form-control input-numero-sin-flechas" v-model.trim="EmpleadoDatos.telefono" placeholder="Solo números (Ej: 3624123456)">
                <p class="error-texto" v-if="errores.telefono">{{ errores.telefono }}</p>
              </div>

              <div class="form-group" :class="{ 'con-error': errores.provincia }">
                <label class="form-label" for="provincia"><i class="fas fa-map-marked-alt"></i>Provincia</label>
                <select 
                  id="provincia" 
                  class="form-control" 
                  v-model="EmpleadoDatos.provincia" 
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
                  v-model="EmpleadoDatos.localidad" 
                  :disabled="!EmpleadoDatos.provincia || cargandoLocalidades"
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
                <input type="text" id="calle" class="form-control" v-model.trim="EmpleadoDatos.calle" placeholder="Ej: Av. 9 de Julio">
                <p class="error-texto" v-if="errores.calle">{{ errores.calle }}</p>
              </div>

              <div class="form-group" :class="{ 'con-error': errores.nro }">
                <label class="form-label" for="nro"><i class="fas fa-hashtag"></i>Número</label>
                <input type="text" inputmode="numeric" id="nro" class="form-control input-numero-sin-flechas" v-model.trim="EmpleadoDatos.nro" placeholder="Ej: 123">
                <p class="error-texto" v-if="errores.nro">{{ errores.nro }}</p>
              </div>
            </div>
          </div>

          <div class="separador-seccion"></div>

          <div
            class="seccion-formulario seccion-horarios"
            :class="{ 'con-error': errores.horarios }"
          >
            <h3 class="titulo-seccion-formulario">
              <i class="fas fa-calendar-alt"></i>
              Horarios Laborales
            </h3>
            
            <p class="info-horarios">
              <i class="fas fa-info-circle"></i>
              Seleccione todos los horarios que cumplirá el empleado. Puede seleccionar múltiples turnos por día.
            </p>

            <div class="contenedor-tabla-horarios">
              <TablaHorarios
                :horarios-alumno="[]" 
                :suscripcion="''" 
                :modo-embebido="true"
                :modo-empleado="true" 
                @horarios-actualizados="actualizarHorarios"
              />
            </div>
            <p class="error-texto" v-if="errores.horarios">{{ errores.horarios }}</p>
          </div>

          <div class="seccion-botones">
            <div class="botones-accion">
              <button class="btn-accion btn-cancelar" @click="emitirCancelar">
                <i class="fas fa-times"></i>
                Cancelar
              </button>
              
              <div class="tooltip-wrapper" :data-tooltip="!formularioCompletoValido ? mensajeBotonDeshabilitado : ''">
                <button
                  class="btn-accion btn-confirmar"
                  @click="iniciarProcesoIngreso"
                  :disabled="!formularioCompletoValido"
                >
                  <i class="fas fa-check"></i>
                  Ingresar Empleado
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
        <div class="modal-confirmacion"> 
          <div class="modal-header">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Confirmar Ingreso</h3>
          </div>
          <div class="modal-body">
            <p>
              ¿Estás seguro que desea ingresar al empleado
              <strong>{{ EmpleadoDatos.nombre }} {{ EmpleadoDatos.apellido }}</strong>
              al sistema?
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
            <p>El empleado se ha ingresado y registrado correctamente.</p>
          </div>
          <div class="modal-footer-exito">
            <button class="btn-modal-continuar" @click="handleContinuarExito">
              Continuar
            </button>
          </div>
        </div>
      </div>
    </Transition>
    
    <Transition name="modal-fade">
      <div v-if="mostrarModalError" class="modal-overlay">
        <div class="modal-error"> 
          <div class="modal-header-error">
            <i class="fas fa-exclamation-triangle"></i> 
            <h3>Error en el Ingreso</h3>
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
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
// Asumimos las rutas de los componentes
import TablaHorarios from '../../Tablas y Filas/TablaHorario/TablaHorarios.vue';
import Titulo from '../../Titulo.vue';

import { crearEmpleado } from '@/api/services/empleadoService';
import { obtenerProvinciasArg, obtenerLocalidadesArg } from '@/api/services/georefService';

// --- Emits al padre (PantallaAdmin.vue) ---
const emit = defineEmits(['cancelar-nuevo-empleado','operacionFinalizada']);

// --- Estado de Modales ---
const mostrarModalExito = ref(false);
const mostrarModalConfirmacion = ref(false);
const mostrarModalError = ref(false);
const mensajeModalError = ref('');
const mostrarMensajeValidacion = ref(false);

// --- Datos del Formulario ---
// (1) Estructura para los datos del empleado
const EmpleadoDatos = ref({
  dni: '',
  nombre: '',
  apellido: '',
  sexo: 'M',
  rol: '', // <-- NUEVO CAMPO AÑADIDO
  email: '',
  telefono: '',
  provincia: '',
  localidad: '',
  calle: '',
  nro: ''
});

// (2) Estructura para los horarios
const HorariosEmpleado = ref([]);

// --- VARIABLES PARA GEOREF ---
const listaProvincias = ref([]);
const listaLocalidades = ref([]);
const cargandoProvincias = ref(false);
const cargandoLocalidades = ref(false);

// --- FUNCIONES DE CARGA ---
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
  EmpleadoDatos.value.localidad = '';
  listaLocalidades.value = [];
  
  // Buscamos el objeto provincia para obtener su ID (necesario para la API)
  // Usamos EmpleadoDatos porque es la variable reactiva de este componente
  const nombreSeleccionado = EmpleadoDatos.value.provincia;
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

// Cargar provincias al iniciar el componente
onMounted(() => {
  cargarProvincias();
});

// --- Lógica de Validación (Adaptada de NuevoAlumno) ---
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
// Watchers para validar los datos personales
watch(() => EmpleadoDatos.value.dni, (val) => { errores.value.dni = validarCampo('DNI', val); });
watch(() => EmpleadoDatos.value.nombre, (val) => { errores.value.nombre = validarCampo('Nombre', val); });
watch(() => EmpleadoDatos.value.apellido, (val) => { errores.value.apellido = validarCampo('Apellido', val); });
watch(() => EmpleadoDatos.value.rol, (val) => { errores.value.rol = validarCampo('Rol', val); }); // <-- WATCHER AÑADIDO 
watch(() => EmpleadoDatos.value.email, (val) => { errores.value.email = validarCampo('Email', val); });
watch(() => EmpleadoDatos.value.telefono, (val) => { errores.value.telefono = validarCampo('Teléfono', val); });
watch(() => EmpleadoDatos.value.provincia, (val) => { errores.value.provincia = validarCampo('Provincia', val); });
watch(() => EmpleadoDatos.value.localidad, (val) => { errores.value.localidad = validarCampo('Localidad', val); });
watch(() => EmpleadoDatos.value.calle, (val) => { errores.value.calle = validarCampo('Calle', val); });
watch(() => EmpleadoDatos.value.nro, (val) => { errores.value.nro = validarCampo('Número', val); });

// Función para recibir horarios de la tabla
const actualizarHorarios = (datosEmitidos) => {
  HorariosEmpleado.value = datosEmitidos?.horarios || []; 
  validarHorarios();
};

// Validación específica para horarios (debe tener al menos 1)
const validarHorarios = () => {
  if (HorariosEmpleado.value.length === 0) {
    errores.value.horarios = 'Debe seleccionar al menos un horario laboral.';
    return false;
  }
  delete errores.value.horarios;
  return true;
};

// Comprueba si todo el formulario es válido (para habilitar el botón)
const checkFormularioCompleto = () => {
  // Bucle modificado para iterar sobre las claves del ref
  for (const key of Object.keys(EmpleadoDatos.value)) {
    if (validarCampo(key, EmpleadoDatos.value[key])) return false;
  }
  if (HorariosEmpleado.value.length === 0) {
    return false;
  }
  return true;
};
const formularioCompletoValido = computed(() => {
  return checkFormularioCompleto();
});

// Mensaje para el botón deshabilitado
const mensajeBotonDeshabilitado = computed(() => {
  if (formularioCompletoValido.value) return '';
  if (HorariosEmpleado.value.length === 0) {
    return 'Falta seleccionar al menos un horario laboral.';
  }
  // Itera sobre los errores para encontrar el primero
  for (const key of Object.keys(EmpleadoDatos.value)) {
    if (validarCampo(key, EmpleadoDatos.value[key])) {
      return `Falta completar el campo: ${key}.`;
    }
  }
  return 'Faltan completar campos obligatorios.';
});

// Valida todos los campos y muestra todos los errores
const validarFormularioParaEnvio = () => {
  let esValido = true;
  // Bucle modificado para iterar sobre las claves
  for (const key of Object.keys(EmpleadoDatos.value)) {
    const errorMsg = validarCampo(key.charAt(0).toUpperCase() + key.slice(1), EmpleadoDatos.value[key]);
    errores.value[key] = errorMsg;
    if (errorMsg) esValido = false;
  }
  if (!validarHorarios()) esValido = false;
  return esValido;
};

// --- Manejadores de Eventos de Botones y Modales ---

const emitirCancelar = () => {
  emit('cancelar-nuevo-empleado'); 
};

// 1. Clic en "Ingresar Empleado"
const iniciarProcesoIngreso = () => {
  const esValido = validarFormularioParaEnvio();

  if (!esValido) {
    console.error("Formulario incompleto o con errores.");
    mostrarMensajeValidacion.value = true;
    return;
  }
  mostrarMensajeValidacion.value = false;
  mostrarModalConfirmacion.value = true;
};

// 2. Clic en "Cancelar" (Dentro del Modal de Confirmación)
const cancelarConfirmacion = () => {
  mostrarModalConfirmacion.value = false;
};

// 3. Clic en "Sí, Confirmar" (Dentro del Modal de Confirmación)
const realizarIngreso = async () => {
  mostrarModalConfirmacion.value = false;

  // =================================================================
  // == ✨ PREPARACIÓN DE DATOS PARA LA API (CORREGIDO) ✨ ==
  // =================================================================
  
  // Construimos el Payload exacto que espera el Backend (EmpleadoCreate)
  const payload = {
    // 1. Datos Personales
    dni: EmpleadoDatos.value.dni,
    nombre: EmpleadoDatos.value.nombre,
    apellido: EmpleadoDatos.value.apellido,
    sexo: EmpleadoDatos.value.sexo,
    email: EmpleadoDatos.value.email,
    telefono: EmpleadoDatos.value.telefono,

    // 2. Datos de Dirección (Mapeo de nombres para la API)
    nomProvincia: EmpleadoDatos.value.provincia, // API espera 'nomProvincia'
    nomLocalidad: EmpleadoDatos.value.localidad, // API espera 'nomLocalidad'
    calle: EmpleadoDatos.value.calle,
    numero: EmpleadoDatos.value.nro || "S/N", // Valor por defecto si está vacío

    // 3. Datos de Empleado
    rol: EmpleadoDatos.value.rol,

    // 4. Lista de Horarios
    // Mapeamos para enviar limpio solo lo que la API necesita: dia y nroGrupo
    horarios: HorariosEmpleado.value.map(h => ({
      dia: h.dia,
      nroGrupo: h.nroGrupo
    }))
  };
  
  // =================================================================
  // ==         CONSOLE.LOG PARA DEPURACIÓN                         ==
  // =================================================================
  console.log("--- DATOS FINALES PARA ENVIAR A LA API ---");
  console.log(JSON.stringify(payload, null, 2));
  console.log("-----------------------------------------");

  // =================================================================
  // ==         LLAMADA REAL A LA API                               ==
  // =================================================================
  try {
    // Si tienes una ref de loading, actívala aquí: loading.value = true;
    
    // Llamada al servicio
    await crearEmpleado(payload);
    
    console.log("Empleado registrado con éxito en la BD");
    
    // Mensaje de éxito
    mostrarModalExito.value = true;

  } catch (error) {
    console.error("Error al registrar al empleado:", error);
    
    // Extraer mensaje de error del backend (ej: "El DNI ya existe")
    const errorMsg = error.response?.data?.error || 'Error desconocido al intentar guardar.';
    mensajeModalError.value = errorMsg;
    mostrarModalError.value = true;
    
  } finally {
    // loading.value = false;
  }
};

// 4. Clic en "Continuar" (Modal de Éxito)
function handleContinuarExito() {
  mostrarModalExito.value = false;
  emit('operacionFinalizada'); // Avisa al padre (PantallaAdmin) que todo terminó
}

// 5. Clic en "Entendido" (Modal de Error)
function handleContinuarError() {
  mostrarModalError.value = false;
}

</script>

<style scoped>
/* Estilos locales copiados de NuevoAlumno.vue */

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

/* Estilos para errores (los .form-group y .form-label están en global) */
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