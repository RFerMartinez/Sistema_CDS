<template>
  <div
    class="estado"
    :class="positivo ? 'positivo' : 'negativo'"
  >
    {{ texto }}
  </div>
</template>

<script setup>
defineProps({
  positivo: Boolean,
  texto: String
})
</script>

<style scoped>
.estado {
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  text-align: center;
  font-size: 0.8rem;
  white-space: nowrap;
  display: inline-block;
  margin: 0 auto;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: 1px solid transparent;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

.positivo {
  background-color: #10b981;
  color: white;
  border-color: #059669;
  box-shadow: 0 1px 2px rgba(16, 185, 129, 0.15);
}

.positivo:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.negativo {
  background-color: #ef4444;
  color: white;
  border-color: #dc2626;
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.15);
}

.negativo:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

/* Versión móvil más simple */
@media (max-width: 768px) {
  .estado {
    padding: 5px 10px;
    font-size: 0.75rem;
    border-radius: 4px;
  }
  
  .positivo:hover,
  .negativo:hover {
    transform: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}
</style>