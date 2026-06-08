<template>
  <div class="formulario-item">
    <h3 class="titulo-formulario">
      {{ esEdicion ? 'Editar' : 'Nueva' }} {{ config.tituloSingular }}
    </h3>

    <div class="campos-formulario" :class="{ 'stacked': config.layout === 'stacked' }">

      <!-- Campo 1 (sin cambios) -->
      <div class="campo">
        <label :for="config.campo1.key">{{ config.campo1.label }}</label>
        <div v-if="esContextoSuscripciones && esEdicion" class="readonly-text-display">
          {{ itemLocal[config.campo1.key] }}
        </div>
        <template v-else>
          <input
            v-if="!config.campo1.esTextarea"
            :id="config.campo1.key"
            v-model="itemLocal[config.campo1.key]"
            :type="config.campo1.tipoInput || 'text'"
            :min="config.campo1.min"
            :placeholder="config.campo1.placeholder"
            class="input-text"
            :class="{ 'input-dias': esContextoSuscripciones && !esEdicion }" 
            :readonly="config.campo1.readonly || false"
            :step="config.campo1.tipoInput === 'number' ? '1' : undefined"
          >
          <textarea
            v-else
            :id="config.campo1.key"
            v-model="itemLocal[config.campo1.key]"
            :placeholder="config.campo1.placeholder"
            class="input-textarea"
            rows="4"
            :readonly="config.campo1.readonly || false"
          ></textarea>
        </template>
      </div>

      <!-- Campo 2 (sin cambios) -->
      <div class="campo">
        <label :for="config.campo2.key">{{ config.campo2.label }}</label>
        <input
          v-if="!config.campo2.esTextarea"
          :id="config.campo2.key"
          v-model="itemLocal[config.campo2.key]"
          :type="config.campo2.tipoInput || 'text'"
          :min="config.campo2.min"
          :placeholder="config.campo2.placeholder"
          class="input-text"
          :readonly="config.campo2.readonly || false"
          :step="config.campo2.tipoInput === 'number' ? 'any' : undefined"
        >
        <textarea
          v-else
          :id="config.campo2.key"
          v-model="itemLocal[config.campo2.key]"
          :placeholder="config.campo2.placeholder"
          class="input-textarea"
          rows="4"
          :readonly="config.campo2.readonly || false"
        ></textarea>
      </div>

    </div>

    <div class="botones-formulario">
      <!-- MODIFICADO: @click ahora llama a "intentarGuardar" -->
      <button class="btn btn-guardar" @click="intentarGuardar">
        <i class="fas fa-save"></i>
        {{ esEdicion ? 'Actualizar' : 'Guardar' }}
      </button>
      <button class="btn btn-cancelar" @click="$emit('cancelar')">
        <i class="fas fa-times"></i>
        Cancelar
      </button>
    </div>
  </div>

  <!-- ========= V V V MODAL DE CONFIRMACIÓN AÑADIDO V V V ========= -->
  <Transition name="modal-fade">
    <div v-if="mostrarConfirmacion" class="modal-overlay">
      <div class="modal-confirmacion"> <!-- <-- Clase global -->
        <div class="modal-header">
          <i class="fas fa-exclamation-triangle"></i>
          <!-- El título es dinámico -->
          <h3>{{ esEdicion ? 'Confirmar Edición' : 'Confirmar Creación' }}</h3>
        </div>
        <div class="modal-body">
          <!-- El mensaje es dinámico -->
          <p>{{ mensajeConfirmacion }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-modal btn-cancelar-modal" @click="cancelarConfirmacion">
            Cancelar
          </button>
          <button class="btn-modal btn-confirmar-modal" @click="confirmarGuardar">
            Sí, Guardar
          </button>
        </div>
      </div>
    </div>
  </Transition>
  <!-- ========= ^ ^ ^ FIN MODAL DE CONFIRMACIÓN ^ ^ ^ ========= -->

</template>

<script setup>
import { computed, ref } from 'vue'; // <-- AÑADIDO 'ref'

const props = defineProps({
  modelValue: { type: Object, required: true },
  esEdicion: { type: Boolean, default: false },
  config: { type: Object, required: true }
});

const emit = defineEmits(['update:modelValue', 'guardar', 'cancelar']);

// Computed para v-model
const itemLocal = computed({
  get: () => props.modelValue,
  set: (value) => { emit('update:modelValue', value); }
});

const esContextoSuscripciones = computed(() => props.config.contexto === 'suscripciones');

// --- INICIO: LÓGICA DEL MODAL DE CONFIRMACIÓN ---

const mostrarConfirmacion = ref(false);

/**
 * Crea el mensaje dinámico para el modal de confirmación.
 */
const mensajeConfirmacion = computed(() => {
  // Determina el "sujeto" (Suscripción o Metodología)
  const esSuscripcion = props.config.contexto === 'suscripciones';
  const tipoItem = esSuscripcion ? 'suscripción' : 'metodología';
  
  if (props.esEdicion) {
    return `¿Estás seguro que deseas guardar los cambios en la ${tipoItem}?`;
  } else {
    return `¿Estás seguro que deseas crear la nueva ${tipoItem}?`;
  }
});

/**
 * (1) Se llama al hacer clic en el botón "Guardar" / "Actualizar".
 * Solo muestra el modal.
 */
const intentarGuardar = () => {
  // Aquí puedes añadir validaciones básicas si quieres (ej. que no esté vacío)
  // if (!itemLocal.value[props.config.campo1.key] || !itemLocal.value[props.config.campo2.key]) {
  //   alert('Por favor, complete todos los campos.');
  //   return;
  // }
  
  // Muestra el modal de confirmación
  mostrarConfirmacion.value = true;
};

/**
 * (2) Se llama al hacer clic en "Cancelar" DENTRO del modal.
 */
const cancelarConfirmacion = () => {
  mostrarConfirmacion.value = false;
};

/**
 * (3) Se llama al hacer clic en "Sí, Guardar" DENTRO del modal.
 * Esta era tu función 'emitirGuardar' original.
 */
const confirmarGuardar = () => {
  mostrarConfirmacion.value = false;
  emit('guardar', itemLocal.value); 
};
// --- FIN: LÓGICA DEL MODAL ---

</script>

<style scoped>
/* --- ESTILOS INDENTADOS Y CON COLORES MODIFICADOS --- */

.formulario-item {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.titulo-formulario {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.campos-formulario {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Layout 'inline' por defecto */
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  align-items: start;
}

/* Layout 'stacked' */
.campos-formulario.stacked {
  grid-template-columns: 1fr;
}

/* Layout 'auto 1fr' para "Agregar Suscripción" */
.campos-formulario:not(.stacked) .campo:has(.input-dias) {
  grid-column: 1 / 2;
}
.campos-formulario:not(.stacked) .campo:has(.input-dias) + .campo {
  grid-column: 2 / 3;
}
.campos-formulario:not(.stacked):has(.campo .input-dias) {
  grid-template-columns: auto 1fr;
}

/* Campos del formulario */
.campo {
  display: flex;
  flex-direction: column;
}

.campo label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
  font-size: 0.95rem;
}

.input-text,
.input-textarea,
.readonly-text-display {
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  box-sizing: border-box;
}

.input-text:focus,
.input-textarea:focus {
  outline: none;
  border-color: #e91e63; /* Color de foco (rosa/rojo) */
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
}

.input-textarea {
  resize: vertical;
  min-height: 100px;
}

.readonly-text-display {
  background-color: #f8f9fa;
  color: #495057;
  border-color: #e0e0e0;
  min-height: calc(0.8rem * 2 + 1rem + 4px);
  display: flex;
  align-items: center;
  cursor: default;
}

.input-text.input-dias {
  max-width: 150px;
}

/* --- Botones del Formulario --- */
.botones-formulario {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Botón Guardar (MODIFICADO al rojo del tema) */
.btn-guardar {
  background: #e50914; /* Rojo del logo */
  color: white;
  box-shadow: 0 2px 8px rgba(229, 9, 20, 0.3); /* Sombra roja */
}
.btn-guardar:hover {
  background: #d32f2f; /* Rojo más oscuro (consistente con eliminar) */
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
}

/* Botón Cancelar (MODIFICADO a gris profesional) */
.btn-cancelar {
  background: #6c757d; /* Gris profesional */
  color: white;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}
.btn-cancelar:hover {
  background: #5a6268; /* Gris más oscuro */
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .campos-formulario,
  .campos-formulario:not(.stacked):has(.campo .input-dias) {
    grid-template-columns: 1fr; /* Siempre apilado */
  }

  .botones-formulario {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .input-text.input-dias {
    max-width: 100%; /* Ancho completo en móvil */
  }
}
</style>