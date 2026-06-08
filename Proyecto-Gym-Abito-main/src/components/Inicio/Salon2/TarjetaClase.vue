<template>
  <div class="clase-card horizontal-card slide-from-right">
    <div class="card-image" :style="{ '--bg-img': `url(${imagen})` }">
      <div class="class-badge">{{ badge }}</div>
    </div>
    
    <div class="card-content">
      <h3 class="clase-title">{{ titulo }}</h3>
      
      <div class="metrics-bar">
        <div class="metric-item">
          <i class="fas fa-fire"></i>
          <div class="metric-text-group">
            <span class="metric-label">Intensidad</span>
            <span class="metric-value">{{ intensidad }}</span>
          </div>
        </div>
        <div class="metric-item">
          <i class="fas fa-calendar-alt"></i>
          <div class="metric-text-group">
            <span class="metric-label">Días</span>
            <span class="metric-value">{{ dias }}</span>
          </div>
        </div>
        <div class="metric-item full-width-mobile">
          <i class="fas fa-clock"></i>
          <div class="metric-text-group">
            <span class="metric-label">Horario</span>
            <span class="metric-value">{{ horarios }}</span>
          </div>
        </div>
      </div>

      <p class="clase-desc" v-html="descripcion"></p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  titulo: String,
  intensidad: String,
  dias: String,
  horarios: String,
  descripcion: String,
  imagen: String,
  badge: String
})
</script>

<style scoped>
/* =========================================
   ESTILOS DE LA TARJETA EN PC (BASE)
   ========================================= */
.horizontal-card {
  display: flex;
  background: #111;
  border: 2px solid rgba(255, 255, 255, 0.1); 
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0,0,0,0.4);
  min-height: 380px;
  
  /* --- SOLUCIÓN PARA EL ERROR DE ANIMACIÓN --- */
  backface-visibility: hidden; 
  -webkit-backface-visibility: hidden;
  will-change: transform, opacity;
  transform: translateZ(0); /* Fuerza aceleración 3D limpia */
  /* ------------------------------------------- */

  transition: opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), 
              transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1),
              box-shadow 0.4s ease, border-color 0.4s ease;
}

.card-image {
  flex: 0 0 45%;
  position: relative;
  /* Ajustamos el degradado para que el color sólido (#111) 
     tenga más "fuerza" y cubra cualquier borde fantasma */
  background-image: linear-gradient(to right, rgba(0,0,0,0) 0%, #111 95%), var(--bg-img);
  background-size: cover;
  background-position: center;
  background-color: #111; /* Color de respaldo idéntico al fondo */
}

/* EFECTO HOVER (SOLO EN PC) */
@media (min-width: 901px) {
  .horizontal-card:hover {
    transform: translateY(-8px) !important; /* Sutil brillo rojo */
  }
}

/* ANIMACIÓN DE SCROLL lateral */
.slide-from-right {
  opacity: 0;
  transform: translateX(100px);
}
.slide-from-right.is-visible {
  opacity: 1;
  transform: translateX(0);
}



.class-badge {
  position: absolute;
  top: 25px;
  right: 25px;
  background: rgba(229, 9, 20, 0.9);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 2px;
  padding: 6px 12px;
  border-radius: 3px;
}

.card-content {
  flex: 1;
  padding: 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.clase-title { font-size: 2.8rem; font-weight: 900; color: #fff; margin: 0 0 25px 0; letter-spacing: -1px; line-height: 1; }
.metrics-bar { display: flex; gap: 30px; margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.metric-item { display: flex; align-items: center; gap: 15px; }
.metric-item i { color: #e50914; font-size: 1.5rem; }
.metric-text-group { display: flex; flex-direction: column; }
.metric-label { font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }
.metric-value { font-size: 1.05rem; color: #fff; font-weight: 600; }
.clase-desc { color: #aaa; line-height: 1.8; font-size: 1.1rem; margin: 0; }
.clase-desc :deep(strong) { color: #fff; font-weight: 600; }

/* =========================================
   PULIDO ESTÉTICO PARA MÓVILES (NUEVO)
   ========================================= */
@media (max-width: 900px) {
  .horizontal-card { 
    flex-direction: column; 
    min-height: auto; 
    border-radius: 12px;
    width: 85%; /* Le da un poco de aire a los costados */
    max-width: 350px; /* Un tope máximo para que no se estire de más */
    margin: 0 auto; 
    /* Mantenemos el borde de 2px definido arriba */
  }
  
  .card-image { 
    width: 100%; 
    height: 180px; /* CORRECCIÓN: Alto reducido para una tarjeta más chica */
    flex: none; 
    /* CORRECCIÓN: Degradado vertical suave + imagen preservada */
    background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(17,17,17,1)), var(--bg-img); 
  }

  .class-badge { top: 15px; right: 15px; font-size: 0.65rem; }
  
  .card-content { 
    padding: 20px 15px 25px 15px; /* CORRECCIÓN: Relleno reducido */
  }

  .clase-title { 
    font-size: 1.8rem; /* CORRECCIÓN: Título más chico */
    margin-bottom: 15px; /* CORRECCIÓN: Menos margen */
    text-align: center; 
  }

  .metrics-bar { 
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px 10px; /* CORRECCIÓN: Menos espacio en grilla */
    padding-bottom: 15px; /* CORRECCIÓN: Menos relleno inferior */
    margin-bottom: 15px; /* CORRECCIÓN: Menos margen inferior */
  }
  
  .metric-item { gap: 10px; }
  .metric-item i { font-size: 1.2rem; }
  .metric-label { font-size: 0.65rem; }
  .metric-value { font-size: 0.9rem; }

  .full-width-mobile { grid-column: 1 / -1; }

  .clase-desc { 
    font-size: 0.9rem; /* CORRECCIÓN: Descripción más chica */
    line-height: 1.6;
    text-align: justify;
  }
}
</style>