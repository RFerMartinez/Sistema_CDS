<template>
  <div class="tech-card">
    <div class="card-border"></div>
    
    <div class="card-header">
      <h3 class="title">{{ metodo.nombreTrabajo }}</h3>
      <span class="index-number">{{ formattedIndex }}</span>
    </div>

    <div class="accent-separator"></div>

    <div class="card-body">
      <p class="description">{{ metodo.descripcion }}</p>
    </div>

    <div class="card-footer">
      <div class="tech-specs">
        <span>MOD // {{ formattedIndex }}</span>
        <span>STATUS: ACTIVE</span>
      </div>
      <div class="interactive-icon">
        <i class="fas fa-dumbbell icon"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  metodo: Object,
  index: Number
})

const formattedIndex = computed(() => {
  return props.index ? props.index.toString().padStart(2, '0') : '00';
});
</script>

<style scoped>
.tech-card {
  background-color: #0c0c0c;
  border: 1px solid #1f1f1f;
  min-height: 350px; 
  padding: 35px;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
}

/* ==========================================================================
   AQUÍ ESTÁ LA MAGIA: Agregamos .active-mobile a los selectores
   ========================================================================== */

/* Efecto Hover en PC O Scroll Activo en Móvil */
.tech-card:hover,
.tech-card.active-mobile {
  transform: translateY(-8px);
  border-color: #444; /* Borde gris claro al activarse */
  box-shadow: 0 15px 30px rgba(0,0,0,0.4);
  background-color: #111;
}

/* El separador se expande y se pone rojo */
.tech-card:hover .accent-separator,
.tech-card.active-mobile .accent-separator {
  width: 100%;
  background-color: #e50914;
}

/* El icono se mueve y se pone rojo */
.tech-card:hover .interactive-icon,
.tech-card.active-mobile .interactive-icon {
  color: #e50914;
  transform: translateX(5px);
}

/* Estilos base */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  margin: 0;
  max-width: 70%;
  line-height: 1.1;
}

.index-number {
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  opacity: 0.1;
  line-height: 0.8;
  font-family: 'Poppins', sans-serif;
}

.accent-separator {
  width: 40px;
  height: 2px;
  background-color: #333;
  margin-bottom: 25px;
  transition: all 0.5s ease;
}

.card-body {
  flex-grow: 1;
}

.description {
  color: #999;
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
  text-align: left;
}

.card-footer {
  margin-top: 30px;
  border-top: 1px solid #222;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tech-specs {
  display: flex;
  gap: 15px;
  font-family: monospace;
  font-size: 0.75rem;
  color: #555;
  letter-spacing: 1px;
}

.interactive-icon {
  color: #444;
  font-size: 1.2rem;
  transition: transform 0.3s ease, color 0.3s ease;
}
</style>