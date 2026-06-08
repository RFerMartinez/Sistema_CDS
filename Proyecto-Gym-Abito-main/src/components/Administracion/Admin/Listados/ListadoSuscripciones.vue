<template>
  <div class="opciones-grid">
    <div v-if="cargando" class="mensaje-estado">Cargando suscripciones...</div>
    <div v-else-if="errorCarga" class="mensaje-estado error">{{ errorCarga }}</div>

    <div v-else v-for="precio in precios" :key="precio.nombreSuscripcion"
         class="opcion-suscripcion"
         :class="{ 'seleccionada': modelValue === precio.nombreSuscripcion }"
         @click="seleccionar(precio.nombreSuscripcion)">
      <div class="opcion-contenido">
        <h4 class="opcion-titulo">{{ precio.nombreSuscripcion }}</h4>
        <p class="opcion-precio">{{ formatCurrency(precio.precio) }}</p>
      </div>
      <i class="fas fa-check opcion-check" v-if="modelValue === precio.nombreSuscripcion"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatCurrency } from '@/utils/formatters';

import { obtenerSuscripciones } from '@/api/services/suscripcionesService';

const props = defineProps({
  modelValue: String // Para usar con v-model (recibe la descripción seleccionada)
});

const emit = defineEmits(['update:modelValue']); // Para v-model

const precios = ref([]);
const cargando = ref(true);
const errorCarga = ref(null);

// Cargar precios desde JSON al montar
const cargarPrecios = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    const res = await obtenerSuscripciones();
    precios.value = res
  } catch (error) {
    console.error('Error cargando precios.json:', error);
    errorCarga.value = 'No se pudieron cargar las suscripciones.';
  } finally {
    cargando.value = false;
  }
};

onMounted(cargarPrecios);

// Emitir el valor seleccionado al padre
const seleccionar = (descripcion) => {
  emit('update:modelValue', descripcion);
};
</script>

<style scoped>
/* Estilos específicos copiados de ModificarSusTrabAlumno.vue */
.opciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.opcion-suscripcion { /* Cambiado de .opcion-trabajo a .opcion-suscripcion */
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

.opcion-suscripcion:hover {
  border-color: #FF9800; /* Color original del componente padre */
  transform: translateY(-2px);
}

.opcion-suscripcion.seleccionada {
  border-color: #FF9800;
  background: #FFF3E0; /* Color original del componente padre */
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

.opcion-precio {
  font-size: 1.2rem;
  font-weight: 700;
  color: #FF9800; /* Color original del componente padre */
  margin: 0;
  margin-top: 0.5rem;
}

.opcion-check {
  color: #FF9800; /* Color original del componente padre */
  font-size: 1.2rem;
  margin-left: 1rem;
}

.mensaje-estado {
  grid-column: 1 / -1; /* Ocupa toda la fila */
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