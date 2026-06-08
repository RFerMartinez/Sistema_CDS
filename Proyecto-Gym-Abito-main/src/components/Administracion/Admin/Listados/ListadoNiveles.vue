<template>
  <div class="opciones-grid">
    <div v-for="nivel in niveles" :key="nivel"
         class="opcion-trabajo" :class="{ 'seleccionada': modelValue === nivel }"
         @click="seleccionar(nivel)">
      <div class="opcion-contenido">
        <h4 class="opcion-titulo">Nivel {{ nivel }}</h4>
      </div>
      <i class="fas fa-check opcion-check" v-if="modelValue === nivel"></i>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: String // Para usar con v-model (recibe el nivel seleccionado como string)
});

const emit = defineEmits(['update:modelValue']); // Para v-model

// Generar los niveles como strings del "1" al "10"
const niveles = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])

// Emitir el valor seleccionado al padre
const seleccionar = (nivelSeleccionado) => {
  emit('update:modelValue', nivelSeleccionado);
};
</script>

<style scoped>
/* Estilos copiados de ListadoTrabajos.vue para consistencia */
.opciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.opcion-trabajo { 
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.opcion-trabajo:hover {
  border-color: #FF9800; /* Color naranja del componente padre */
  transform: translateY(-2px);
}

.opcion-trabajo.seleccionada {
  border-color: #FF9800; /* Color naranja */
  background: #FFF3E0;    /* Fondo naranja claro */
  transform: scale(1.02);
}

.opcion-contenido {
  flex: 1;
}

.opcion-titulo {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.opcion-check {
  color: #FF9800; /* Color naranja */
  font-size: 1.2rem;
  margin-left: 1rem;
}

/* No se necesitan mensajes de carga/error aquí */
</style>