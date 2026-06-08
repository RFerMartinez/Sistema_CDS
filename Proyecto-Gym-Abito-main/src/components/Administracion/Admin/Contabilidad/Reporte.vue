<template>
  <div class="tarjeta-reporte">
    <div class="contenido-flex">
      
      <div class="bloque-id">
        <div class="icono-wrapper">
          <i class="fas fa-file-invoice"></i>
        </div>
        <div class="info-id">
          <span class="label-sutil">REPORTE</span>
          <span class="valor-id">#{{ reporte.idFacturacion }}</span>
        </div>
      </div>

      <div class="bloque-datos">
        <div class="dato">
          <i class="far fa-calendar-alt"></i>
          <div class="textos">
            <span class="dato-label">PERÍODO</span>
            <span class="dato-valor">{{ formatearFecha(reporte.fechaInicio) }} - {{ formatearFecha(reporte.fechaFin) }}</span>
          </div>
        </div>

        <div class="dato">
          <i class="far fa-user"></i>
          <div class="textos">
            <span class="dato-label">TITULAR</span>
            <span class="dato-valor">{{ reporte.titular }}</span>
          </div>
        </div>
      </div>

      <div class="bloque-acciones">
        <button class="btn-descargar" @click="emitirDescarga" title="Descargar PDF">
          <i class="fas fa-download"></i>
          <span class="texto-boton">Descargar</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  reporte: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['descargar-reporte']);

const emitirDescarga = () => {
  // Emitimos el ID del reporte para que el padre maneje la descarga
  emit('descargar-reporte', props.reporte.idFacturacion);
};

// Función auxiliar para mejorar la vista de la fecha (opcional)
const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '--/--/--';
  const [year, month, day] = fechaStr.split('-');
  return `${day}/${month}/${year}`;
};
</script>

<style scoped>
.tarjeta-reporte {
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  border-left: 5px solid #333; /* Acento en gris oscuro/negro como en tu esquema */
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.tarjeta-reporte:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.contenido-flex {
  display: flex;
  align-items: center;
  padding: 1.2rem 1.5rem;
  gap: 2rem;
}

/* Identificador */
.bloque-id {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 130px;
  border-right: 1px solid #f0f0f0;
  padding-right: 1.5rem;
}

.icono-wrapper {
  width: 40px;
  height: 40px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 1.2rem;
}

.info-id { display: flex; flex-direction: column; }
.label-sutil { font-size: 0.65rem; font-weight: 700; color: #aaa; letter-spacing: 0.5px; }
.valor-id { font-size: 1.2rem; font-weight: 800; color: #333; }

/* Datos */
.bloque-datos {
  flex: 1;
  display: flex;
  gap: 3rem;
}

.dato {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.dato i { color: #e50914; font-size: 1.1rem; opacity: 0.8; }
.textos { display: flex; flex-direction: column; }
.dato-label { font-size: 0.7rem; color: #888; font-weight: 700; text-transform: uppercase; }
.dato-valor { font-size: 1rem; color: #444; font-weight: 600; }

/* Botón Descargar */
.btn-descargar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.2rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-descargar:hover {
  background-color: #e50914; /* Cambio a rojo corporativo en hover */
  transform: scale(1.05);
}

/* ================= RESPONSIVE ================= */

@media (max-width: 900px) {
  .contenido-flex { gap: 1.5rem; }
  .bloque-datos { gap: 1.5rem; }
}

@media (max-width: 768px) {
  .contenido-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
  }
  
  .bloque-id {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    padding-right: 0;
    padding-bottom: 0.8rem;
    width: 100%;
  }

  .bloque-datos {
    flex-direction: column;
    gap: 0.8rem;
    width: 100%;
  }

  .bloque-acciones {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  
  .btn-descargar { width: 100%; justify-content: center; }
}
</style>