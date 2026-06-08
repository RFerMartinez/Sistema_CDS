<template>
  <div class="aviso-card" :class="{ 'modo-edicion': modoEdicion }">
    
    <div class="aviso-wrapper">
      <Transition name="slide-fade" mode="out-in">

        <div v-if="!modoEdicion" key="vista" class="vista-container">
          
          <div class="fecha-columna">
            <i class="fas fa-calendar-alt"></i>
            <span class="fecha">{{ aviso.fecha }}</span>
            <span class="hora">{{ aviso.hora }}</span>
          </div>

          <div class="contenido-columna">
            <div class="aviso-header">
              <i class="fas fa-bullhorn"></i>
              <h4>Aviso</h4>
            </div>

            <div class="aviso-body">
              <p>{{ aviso.descripcion }}</p>
            </div>

            <div v-if="showControls" class="aviso-actions">
              <button class="btn-fila btn-modificar" @click="activarModoEdicion">
                <i class="fas fa-pen"></i> Editar
              </button>
              <button class="btn-fila btn-eliminar" @click="mostrarConfirmacionEliminar">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </div>
          </div>

        </div>

        <form v-else key="edicion" class="form-edicion" @submit.prevent="guardarCambios">
          <div class="info-item-edit">
            <label :for="'desc-' + aviso.idAviso">Descripción del Aviso</label>
            <textarea 
              :id="'desc-' + aviso.idAviso"
              v-model="avisoEditable.descripcion" 
              class="input-textarea"
              placeholder="Escribe el aviso aquí..."
              rows="5"
            ></textarea>
          </div>

          <div class="botones-fila-edit">
            <button type="button" class="btn-fila btn-cancelar" @click="cancelarEdicion">
              Cancelar
            </button>
            <button type="submit" class="btn-fila btn-guardar">
              <i class="fas fa-save"></i> Guardar
            </button>
          </div>
        </form>
      </Transition>
    </div>

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
            <button class="btn-modal btn-cancelar-modal" @click="cancelarEliminacion">
              No, Cancelar
            </button>
            <button class="btn-modal btn-confirmar-modal" @click="confirmarEliminacion">
              Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const props = defineProps({
  aviso: {
    type: Object,
    required: true
  },
  showControls: {
    type: Boolean,
    default: false 
  }
});

const emit = defineEmits(['guardar-aviso', 'eliminar-aviso']);

const modoEdicion = ref(false);
const avisoEditable = ref(null);
const mostrarModalConfirmacion = ref(false);

const activarModoEdicion = () => {
  // Clonamos el objeto para no modificar la prop directamente mientras editamos
  avisoEditable.value = JSON.parse(JSON.stringify(props.aviso));
  modoEdicion.value = true;
};

// --- AQUÍ ESTÁ EL CAMBIO PRINCIPAL ---
const guardarCambios = () => {
  if (!avisoEditable.value.descripcion.trim()) {
    console.warn('La descripción no puede estar vacía.'); 
    return;
  }

  // ELIMINADO: const now = new Date();
  // ELIMINADO: const fecha = ...
  // ELIMINADO: const hora = ...

  const avisoActualizado = {
    ...avisoEditable.value,
    descripcion: avisoEditable.value.descripcion.trim(),
    // Ya no enviamos fecha ni hora manual, la API se encarga o 
    // se mantienen las viejas si es una edición.
    _isNew: props.aviso._isNew 
  };
  
  emit('guardar-aviso', avisoActualizado);
  modoEdicion.value = false;
};
// -------------------------------------

const cancelarEdicion = () => {
  if (props.aviso._isNew) {
    emit('eliminar-aviso', props.aviso);
  }
  modoEdicion.value = false;
};

// --- Lógica del Modal (local al componente) ---
const mostrarConfirmacionEliminar = () => {
  mostrarModalConfirmacion.value = true;
};

const cancelarEliminacion = () => {
  mostrarModalConfirmacion.value = false;
};

const confirmarEliminacion = () => {
  mostrarModalConfirmacion.value = false;
  emit('eliminar-aviso', props.aviso);
};

watchEffect(() => {
  if (props.aviso._isNew) {
    activarModoEdicion();
  }
});
</script>

<style scoped>
/* --- ESTILOS PROFESIONALES PARA LA TARJETA --- */
.aviso-card {
  display: flex;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  border-left: 6px solid #e50914; 
  overflow: hidden;
  transition: box-shadow 0.3s ease-in-out;
  cursor: default;
}

.aviso-card:hover:not(.modo-edicion) {
  box-shadow: 0 6px 20px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05);
}

.aviso-card.modo-edicion {
  border-color: #007bff; 
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.15), 0 0 0 1px rgba(0, 123, 255, 0.1); 
}

.aviso-wrapper {
  width: 100%;
}

/* --- MODO VISTA (Rediseñado con Flexbox) --- */
.vista-container {
  display: flex;
  width: 100%;
  align-items: stretch;
}

/* 1. Columna de Fecha */
.fecha-columna {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 1.5rem 1.25rem;
  border-right: 1px solid #e9ecef;
  text-align: center;
  flex-shrink: 0; 
  min-width: 120px;
}
.fecha-columna i {
  font-size: 1.5rem;
  color: #e50914; 
  margin-bottom: 0.75rem;
}
.fecha-columna .fecha {
  font-size: 1rem;
  font-weight: 700;
  color: #343a40;
  line-height: 1.3;
}
.fecha-columna .hora {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

/* 2. Columna de Contenido */
.contenido-columna {
  display: flex;
  flex-direction: column;
  flex-grow: 1; 
  padding: 1.25rem 1.75rem;
  min-width: 0; 
}

.aviso-header {
  display: flex;
  align-items: center;
  gap: 0.75rem; 
  margin-bottom: 0.75rem;
}
.aviso-header i {
  color: #e50914; 
  font-size: 1.25rem; 
}
.aviso-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
}

.aviso-body p {
  font-size: 1.05rem; 
  color: #495057; 
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap; 
  font-weight: 400; 
  word-wrap: break-word; 
}

.aviso-actions {
  display: flex;
  flex-direction: row; 
  gap: 0.75rem;
  margin-top: 1.25rem; 
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0; 
  justify-content: flex-end; 
}

/* --- MODO EDICIÓN (Formulario) --- */
.form-edicion {
  padding: 1.75rem;
  background: #fdfdfd;
  width: 100%;
}

.info-item-edit {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.info-item-edit label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}
.input-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: border-color 0.2s, box-shadow 0.2s;
  resize: vertical;
  min-height: 120px;
}
.input-textarea:focus {
  outline: none;
  border-color: #007bff; 
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15); 
}

.botones-fila-edit {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

/* --- Botones Comunes --- */
.btn-fila {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 20px; 
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap; 
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.btn-fila:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

/* --- Botones Específicos MODO EDICIÓN (Sólidos) --- */
.btn-cancelar { background: #6c757d; color: white; } 
.btn-cancelar:hover { background: #5a6268; }

.btn-guardar { background: #28a745; color: white; } 
.btn-guardar:hover { background: #218838; }

/* --- Botones Específicos MODO VISTA (Sutiles) --- */
.aviso-actions .btn-fila {
  padding: 0.4rem 1rem;
  background: transparent;
  border-width: 1px;
  border-style: solid;
  box-shadow: none;
}
.aviso-actions .btn-fila:hover {
  transform: translateY(0); 
  box-shadow: none;
}

.aviso-actions .btn-modificar {
  color: #007bff;
  border-color: #007bff;
  background: rgba(0, 123, 255, 0.05);
}
.aviso-actions .btn-modificar:hover {
  background: rgba(0, 123, 255, 0.1);
  color: #0056b3;
}

.aviso-actions .btn-eliminar {
  color: #dc3545;
  border-color: #dc3545;
  background: rgba(220, 53, 69, 0.05);
}
.aviso-actions .btn-eliminar:hover {
  background: rgba(220, 53, 69, 0.1);
  color: #a71d2a;
}


/* Animación de entrada/salida de vistas (Edición/Lectura) */
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from,
.slide-fade-leave-to { transform: translateY(10px); opacity: 0; }

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .vista-container {
    flex-direction: column; 
  }
  
  .fecha-columna {
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.75rem;
    min-width: 100%;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
    padding: 0.75rem 1rem;
  }
  .fecha-columna i {
    margin-bottom: 0;
    font-size: 1.1rem;
  }
  .fecha-columna .fecha { font-size: 0.9rem; }
  .fecha-columna .hora { font-size: 0.9rem; }

  .contenido-columna {
    padding: 1rem 1.25rem;
  }

  .aviso-actions {
    justify-content: center;
  }
  .aviso-actions .btn-fila {
    flex-grow: 1;
    justify-content: center;
  }

  .form-edicion {
    padding: 1.25rem;
  }
}

</style>