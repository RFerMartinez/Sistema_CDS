<template>
  <button
    class="boton"
    :class="claseBoton"
    @click="manejarClick"
  >
    {{ textoBoton }}
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pagada: Boolean,
  modo: {
    type: String,
    default: 'cuota' // 'cuota' o 'infoAlumno'
  }
})

const emit = defineEmits(['accion-click'])

// 🎯 Texto del botón según modo y estado
const textoBoton = computed(() => {
  if (props.modo === 'cuota') {
    return props.pagada ? 'Ver Comprobante' : 'PAGAR'
  } else {
    return props.pagada ? 'Ver Comprobante' : 'Marcar Pagada'
  }
})

// 🎯 Clase del botón según modo y estado
const claseBoton = computed(() => {
  if (props.pagada) {
    return 'descargar'
  }
  return props.modo === 'cuota' ? 'pagar' : 'marcar-pagada'
})

function manejarClick() {
  emit('accion-click')
}
</script>

<style scoped>
.boton {
  padding: 8px 12px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
  white-space: nowrap;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 auto;
  width: fit-content;
}

.boton:hover {
  transform: scale(1.05);
}

.pagar {
  background: white;
  border: 1px solid #000;
}

.marcar-pagada {
  background: white;
  border: 1px solid #000;
}

.descargar {
  background: #f0f0f0;
  color: #000;
}

@media (max-width: 768px) {
  .boton {
    padding: 10px 14px;
    font-size: 0.95rem;
    min-height: 42px;
    min-width: 120px;
  }
}
</style>