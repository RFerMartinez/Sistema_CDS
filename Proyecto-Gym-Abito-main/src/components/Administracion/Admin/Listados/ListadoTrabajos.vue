<template>
  <div class="opciones-grid">
    <div v-if="cargando" class="mensaje-estado">Cargando metodologías...</div>
    <div v-else-if="errorCarga" class="mensaje-estado error">{{ errorCarga }}</div>

    <div v-else v-for="metodologia in metodologias" :key="metodologia.nombreTrabajo"
         class="opcion-trabajo"
         :class="{ 'seleccionada': modelValue === metodologia.nombreTrabajo }"
         @click="seleccionar(metodologia.nombreTrabajo)">
      <div class="opcion-contenido">
        <h4 class="opcion-titulo">{{ metodologia.nombreTrabajo }}</h4>
        </div>
      <i class="fas fa-check opcion-check" v-if="modelValue === metodologia.nombreTrabajo"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { obtenerTrabajos } from '@/api/services/trabajoService';

const props = defineProps({
  modelValue: String // Para usar con v-model (recibe el nombre seleccionado)
});

const emit = defineEmits(['update:modelValue']); // Para v-model

const metodologias = ref([]);
const cargando = ref(true);
const errorCarga = ref(null);

// Cargar metodologías desde JSON al montar
const cargarMetodologias = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    // *** ¡ASEGÚRATE QUE ESTA RUTA SEA CORRECTA! ***
    const res = await obtenerTrabajos();
    metodologias.value = res;
  } catch (error) {
    console.error('Error cargando metodologias.json:', error);
    errorCarga.value = 'No se pudieron cargar las metodologías.';
  } finally {
    cargando.value = false;
  }
};

onMounted(cargarMetodologias);

// Emitir el valor seleccionado al padre
const seleccionar = (nombre) => {
  emit('update:modelValue', nombre);
};
</script>

<style scoped>
/* Estilos específicos copiados de ModificarSusTrabAlumno.vue */
.opciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.opcion-trabajo { /* Mantenemos el nombre original */
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
  border-color: #FF9800;
  transform: translateY(-2px);
}

.opcion-trabajo.seleccionada {
  border-color: #FF9800;
  background: #FFF3E0;
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

/* No hay .opcion-precio aquí */

.opcion-check {
  color: #FF9800;
  font-size: 1.2rem;
  margin-left: 1rem;
}

.mensaje-estado {
  grid-column: 1 / -1;
  text-align: center;
  padding: 1rem;
  color: #666;
  font-style: italic;
}
.mensaje-estado.error {
  color: #f44336;
  font-weight: bold;
}
</style>