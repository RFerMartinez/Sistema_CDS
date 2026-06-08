<template>
  <div class="contenedor-personas">
    <div class="encabezado-personas">
      <Titulo texto="PERSONAS INTERESADAS" />
      <p class="subtitulo">Gestiona las personas registradas antes de su ingreso como alumnos</p>
      <div class="filtros-busqueda">
        <div class="busqueda-input-container">
          <i class="fas fa-search icono-busqueda"></i>
          <input
            v-model="terminoBusqueda"
            type="text"
            class="input-busqueda"
            placeholder="Buscar por DNI, nombre o apellido..."
            @input="aplicarFiltros"
          >
          <button
            v-if="terminoBusqueda"
            class="btn-limpiar-busqueda"
            @click="limpiarBusqueda"
            aria-label="Limpiar búsqueda"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <div> 
      <TablaAlumnos
        :alumnos="personasFiltradas"
        :cargando="loading"
        :elementos-por-pagina="elementosPorPagina"
        :loading-text="'Cargando personas...'"
        modo="personas"
        @realizarIngreso="emitVerIngreso"
        @eliminarPersona="manejarEliminarPersona" 
      />
    </div>

    <Transition name="modal-fade">
      <div v-if="mostrarModalConfirmacion" class="modal-overlay">
        <div class="modal-confirmacion" :style="estiloBordeModal"> 
          <div class="modal-header">
            <i class="fas fa-exclamation-triangle" :style="estiloIconoModal"></i>
            <h3>{{ tituloModalConfirmacion }}</h3>
          </div>
          
          <div class="modal-body">
            <div v-html="mensajeModalConfirmacion"></div>
          </div>
          
          <div class="modal-footer">
            <button class="btn-modal btn-cancelar-modal" @click="mostrarModalConfirmacion = false">
              Cancelar
            </button>
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TablaAlumnos from '../Tablas y Filas/TablaAlumnosPersonas/TablaAlumnos.vue'; 
import Titulo from '../Titulo.vue';
import { filterItems } from '@/utils/formatters'; 

import {
  listarPersonas,
  eliminarPersona
} from '@/api/services/personaService';

const emit = defineEmits(['verIngreso']);

// --- Lógica de datos y filtros ---
const personas = ref([]);
const elementosPorPagina = 30;
const terminoBusqueda = ref('');
const loading = ref(true); 

// --- VARIABLES PARA MODALES ---
const mostrarModalConfirmacion = ref(false);
const tituloModalConfirmacion = ref('');
const mensajeModalConfirmacion = ref('');
const funcionConfirmar = ref(null);
const claseBotonConfirmar = ref(''); 
const estiloBordeModal = ref(''); 
const estiloIconoModal = ref(''); 

const mostrarModalExito = ref(false);
const mensajeModalExito = ref('');

const mostrarModalError = ref(false);
const mensajeModalError = ref('');

// Variable temporal para saber a quién estamos eliminando
const personaParaEliminar = ref(null);

const listarFromApi = async () => {
  loading.value = true;
  try {
    const respuestaAlumnos = await listarPersonas();
    personas.value = respuestaAlumnos;
  } catch (error) {
    console.error('Error al cargar la información:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  listarFromApi();
});

const personasFiltradas = computed(() => {
  if (loading.value || !Array.isArray(personas.value)) { return []; } 
  return filterItems(personas.value, terminoBusqueda.value);
});

const aplicarFiltros = () => {};

const limpiarBusqueda = () => {
  terminoBusqueda.value = '';
};

const emitVerIngreso = (persona) => {
  emit('verIngreso', persona);
}

// --- LÓGICA DE ELIMINACIÓN CON MODALES ---

// 1. Abre el modal de confirmación
const manejarEliminarPersona = (persona) => {
  // Guardamos la persona temporalmente
  personaParaEliminar.value = persona;

  // Configuramos estilos del modal (Peligro/Rojo)
  tituloModalConfirmacion.value = 'Eliminar Persona';
  claseBotonConfirmar.value = 'btn-confirmar-peligro';
  estiloBordeModal.value = 'border-top: 5px solid #F44336 !important;';
  estiloIconoModal.value = 'color: #F44336;';

  // Mensaje HTML solicitado
  mensajeModalConfirmacion.value = `
    <p>¿Estás seguro que desea eliminar a <strong>${persona.nombre} ${persona.apellido}</strong>?</p>
    <p style="margin-top: 1rem; font-size: 0.9rem; color: #d32f2f; font-weight: 500;">
      Se eliminarán todos los datos y esta acción no se puede deshacer.
    </p>
  `;

  // Asignamos la función que realmente hace la eliminación
  funcionConfirmar.value = confirmarEliminarPersona;
  
  // Mostramos el modal
  mostrarModalConfirmacion.value = true;
};

// 2. Función "Maestra" que ejecuta la acción confirmada
const ejecutarAccionConfirmada = async () => {
  mostrarModalConfirmacion.value = false;
  if (funcionConfirmar.value) {
    await funcionConfirmar.value();
  }
}

// 3. Función que llama a la API (se ejecuta al dar click en "Sí, Confirmar")
const confirmarEliminarPersona = async () => {
  if (!personaParaEliminar.value) return;

  try {
    // Llamada a la API
    await eliminarPersona(personaParaEliminar.value.dni);
    
    // Configurar y mostrar modal de éxito
    mensajeModalExito.value = 'La persona ha sido eliminada correctamente.';
    mostrarModalExito.value = true;

  } catch (error) {
    // Configurar y mostrar modal de error
    console.error(`Error al eliminar DNI ${personaParaEliminar.value.dni}:`, error);
    mensajeModalError.value = error.response?.data?.error || 'No se pudo eliminar a la persona.';
    mostrarModalError.value = true;
  }
};

// 4. Manejo post-éxito (Click en "Continuar" del modal verde)
const handleContinuarExito = () => {
  mostrarModalExito.value = false;
  personaParaEliminar.value = null; // Limpiar variable temp
  listarFromApi(); // Recargar la tabla
};

// 5. Manejo post-error (Click en "Entendido")
const handleContinuarError = () => {
  mostrarModalError.value = false;
};

</script>

<style scoped>
/* ESTILOS LIMPIOS */
.contenedor-personas {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  position: relative;
}
.encabezado-personas {
  text-align: center;
  margin-bottom: 2rem;
}

.subtitulo {
  color: #666;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
}
.filtros-busqueda {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.busqueda-input-container {
  position: relative;
  flex: 1;
  max-width: 400px;
  min-width: 250px;
}
.icono-busqueda {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 2;
}
.input-busqueda {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: white;
  font-family: 'Poppins', sans-serif;
}
.input-busqueda:focus {
  outline: none;
  border-color: #ea280ae0;
  box-shadow: 0 0 0 3px rgba(233, 44, 30, 0.1);
}
.btn-limpiar-busqueda {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}
.btn-limpiar-busqueda:hover {
  background: #f8f9fa;
  color: #e91e63;
}

@media (max-width: 768px) {
  .contenedor-personas { padding: 1.5rem; }
  .filtros-busqueda { flex-direction: column; gap: 1rem; }
  .busqueda-input-container {
    position: relative;
    flex: 1;
    max-width: 400px;
    min-width: 300px;
  }
}
@media (max-width: 480px) {
  .contenedor-personas { padding: 1rem; }
  .filtros-busqueda { gap: 0.8rem; }
  .input-busqueda { padding: 0.7rem 0.9rem 0.7rem 2.8rem; font-size: 0.85rem; }
}
.modal-footer {
  display: flex;
  justify-content: center; /* <--- ESTO centra los botones */
  align-items: center;
  gap: 1.5rem; /* Espacio entre los botones Cancelar y Confirmar */
  padding-bottom: 1.5rem; /* Un poco de aire abajo si lo necesitas */
  width: 100%;
}
</style>