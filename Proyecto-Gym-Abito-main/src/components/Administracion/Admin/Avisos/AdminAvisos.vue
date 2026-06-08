<template>
  <div class="contenedor">
    <div class="encabezado">
      <Titulo texto="Avisos" />
      <p class="subtitulo">Podras generar y enviar avisos a todos los alumnos del gimnasio</p>
    </div>

    <div class="acciones-globales">
      <button class="btn-anadir" @click="anadirNuevoAviso">
        <i class="fas fa-plus-circle"></i> 
        Añadir aviso
      </button>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <span>Cargando avisos...</span>
    </div>

    <div v-else class="lista-avisos" ref="listaAvisosRef">
      <Aviso
        v-for="aviso in avisos"
        :key="aviso.idAviso"
        :aviso="aviso"
        :showControls="true" @guardar-aviso="manejarGuardarAviso"
        @eliminar-aviso="manejarEliminarAviso"
      />
    </div>

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
            <p>¿Estás seguro que deseas eliminar este aviso?</p>
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
import { ref, onMounted, nextTick } from 'vue';
import Titulo from '../../Titulo.vue';
import Aviso from './Aviso.vue'; 

// Importamos el servicio y los formateadores
import { listarAvisos, crearAviso, actualizarAviso, eliminarAviso } from '@/api/services/avisosService';
import { formatearFecha, formatearHora } from '@/utils/formatters';

// --- Refs de Estado ---
const listaAvisosRef = ref(null);
const avisos = ref([]);
const loading = ref(true);

// --- Refs de Modales ---
const mostrarModalExito = ref(false);
const mensajeModalExito = ref('');
const mostrarModalError = ref(false);
const mensajeModalError = ref('');
const mostrarModalConfirmacion = ref(false);
const avisoAEliminar = ref(null); 

// --- Carga de Datos ---
const cargarAvisos = async () => {
  loading.value = true;
  try {
    const data = await listarAvisos();
    
    // Formateamos las fechas/horas que vienen de la API para mostrarlas bien
    avisos.value = data.map(aviso => ({
      ...aviso,
      // Usamos tus funciones de utilidad si existen, si no, dejamos el original
      fecha: formatearFecha ? formatearFecha(aviso.fecha) : aviso.fecha, 
      hora: formatearHora ? formatearHora(aviso.hora) : aviso.hora
    }));

  } catch (error) {
    console.error("Error al cargar los avisos:", error);
    mensajeModalError.value = "No se pudieron cargar los avisos.";
    mostrarModalError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(cargarAvisos);

const anadirNuevoAviso = async () => {
  const nuevoAviso = {
    // Usamos null o un ID temporal negativo para indicar que es local
    idAviso: null, 
    descripcion: '', 
    fecha: '', // Se mostrará vacío hasta que se guarde y recargue
    hora: '', 
    _isNew: true 
  };

  avisos.value.unshift(nuevoAviso); // Lo agregamos al principio para verlo rápido
  
  await nextTick();
  if (listaAvisosRef.value) {
    // Scroll al primer elemento
    listaAvisosRef.value.firstElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const manejarGuardarAviso = async (avisoGuardado) => {
  try {
    let mensaje = '';
    
    // Preparamos solo los datos que la API espera
    const payload = {
      descripcion: avisoGuardado.descripcion
    };

    if (avisoGuardado._isNew) {
      console.log("Creando aviso...", payload);
      await crearAviso(payload);
      mensaje = 'Aviso creado correctamente';
    
    } else {
      console.log("Actualizando aviso...", avisoGuardado.idAviso);
      await actualizarAviso(avisoGuardado.idAviso, payload);
      mensaje = 'Aviso modificado correctamente';
    }
    
    // Recargamos para obtener los datos frescos (fechas generadas por BD)
    await cargarAvisos(); 
    
    mensajeModalExito.value = mensaje;
    mostrarModalExito.value = true;

  } catch (error) {
    console.error("Error al guardar el aviso:", error);
    const errorMsg = error.response?.data?.detail || 'No se pudo guardar el aviso.';
    mensajeModalError.value = errorMsg;
    mostrarModalError.value = true;
  }
};

const manejarEliminarAviso = (avisoParaEliminar) => {
  // Si es uno nuevo que aún no se guardó en BD (no tiene idAviso real)
  if (avisoParaEliminar._isNew) {
    avisos.value = avisos.value.filter(a => a !== avisoParaEliminar);
    return;
  }
  avisoAEliminar.value = avisoParaEliminar;
  mostrarModalConfirmacion.value = true;
};

// --- Handlers de Modales ---

const handleConfirmarEliminacion = async () => {
  if (!avisoAEliminar.value) return;
  mostrarModalConfirmacion.value = false;
  
  try {
    await eliminarAviso(avisoAEliminar.value.idAviso);
    
    // Eliminamos localmente para no tener que recargar toda la lista si no queremos
    avisos.value = avisos.value.filter(a => a.idAviso !== avisoAEliminar.value.idAviso);
    
    mensajeModalExito.value = 'Aviso eliminado correctamente';
    mostrarModalExito.value = true;

  } catch (error) {
    console.error("Error al eliminar el aviso:", error);
    const errorMsg = error.response?.data?.detail || 'No se pudo eliminar el aviso.';
    mensajeModalError.value = errorMsg;
    mostrarModalError.value = true;
  } finally {
    avisoAEliminar.value = null; 
  }
};

const handleCancelarEliminacion = () => {
  mostrarModalConfirmacion.value = false;
  avisoAEliminar.value = null;
};

const handleContinuarExito = () => {
  mostrarModalExito.value = false;
};

const handleContinuarError = () => {
  mostrarModalError.value = false;
};
</script>

<style scoped>
/* Estilos del contenedor principal (ya los tenías) */
.contenedor {
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
  position: relative; /* Para el loader */
}

.encabezado {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitulo {
  color: #666;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* Estilos para el botón de Añadir */
.acciones-globales {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start; 
}

/* ===== CORRECCIÓN DE ESTILO DEL BOTÓN ===== */
.btn-anadir {
  padding: 0.8rem 1.5rem;
  background-color: #343a40; /* Color oscuro del sidebar */
  color: white;
  border: none;
  border-radius: 8px; 
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.btn-anadir:hover {
  background-color: #23272b; /* Oscuro (hover) */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
/* ===== FIN DE LA CORRECCIÓN ===== */


/* Contenedor de la lista de avisos */
.lista-avisos {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Espacio entre cada aviso */
}

/* Estilos de carga (globales, pero por si acaso) */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
  color: #666;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #dc3545; 
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .contenedor {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .contenedor {
    padding: 1rem;
  }
  .acciones-globales {
    justify-content: stretch;
  }
  .btn-anadir {
    width: 100%;
    justify-content: center;
  }
}
</style>