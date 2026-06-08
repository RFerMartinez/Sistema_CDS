<template>
  <div class="ficha-card">
    
    <div class="ficha-icon">
      <i class="fas fa-user-circle"></i>
    </div>

    <div class="ficha-info">
      <h3 class="info-nombre">{{ empleado.nombre }} {{ empleado.apellido }}</h3>
      <p class="info-dni">DNI: {{ empleado.dni }}</p>
      <p class="info-rol">{{ empleado.rol || 'Empleado' }}</p>
    </div>

    <div class="ficha-acciones">
      <button class="btn-detalles" @click="emitirDetalles">
        Detalles
      </button>
    </div>

  </div>
</template>

<script setup>
// 1. Definimos las 'props' que este componente espera recibir
const props = defineProps({
  empleado: {
    type: Object,
    required: true
  }
});

// 2. Definimos los eventos que este componente puede emitir
const emit = defineEmits(['ver-detalles']);

// 3. Función que se llama al hacer clic en el botón
const emitirDetalles = () => {
  // Emitimos el evento 'ver-detalles' y pasamos el objeto 'empleado'
  // completo de vuelta al padre (Empleados.vue)
  emit('ver-detalles', props.empleado);
};
</script>

<style scoped>
/* --- Estilo de la Ficha (Tarjeta) --- */
/* Usamos flexbox para alinear el icono y la info */
.ficha-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #ddd; /* Borde sutil como en la imagen */
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  overflow: hidden; /* Para que nada se salga */
}

.ficha-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  border-color: #e50914; /* Borde rojo al pasar el mouse */
}

/* --- Icono --- */
.ficha-icon {
  flex-shrink: 0; /* Evita que el icono se achique */
}

.ficha-icon i {
  font-size: 3.5rem; /* Tamaño grande */
  color: #ccc; /* Color gris como en la imagen */
}

/* --- Información (Nombre, DNI, Rol) --- */
.ficha-info {
  flex-grow: 1; /* Ocupa el espacio disponible */
  color: #333;
}

.info-nombre {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.info-dni {
  font-size: 0.9rem;
  color: #777;
  margin: 0 0 0.5rem 0;
}

.info-rol {
  font-size: 1rem;
  font-weight: 500;
  color: #e50914; /* Rol destacado en rojo */
  margin: 0;
}

/* --- Botón --- */
.ficha-acciones {
  flex-shrink: 0;
  margin-left: auto; /* Empuja el botón a la derecha */
}

.btn-detalles {
  padding: 0.6rem 1.2rem;
  background: #343a40; /* Gris oscuro */
  color: white;
  border: none;
  border-radius: 20px; /* Bordes redondeados */
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-detalles:hover {
  background: #e50914; /* Rojo al pasar el mouse */
  transform: scale(1.05);
}

/* --- Responsividad --- */
@media (max-width: 480px) {
  .ficha-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .ficha-info {
    text-align: left;
  }

  .ficha-acciones {
    margin-left: 0;
    width: 100%;
  }

  .btn-detalles {
    width: 100%;
    padding: 0.8rem;
  }
}
</style>