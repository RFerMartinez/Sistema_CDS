<template>
  <div class="lista-items">
    <div v-if="items.length === 0" class="sin-items">
      <i :class="emptyIcon" class="fa-2x"></i>
      <p>{{ emptyMessage }}</p>
    </div>

    <transition-group v-else name="list" tag="div" class="tarjetas-items">
      <div
        v-for="item in items"
        :key="item.id"
        class="tarjeta-item"
      >
        <div class="contenido-tarjeta">
          <div class="info-item">
            <h3 class="item-titulo">{{ item[config.key1] }}</h3>

            <p
              v-if="config.showKey2"
              class="item-detalle"
              :class="config.styleKey2"
            >
              {{ getCampo2Valor(item) }}
            </p>

          </div>

          <div class="acciones-tarjeta">
            <button
              class="btn-accion btn-editar"
              title="Editar"
              @click="$emit('editar', item)"
            >
              <i class="fas fa-edit"></i>
            </button>

            <button
              class="btn-accion btn-eliminar"
              title="Eliminar"
              @click="$emit('eliminar', item.id)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { formatCurrency } from '@/utils/formatters'; // <-- IMPORTA LA FUNCIÓN (Ajusta la ruta si es necesario)

const props = defineProps({
  items: { type: Array, required: true },
  config: { type: Object, required: true },
  emptyMessage: { type: String, default: 'No hay items cargados' },
  emptyIcon: { type: String, default: 'fas fa-info-circle' }
});

defineEmits(['editar', 'eliminar']);

// --- formatPrice ELIMINADO ---
// const formatPrice = (value) => { ... }; // Ya no es necesario aquí

// Computed para obtener y formatear (si aplica) el valor del campo 2
const getCampo2Valor = (item) => {
    const valor = item[props.config.key2];
    // Formatea solo si es contexto suscripciones Y la config lo pide Y el valor existe
    if (props.config.contexto === 'suscripciones' && props.config.formatoPrecio && valor !== undefined && valor !== null) {
        // --- USA LA FUNCIÓN IMPORTADA ---
        return formatCurrency(valor);
        // ---------------------------------
    }
    return valor;
};
</script>

<style scoped>
/* Estilos combinados y limpios de .lista-suscripciones y .lista-trabajos */
.lista-items {
  margin-top: 2rem;
}

.sin-items {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.sin-items i {
  margin-bottom: 1rem;
  color: #adb5bd;
  font-size: 3rem;
  opacity: 0.7;
}

/* Animaciones para las tarjetas */
.list-enter-active {
  transition: all 0.4s ease;
}
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.list-move {
  transition: transform 0.4s ease;
}

.tarjetas-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.tarjeta-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  overflow: hidden;
}

.tarjeta-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.contenido-tarjeta {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item {
  flex: 1;
}

/* Estilo para el título (Descripción en Suscripciones, Nombre en Metodologías) */
.item-titulo {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 1.4;
}

/* Estilo base para el detalle (usado por .precio) */
.item-detalle {
  margin: 0;
}

/* Estilo específico para el precio en Suscripciones */
.item-detalle.precio {
  font-size: 1.4rem;
  color: #e50914; /* MODIFICADO: Rojo del logo */
  font-weight: 700;
}

/* Estilo para la descripción en Metodologías (si decidieras mostrarla) */
.item-detalle.descripcion {
  color: #666;
  line-height: 1.5;
  font-size: 1rem;
  font-weight: 400;
}


.acciones-tarjeta {
  display: flex;
  gap: 0.5rem;
}

.btn-accion {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-editar {
  background: #FF9800;
  color: white;
  box-shadow: 0 2px 6px rgba(255, 152, 0, 0.3);
}

.btn-editar:hover {
  background: #F57C00;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(255, 152, 0, 0.4);
}

.btn-eliminar {
  background: #D32F2F;
  color: white;
  box-shadow: 0 2px 6px rgba(211, 47, 47, 0.3);
}

.btn-eliminar:hover {
  background: #C62828;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(211, 47, 47, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .tarjetas-items {
    grid-template-columns: 1fr;
  }
  
  .contenido-tarjeta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .acciones-tarjeta {
    align-self: stretch;
    justify-content: center;
  }
}
</style>