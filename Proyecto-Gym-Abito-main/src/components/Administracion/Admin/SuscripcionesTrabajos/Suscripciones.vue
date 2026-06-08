<template>
  <div class="contenedor-suscripciones">
    <div class="encabezado-suscripciones">
      <Titulo texto="SUSCRIPCIONES" />
      <p class="subtitulo">Gestiona las suscripciones disponibles para los alumnos</p>
    </div>

    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <span>Cargando suscripciones...</span>
    </div>
    <template v-else>
      <transition name="fade-scale" @after-leave="mostrarFormularioDespuesDeBotón">
        <div v-if="!mostrarFormulario && !transicionEnProgreso" class="contenedor-boton-agregar">
          <button class="btn-agregar-global" @click="iniciarTransicionAFormulario">
            <i class="fas fa-plus"></i>
            Agregar Nueva Suscripción
          </button>
        </div>
      </transition>
      
      <transition 
        name="slide-down" 
        @after-leave="transicionEnProgreso = false"
        @after-enter="transicionEnProgreso = false"
      >
        <AgregarModificar
          v-if="mostrarFormulario"
          v-model="datosFormulario" :es-edicion="suscripcionEditando !== null"
          :config="configFormularioComputada" @guardar="guardarSuscripcion"
          @cancelar="iniciarTransicionABoton"
        />
      </transition>

      <Items
        :items="suscripciones"
        :config="configLista"
        empty-message="No hay suscripciones cargadas"
        empty-icon="fas fa-info-circle"
        @editar="editarSuscripcion"
        @eliminar="eliminarSuscripcion"
      />

      <div v-if="suscripcionNuevaGuardada" style="margin-top: 2rem; padding: 1rem; border: 1px dashed blue; background: #eef;">
          <strong>Suscripción Nueva Guardada (Temporal):</strong>
          <pre>{{ suscripcionNuevaGuardada }}</pre>
      </div>
    </template>
    <Transition name="modal-fade">
      <div v-if="mostrarModalExito" class="modal-overlay">
        <div class="modal-exito">
          <div class="modal-header-exito">
            <i class="fas fa-check-circle"></i>
            <h3>¡Éxito!</h3>
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

    <Transition name="modal-fade">
      <div v-if="mostrarModalConfirmacion" class="modal-overlay">
        <div class="modal-confirmacion">
          <div class="modal-header">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Confirmar Eliminación</h3>
          </div>
          <div class="modal-body">
            <p v-if="suscripcionAEliminar">
              ¿Estás seguro que deseas eliminar la suscripción 
              <strong>"{{ suscripcionAEliminar.descripcion }}"</strong>?
            </p>
            <p style="margin-top: 1rem; font-size: 0.95rem; color: #495057;">
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-modal btn-cancelar-modal" @click="handleCancelarEliminacion">
              Cancelar
            </button>
            <button class="btn-modal btn-confirmar-modal" @click="handleConfirmarEliminacion">
              Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    </Transition>
    </div>
</template>

<script setup>
// Script (sin cambios en la lógica, ya tenías 'cargando')
import { ref, computed, onMounted } from 'vue';
import AgregarModificar from './AgregarModificar.vue';
import Items from '../Items.vue';
import Titulo from '../../Titulo.vue';

import {
  obtenerSuscripciones,
  eliminarSuscripcion as eliminarSuscripcionAPI,
  crearSuscripcion,
  actualizarPrecioSuscripcion
} from '@/api/services/suscripcionesService';

// --- Refs de Modales
const mostrarModalExito = ref(false);
const mensajeModalExito = ref('');
const mostrarModalError = ref(false);
const mensajeModalError = ref('');
const mostrarModalConfirmacion = ref(false);
const suscripcionAEliminar = ref(null);

// --- Refs existentes ---
const configFormBase = {
  tituloSingular: 'Suscripción',
  layout: 'inline',
  contexto: 'suscripciones',
};
const configLista = ref({
  contexto: 'suscripciones',
  key1: 'descripcion',
  showKey2: true,
  key2: 'precio',
  styleKey2: 'precio',
  formatoPrecio: true
});

const suscripciones = ref([]);
const mostrarFormulario = ref(false);
const suscripcionEditando = ref(null);
const transicionEnProgreso = ref(false);
const datosFormulario = ref({ descripcion: '', precio: '' });
const suscripcionNuevaGuardada = ref(null);

const cargando = ref(true); // <-- Ya tenías este ref
const errorCarga = ref(null);

const configFormularioComputada = computed(() => {
  const esEdicion = suscripcionEditando.value !== null;
  return {
    ...configFormBase,
    campo1: esEdicion
      ? { key: 'descripcion', label: 'Descripción:', placeholder: 'Descripción (No editable)', esTextarea: false, tipoInput: 'text', readonly: true }
      : { key: 'descripcion', label: 'Días por semana:', placeholder: 'Ej: 3', esTextarea: false, tipoInput: 'number', min: '1', readonly: false },
    campo2: { key: 'precio', label: 'Precio (número):', placeholder: 'Ej: 20000', esTextarea: false, tipoInput: 'number', min: '0', readonly: false }
  };
});

const cargarSuscripciones = async () => {
  cargando.value = true; // <-- Se activa la carga
  errorCarga.value = null;
  try {
    const data = await obtenerSuscripciones();
    if (!Array.isArray(data)) {
      throw new Error("La respuesta de la API no es un array de suscripciones.");
    }
    suscripciones.value = data.map((item, index) => {
      const precioNum = (typeof item.precio === 'number' && !isNaN(item.precio)) ? item.precio : 0;
      const descripcionApi = item.nombreSuscripcion || 'Suscripción sin nombre';
      return { 
        id: item.idSuscripcion || descripcionApi || index + 1, 
        descripcion: descripcionApi,
        precio: precioNum 
      };
    });
  } catch (error) {
    console.error('Error cargando suscripciones desde la API:', error);
    errorCarga.value = 'No se pudieron cargar las suscripciones.';
    mensajeModalError.value = error.response?.data?.detail || errorCarga.value;
    mostrarModalError.value = true;
  } finally {
    cargando.value = false; // <-- Se desactiva la carga
  }
};

// ... (resto de funciones sin cambios) ...
const iniciarTransicionAFormulario = () => {
  datosFormulario.value = { descripcion: '', precio: '' };
  suscripcionEditando.value = null;
  suscripcionNuevaGuardada.value = null;
  transicionEnProgreso.value = true;
};
const mostrarFormularioDespuesDeBotón = () => { mostrarFormulario.value = true; };
const iniciarTransicionABoton = () => {
  transicionEnProgreso.value = true; 
  mostrarFormulario.value = false;
  suscripcionEditando.value = null;
  datosFormulario.value = { descripcion: '', precio: '' };

  // Agregamos este respaldo para asegurar que el botón aparezca
  // independientemente de si la transición de Vue termina o no.
  setTimeout(() => {
    transicionEnProgreso.value = false;
  }, 350); // 350ms es suficiente para que termine la animación CSS
};
const editarSuscripcion = (suscripcion) => {
  datosFormulario.value = {
      descripcion: suscripcion.descripcion,
      precio: suscripcion.precio
  };
  suscripcionEditando.value = suscripcion.id;
  suscripcionNuevaGuardada.value = null;
  if (!mostrarFormulario.value) { transicionEnProgreso.value = true; }
  mostrarFormulario.value = true;
};
const guardarSuscripcion = async (datosRecibidos) => {
  const claveCampo1 = configFormularioComputada.value.campo1.key;
  const claveCampo2 = configFormularioComputada.value.campo2.key;
  const valorCampo1 = datosRecibidos[claveCampo1];
  const valorCampo2 = datosRecibidos[claveCampo2];

  if (valorCampo1 === '' || valorCampo1 === null || valorCampo1 === undefined ||
      valorCampo2 === '' || valorCampo2 === null || valorCampo2 === undefined) {
    mensajeModalError.value = 'Por favor completa todos los campos';
    mostrarModalError.value = true;
    return;
  }
  const precioNum = parseFloat(valorCampo2);
  if (isNaN(precioNum) || precioNum < 0) {
    mensajeModalError.value = 'El precio debe ser un número válido mayor o igual a 0.';
    mostrarModalError.value = true;
    return;
  }
  try {
    let mensaje = '';
    if (suscripcionEditando.value !== null) {
      const index = suscripciones.value.findIndex(s => s.id === suscripcionEditando.value);
      if (index === -1) throw new Error("No se pudo encontrar la suscripción para actualizar.");
      const nombreSuscripcion = suscripciones.value[index].descripcion;
      await actualizarPrecioSuscripcion(nombreSuscripcion, precioNum);
      mensaje = 'Precio de suscripción actualizado';
    } else {
      const diasNum = parseInt(valorCampo1);
      if (isNaN(diasNum) || diasNum <= 0) {
        mensajeModalError.value = 'La cantidad de días debe ser un número entero mayor a 0.';
        mostrarModalError.value = true;
        return;
      }
      const descripcionFormateada = `${diasNum} ${diasNum === 1 ? 'día' : 'días'} a la semana`;
      if (suscripciones.value.some(s => s.descripcion.toLowerCase() === descripcionFormateada.toLowerCase())) {
        mensajeModalError.value = `La suscripción "${descripcionFormateada}" ya existe.`;
        mostrarModalError.value = true;
        return;
      }
      const nuevaSub = { 
        nombreSuscripcion: descripcionFormateada, 
        precio: precioNum 
      };
      await crearSuscripcion(nuevaSub);
      mensaje = 'Suscripción creada correctamente';
    }
    await cargarSuscripciones();
    mensajeModalExito.value = mensaje;
    mostrarModalExito.value = true;
  } catch (error) {
    console.error("Error al guardar la suscripción:", error);
    const errorMsg = error.response?.data?.detail || 'No se pudo completar la operación.';
    mensajeModalError.value = errorMsg;
    mostrarModalError.value = true;
  }
};
const eliminarSuscripcion = (id) => {
  const suscripcion = suscripciones.value.find(s => s.id === id);
  if (!suscripcion) {
    mensajeModalError.value = "Error: No se pudo encontrar la suscripción.";
    mostrarModalError.value = true;
    return;
  }
  suscripcionAEliminar.value = suscripcion;
  mostrarModalConfirmacion.value = true;
};
const handleContinuarExito = () => {
  mostrarModalExito.value = false;
  mensajeModalExito.value = '';
  if (mostrarFormulario.value) {
    iniciarTransicionABoton();
  }
};
const handleContinuarError = () => {
  mostrarModalError.value = false;
  mensajeModalError.value = '';
};
const handleCancelarEliminacion = () => {
  mostrarModalConfirmacion.value = false;
  suscripcionAEliminar.value = null;
};
const handleConfirmarEliminacion = async () => {
  if (!suscripcionAEliminar.value) return;
  const nombreParaAPI = suscripcionAEliminar.value.descripcion;
  mostrarModalConfirmacion.value = false; 
  try {
    const exito = await eliminarSuscripcionAPI(nombreParaAPI);
    if (exito) {
      await cargarSuscripciones(); 
      mensajeModalExito.value = 'Suscripción eliminada correctamente';
      mostrarModalExito.value = true;
    } else {
      throw new Error("La API de eliminar no devolvió un estado de éxito.");
    }
  } catch (error) {
    const errorMsg = error.response?.data?.error || 'No se pudo eliminar la suscripción.';
    mensajeModalError.value = errorMsg;
    mostrarModalError.value = true;
  } finally {
    suscripcionAEliminar.value = null;
  }
};
onMounted(cargarSuscripciones);
</script>

<style scoped>
/* Estilos locales (sin cambios) */
.contenedor-suscripciones {
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
.encabezado-suscripciones {
  text-align: center;
  margin-bottom: 2rem;
}
.subtitulo {
  color: #666;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}
.fade-scale-enter-active {
  transition: all 0.3s ease-out;
}
.fade-scale-leave-active {
  transition: all 0.3s ease-in;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
.slide-down-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
@media (max-width: 768px) {
  .contenedor-suscripciones {
    padding: 1.5rem;
  }
}
@media (max-width: 480px) {
  .contenedor-suscripciones {
    padding: 1rem;
  }
}
</style>