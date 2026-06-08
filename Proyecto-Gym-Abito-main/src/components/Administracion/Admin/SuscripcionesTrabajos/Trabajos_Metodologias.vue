<template>
  <div class="contenedor-trabajos">
    <div class="encabezado-trabajos">
      <Titulo texto="TRABAJOS Y METODOLOGÍAS" />
      <p class="subtitulo">Gestiona los tipos de entrenamiento disponibles para los alumnos</p>
    </div>

    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <span>Cargando metodologías...</span>
    </div>
    <template v-else>
      <transition name="fade-scale" @after-leave="mostrarFormularioDespuesDeBoton">
        <div v-if="!mostrarFormulario && !transicionEnProgreso" class="contenedor-boton-agregar">
          <button class="btn-agregar-global" @click="iniciarTransicionAFormulario">
            <i class="fas fa-plus"></i>
            Agregar Nueva Metodología
          </button>
        </div>
      </transition>
      
      <transition 
        name="slide-down" 
        @after-leave="transicionEnProgreso = false"
        @after-enter="transicionEnProgreso = false"
      >
        <AgregarModificar v-if="mostrarFormulario" v-model="nuevoTrabajo" :es-edicion="trabajoEditando !== null"
          :config="configFormulario" @guardar="guardarTrabajo" @cancelar="iniciarTransicionABoton" />
      </transition>

      <Items :items="trabajos" :config="configLista" empty-message="No hay metodologías cargadas"
        empty-icon="fas fa-dumbbell" @editar="editarTrabajo" @eliminar="eliminarTrabajo" />
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
            <p v-if="trabajoAEliminar">
              ¿Estás seguro que deseas eliminar la metodología 
              <strong>"{{ trabajoAEliminar.nombre }}"</strong>?
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
import { ref, onMounted } from 'vue';
import AgregarModificar from './AgregarModificar.vue';
import Items from '../Items.vue';
import Titulo from '../../Titulo.vue';

import {
  obtenerTrabajos as obtenerTrabajosAPI,
  eliminarTrabajo as eliminarTrabajoAPI,
  crearTrabajo as crearTrabajoAPI,
  actualizarTrabajo as actualizarTrabajoAPI
} from '@/api/services/trabajoService';

// --- Refs de Modales
const mostrarModalExito = ref(false);
const mensajeModalExito = ref('');
const mostrarModalError = ref(false);
const mensajeModalError = ref('');
const mostrarModalConfirmacion = ref(false);
const trabajoAEliminar = ref(null);

// --- Refs existentes ---
const configFormulario = {
  tituloSingular: 'Metodología',
  layout: 'stacked',
  contexto: 'trabajos',
  campo1: { key: 'nombre', label: 'Nombre:', placeholder: 'Ej: Musculación', esTextarea: false, tipoInput: 'text', readonly: false },
  campo2: { key: 'descripcion', label: 'Descripción:', placeholder: 'Describe la metodología...', esTextarea: true, tipoInput: 'text', readonly: false }
};
const configLista = {
  contexto: 'trabajos',
  key1: 'nombre',
  showKey2: false,
  key2: 'descripcion',
  styleKey2: 'descripcion'
};

const trabajos = ref([]);
const mostrarFormulario = ref(false);
const trabajoEditando = ref(null);
const transicionEnProgreso = ref(false);
const cargando = ref(true); // <-- Ya tenías este ref
const errorCarga = ref(null);

const nuevoTrabajo = ref({
  nombre: '',
  descripcion: ''
});

const cargarTrabajos = async () => {
  cargando.value = true; // <-- Se activa la carga
  errorCarga.value = null;
  try {
    const data = await obtenerTrabajosAPI();
    if (!Array.isArray(data)) {
      throw new Error("La API no devolvió un formato de trabajos válido.");
    }
    trabajos.value = data.map((item, index) => ({
      id: item.id || item.nombreTrabajo || index + 1,
      nombre: item.nombreTrabajo,
      descripcion: item.descripcion || ''
    }));
  } catch (error) {
    console.error('Error cargando trabajos desde la API:', error);
    errorCarga.value = "No se pudieron cargar las metodologías.";
    mensajeModalError.value = error.response?.data?.detail || errorCarga.value;
    mostrarModalError.value = true;
  } finally {
    cargando.value = false; // <-- Se desactiva la carga
  }
};

// ... (resto de funciones sin cambios) ...
const scrollArribaInmediato = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const iniciarTransicionAFormulario = () => {
  nuevoTrabajo.value = { nombre: '', descripcion: '' };
  trabajoEditando.value = null;
  transicionEnProgreso.value = true;
  scrollArribaInmediato();
};
const mostrarFormularioDespuesDeBoton = () => {
  mostrarFormulario.value = true;
};
const iniciarTransicionABoton = () => {
  transicionEnProgreso.value = true; 
  mostrarFormulario.value = false;
  trabajoEditando.value = null;
  nuevoTrabajo.value = { nombre: '', descripcion: '' };

  // Respaldo de seguridad
  setTimeout(() => {
    transicionEnProgreso.value = false;
  }, 350);
};
const editarTrabajo = (trabajo) => {
  nuevoTrabajo.value = { ...trabajo };
  trabajoEditando.value = trabajo.id;
  if (!mostrarFormulario.value) {
    transicionEnProgreso.value = true;
  }
  mostrarFormulario.value = true;
  scrollArribaInmediato();
};
const guardarTrabajo = async (datosRecibidos) => {
  if (!datosRecibidos.nombre) {
    mensajeModalError.value = 'Por favor completa el campo Nombre';
    mostrarModalError.value = true;
    return;
  }
  try {
    let mensaje = '';
    const datosParaAPI = {
      nombreTrabajo: datosRecibidos.nombre,
      descripcion: datosRecibidos.descripcion
    };
    if (trabajoEditando.value) {
      const index = trabajos.value.findIndex(t => t.id === trabajoEditando.value);
      if (index === -1) throw new Error("No se encontró el trabajo original.");
      const nombreOriginal = trabajos.value[index].nombre;
      await actualizarTrabajoAPI(nombreOriginal, datosParaAPI);
      mensaje = 'Metodología actualizada correctamente';
    } else {
      if (trabajos.value.some(t => t.nombre.toLowerCase() === datosRecibidos.nombre.toLowerCase())) {
        mensajeModalError.value = `La metodología "${datosRecibidos.nombre}" ya existe.`;
        mostrarModalError.value = true;
        return;
      }
      await crearTrabajoAPI(datosParaAPI);
      mensaje = 'Metodología creada correctamente';
    }
    await cargarTrabajos(); 
    mensajeModalExito.value = mensaje; 
    mostrarModalExito.value = true; 
  } catch (error) {
    console.error("Error al guardar el trabajo:", error);
    const errorMsg = error.response?.data?.detail || 'No se pudo guardar la metodología.';
    mensajeModalError.value = errorMsg;
    mostrarModalError.value = true;
  }
};
const eliminarTrabajo = async (id) => {
  const trabajo = trabajos.value.find(t => t.id === id);
  if (!trabajo) {
    mensajeModalError.value = "Error: No se pudo encontrar el trabajo.";
    mostrarModalError.value = true;
    return;
  }
  trabajoAEliminar.value = trabajo;
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
  trabajoAEliminar.value = null;
};
const handleConfirmarEliminacion = async () => {
  if (!trabajoAEliminar.value) return;
  const nombreParaAPI = trabajoAEliminar.value.nombre;
  mostrarModalConfirmacion.value = false;
  try {
    await eliminarTrabajoAPI(nombreParaAPI);
    await cargarTrabajos(); 
    mensajeModalExito.value = 'Metodología eliminada correctamente';
    mostrarModalExito.value = true;
  } catch (error) {
    console.error("Error al eliminar el trabajo:", error);
    const errorMsg = error.response?.data?.detail || 'No se pudo eliminar la metodología.';
    mensajeModalError.value = errorMsg;
    mostrarModalError.value = true;
  } finally {
    trabajoAEliminar.value = null;
  }
};
onMounted(cargarTrabajos);
</script>

<style scoped>
/* Estilos locales (sin cambios) */
.contenedor-trabajos {
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
.encabezado-trabajos {
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
  transition: all 0.2s ease-out;
}
.fade-scale-leave-active {
  transition: all 0.2s ease-in;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.slide-down-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-down-leave-active {
  transition: all 0.25s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-15px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
@media (max-width: 768px) {
  .contenedor-trabajos {
    padding: 1.5rem;
  }
}
@media (max-width: 480px) {
  .contenedor-trabajos {
    padding: 1rem;
  }
}
</style>