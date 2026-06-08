<template>
  <div class="lista-reclamos-container" :class="{ 'mobile': isMobile }">
    <table v-if="!isMobile" class="tabla-reclamos">
      <thead>
        <tr>
          <th>Nro observación</th>
          <th>Fecha y Hora</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="reclamos.length === 0">
          <td colspan="3" class="no-reclamos">
            Aún no has realizado ningún reclamo.
          </td>
        </tr>
        <tr v-for="reclamo in reclamos" :key="reclamo.idReclamo" class="fila-reclamo">
          <td class="numero">#{{ reclamo.idReclamo }}</td>
          <td class="fecha-hora">
            {{ formatReclamoDateTime(reclamo.fecha, reclamo.hora).fecha }}<br>
            <span class="hora">{{ formatReclamoDateTime(reclamo.fecha, reclamo.hora).hora }}</span>
          </td>
          <td class="descripcion">{{ reclamo.comentario || 'Sin descripción' }}</td>
        </tr>
      </tbody>
    </table>
    
    <div v-else class="mobile-view">
      <div v-if="reclamos.length === 0" class="no-reclamos-mobile">
        Aún no has realizado ningúna observación.
      </div>
      <div 
        v-for="reclamo in reclamos" 
        :key="reclamo.idReclamo" 
        class="reclamo-card"
        :class="{ 'expandida': reclamoExpandido === reclamo.idReclamo }"
      >
        <div class="card-header" @click="toggleExpandido(reclamo.idReclamo)">
          <div class="info-principal">
            <span class="numero">#{{ reclamo.idReclamo }}</span>
            <div class="fecha-hora">
              <span class="fecha">{{ formatReclamoDateTime(reclamo.fecha, reclamo.hora).fecha }}</span>
              <span class="hora">{{ formatReclamoDateTime(reclamo.fecha, reclamo.hora).hora }}</span>
            </div>
          </div>
          
          <div class="expand-icon">
            <i :class="reclamoExpandido === reclamo.idReclamo ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </div>
        </div>
        
        <transition name="slide">
          <div v-if="reclamoExpandido === reclamo.idReclamo" class="card-details">
            <div class="detalle-descripcion">
              <h4>Descripción:</h4>
              <p>{{ reclamo.comentario || 'Sin descripción' }}</p>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>


// Ferchu
import { defineProps } from 'vue';
// import { formatDateTimeNative } from '@/utils/formatters';
import { formatReclamoDateTime } from '@/utils/formatters';
const props = defineProps({
  reclamos: {
    type: Array,
    required: true,
  },
});


import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)
const reclamoExpandido = ref(null)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const toggleExpandido = (id) => {
  reclamoExpandido.value = reclamoExpandido.value === id ? null : id
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<style scoped>
.lista-reclamos-container {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  overflow-x: auto;
}

/* ESTILOS PARA PC - MEJORADOS */
.tabla-reclamos {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Poppins', sans-serif;
  table-layout: fixed; /* Ayuda a una distribución más prolija */
}

thead {
  background-color: #f8f9fa; /* Gris más sutil y minimalista */
  border-bottom: 2px solid #edf2f7;
}

th {
  text-align: left;
  vertical-align: middle;
  font-weight: 600;
  padding: 1rem;
  color: #4a5568; /* Color de texto más suave */
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Ajuste de anchos para mejor visualización en PC */
th:nth-child(1) { width: 15%; }
th:nth-child(2) { width: 25%; }
th:nth-child(3) { width: 60%; }

.fila-reclamo {
  transition: background-color 0.2s ease;
}

.fila-reclamo:hover {
  background-color: #fcfcfc;
}

.fila-reclamo:not(:last-child) {
  border-bottom: 1px solid #edf2f7;
}

td {
  vertical-align: middle; /* Alineación vertical corregida */
  color: #2d3748;
  padding: 1.2rem 1rem;
  font-size: 0.95rem;
}

.numero {
  font-weight: 700;
  color: #334155;
  display: flex;
  align-items: center; /* Asegura alineación interna */
}

.fecha-hora {
  font-weight: 500;
  line-height: 1.2;
}

.hora {
  color: #718096;
  font-size: 0.85rem;
  display: block;
  margin-top: 2px;
}

.descripcion {
  line-height: 1.5;
  color: #4a5568;
  word-wrap: break-word;
}

.no-reclamos {
  text-align: center;
  padding: 3rem;
  color: #a0aec0;
  font-style: italic;
}

/* ESTILOS PARA MÓVIL - SIN CAMBIOS ESTÉTICOS SEGÚN SOLICITUD */
.mobile-view {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.reclamo-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  background: #f8f9fa;
}

.info-principal {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.mobile-view .numero {
  font-weight: 600;
  color: #334155;
  font-size: 1.1rem;
}

.mobile-view .fecha-hora {
  display: flex;
  gap: 0.8rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.fecha, .hora {
  font-weight: 500;
}

.expand-icon {
  color: #6c757d;
  transition: transform 0.3s ease;
}

.reclamo-card.expandida .expand-icon {
  transform: rotate(180deg);
}

/* Animaciones */
.slide-enter-active {
  animation: slideDown 0.3s ease-out;
}

.slide-leave-active {
  animation: slideUp 0.25s ease-in;
}

@keyframes slideDown {
  from { max-height: 0; opacity: 0; }
  to { max-height: 200px; opacity: 1; }
}

@keyframes slideUp {
  from { max-height: 200px; opacity: 1; }
  to { max-height: 0; opacity: 0; }
}

.card-details {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.detalle-descripcion h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 600;
}

.detalle-descripcion p {
  margin: 0;
  color: #495057;
  line-height: 1.5;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 480px) {
  .lista-reclamos-container {
    padding: 0.8rem;
  }
  .card-header {
    padding: 0.8rem;
  }
  .mobile-view .numero {
    font-size: 1rem;
  }
  .mobile-view .fecha-hora {
    font-size: 0.85rem;
    gap: 0.5rem;
  }
  .card-details {
    padding: 0.8rem;
  }
  .detalle-descripcion h4 {
    font-size: 0.85rem;
  }
  .detalle-descripcion p {
    font-size: 0.85rem;
  }
}
</style>