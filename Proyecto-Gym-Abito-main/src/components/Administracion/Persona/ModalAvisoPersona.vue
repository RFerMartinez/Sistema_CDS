<template>
  <div class="modal-backdrop" @click.self="cerrar">
    <div class="modal-card">
      
      <div class="icon-header">
        <div class="circle-icon">
          <i class="fas fa-info"></i>
        </div>
      </div>

      <h2 class="modal-title">IMPORTANTE</h2>

      <div class="modal-text">
        <p>
          Usted se ha registrado correctamente
          pero todavía no forma parte de nuestra comunidad. 
        </p>
        <p>
            <strong>Aún no está registrado como alumno.</strong>
        </p>
        <p>
          Por favor, acérquese al gimnasio para poder activarlo como alumno 
          y asignarle una suscripción y horarios.
        </p>
        <div class="location-box">
          <i class="fas fa-map-marker-alt"></i>
          <span>Estamos ubicados en <strong>Calle 9 de Julio 1355</strong>.</span>
        </div>
        <p class="farewell">¡Te esperamos!</p>
      </div>

      <button class="btn-entendido" @click="cerrar">
        Entendido
      </button>

    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close']);

const cerrar = () => {
  emit('close');
};
</script>

<style scoped>
/* Fondo oscuro con desenfoque */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Un poco más suave */
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* Tarjeta del modal */
.modal-card {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2); /* Sombra más suave */
  position: relative;
  overflow: hidden;
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Decoración superior: Mantenemos el degradado Ámbar */
.modal-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #ffc107, #ff9800);
}

/* Icono */
.icon-header {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.circle-icon {
  width: 70px;
  height: 70px;
  /* Fondo muy suave naranja */
  background-color: #fff8e1; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff9800; /* Icono naranja fuerte */
  font-size: 2rem;
  animation: pulse 2s infinite;
}

/* Título: Cambiado de Azul a Gris muy oscuro (Casi negro) */
.modal-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem;
  color: #333333; /* CAMBIO: Neutro elegante */
  margin-bottom: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Textos */
.modal-text p {
  font-size: 1.05rem;
  color: #666; /* CAMBIO: Gris medio para lectura cómoda */
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Negritas dentro del texto */
.modal-text strong {
  color: #d35400; /* Un naranja un poco más oscuro para resaltar palabras clave */
  font-weight: 600;
}

/* Caja de ubicación */
.location-box {
  background-color: #fff8e1; /* Fondo crema muy suave */
  border-left: 4px solid #ff9800; /* CAMBIO: Borde Naranja (combina con el tema) */
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #444; /* Texto gris oscuro */
}

.location-box i {
  color: #ff9800; /* Pin del mapa en naranja */
}

.farewell {
  font-weight: 600;
  color: #333;
  margin-top: 1rem;
}

/* Botón: CAMBIO RADICAL */
/* Ahora es un degradado naranja que hace juego con la barra superior */
.btn-entendido {
  background: linear-gradient(45deg, #ffc107, #ff9800); 
  color: white;
  border: none;
  padding: 0.9rem 3.5rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3); /* Sombra naranja brillante */
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-entendido:hover {
  background: linear-gradient(45deg, #ffca28, #ffa726);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
}

.btn-entendido:active {
  transform: translateY(0);
}

/* Animaciones (Sin cambios, funcionan bien) */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(255, 193, 7, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
}

/* Responsivo */
@media (max-width: 600px) {
  .modal-card { width: 95%; padding: 1.5rem; }
  .modal-title { font-size: 1.5rem; }
}
</style>