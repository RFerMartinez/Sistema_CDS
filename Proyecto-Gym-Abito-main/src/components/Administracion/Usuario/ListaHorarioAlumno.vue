<template>
  <div class="tarjeta-horario">
    <div class="tarjeta-decoracion"></div>
    
    <div class="tarjeta-content">
      <div class="tarjeta-header">
        <span class="dia-nombre">{{ horario.dia }}</span>
        <div class="grupo-badge">
          <span>Grupo {{ horario.nroGrupo }}</span>
        </div>
      </div>
      
      <div class="tarjeta-body">
        <div class="tiempo-container">
          <div class="tiempo-item">
            <i class="far fa-clock icono-reloj"></i>
            <span class="hora">{{ horario.horaInicio }}</span>
            <span class="hs-texto">hs</span>
          </div>
          
          <div class="separador">
            <i class="fas fa-chevron-right"></i>
          </div>
          
          <div class="tiempo-item">
            <span class="hora">{{ horario.horaFin }}</span>
            <span class="hs-texto">hs</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  horario: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
/* Contenedor principal de la tarjeta: Más compacto y con bordes más sutiles */
.tarjeta-horario {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
  background: #ffffff;
  border-radius: 14px; /* Un poco menos redondeado para verse más firme */
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02); /* Doble sombra para profundidad natural */
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
}

.tarjeta-horario:active {
  transform: scale(0.985);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

/* La línea roja ahora es más fina (4px) y usa un rojo más elegante */
.tarjeta-decoracion {
  width: 4px;
  background: #e50914; /* Rojo sólido, sin degradado, se ve más nítido */
  flex-shrink: 0;
}

/* Envolvemos el contenido para manejar el padding sin afectar la línea roja */
.tarjeta-content {
  padding: 1.1rem 1.2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem; /* Menos espacio entre cabecera y el reloj */
}

/* Cabecera: Día y Grupo en la misma línea */
.tarjeta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dia-nombre {
  font-size: 1.15rem; /* Reducido de 1.4rem */
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
}

.grupo-badge {
  background: #f9fafb; /* Gris extremadamente claro */
  padding: 0.25rem 0.6rem;
  border-radius: 6px; /* Borde más cuadrado, más técnico */
  border: 1px solid #f3f4f6;
}

.grupo-badge span {
  font-size: 0.65rem; /* Más pequeño y sutil */
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Contenedor del reloj: Ajustado para ser más delgado */
.tiempo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Alineado a la izquierda */
  gap: 1rem; /* Espaciado entre la hora de inicio, flecha y fin */
  background: transparent; /* Quitamos el fondo gris para hacerlo más limpio */
  padding: 0;
  border: none;
}

.tiempo-item {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

/* Cambiado a un reloj outlined (far) para que se vea más fino y moderno */
.icono-reloj {
  color: #9ca3af; /* Gris sutil en lugar de rojo brillante */
  font-size: 0.9rem;
  align-self: center;
}

.hora {
  font-size: 1.05rem; /* Reducido para no dominar la tarjeta */
  font-weight: 600;
  color: #374151; /* Un gris apenas más claro que el negro puro */
  letter-spacing: 0;
}

.hs-texto {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

/* Flecha separadora: Más pequeña y con un icono más elegante */
.separador {
  color: #d1d5db;
  display: flex;
  align-items: center;
}

.separador i {
  font-size: 0.8rem;
}
</style>