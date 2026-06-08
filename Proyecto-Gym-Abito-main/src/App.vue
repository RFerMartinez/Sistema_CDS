<template>
  <div id="app">
    <router-view />

    <div v-if="showSessionExpiredModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Sesión Expirada</h3>
        <p>Tu sesión ha caducado por seguridad. Por favor, inicia sesión nuevamente.</p>
        <button @click="irALogin">Iniciar Sesión</button>
      </div>
    </div>
  </div>
</template>

<script>
import { removeUser } from '@/api/storage/userStorage';

export default {
  data() {
    return {
      showSessionExpiredModal: false
    };
  },
  created() {
    // Escuchar el evento disparado desde el interceptor de Axios
    window.addEventListener('session-expired', this.handleSessionExpired);
  },
  beforeUnmount() { // O beforeDestroy en Vue 2
    window.removeEventListener('session-expired', this.handleSessionExpired);
  },
  methods: {
    handleSessionExpired() {
      this.showSessionExpiredModal = true;
    },
    irALogin() {
      removeUser(); // Limpiar storage por si acaso
      this.showSessionExpiredModal = false;
      this.$router.push('/login'); // O la ruta de tu login
    }
  }
};
</script>

<style scoped>
/* Contenedor principal con desenfoque moderno */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.7); /* Opacidad más suave */
  backdrop-filter: blur(8px); /* Desenfoque más pronunciado para enfoque total */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
  transition: all 0.3s ease;
}

/* Caja de contenido minimalista */
.modal-content {
  background: #ffffff;
  width: 100%;
  max-width: 380px;
  padding: 3rem 2rem;
  border-radius: 24px; /* Bordes más redondeados y modernos */
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1); /* Animación con rebote sutil */
}

/* Título profesional */
.modal-content h3 {
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
}

/* Párrafo con mejor legibilidad */
.modal-content p {
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  padding: 0 10px;
}

/* Botón elegante y limpio */
.modal-content button {
  width: 100%;
  background: #e91e63; /* Color sólido para un look más flat/minimal */
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
}

.modal-content button:hover {
  background: #d81b60;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(233, 30, 99, 0.3);
}

.modal-content button:active {
  transform: translateY(0);
}

/* Animación de entrada refinada */
@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Adaptación para móviles */
@media (max-width: 480px) {
  .modal-content {
    padding: 2.5rem 1.5rem;
    margin: 0 15px;
  }
  
  .modal-content h3 {
    font-size: 1.35rem;
  }
}
</style>