<template>
  <div class="login-layout">
    <div class="bg-pattern-fixed"></div>
    <div class="hero-gradient-overlay"></div>

    <div class="auth-container">
      
      <div class="auth-header">
        <div class="brand-logo">
          <span class="brand-text">GIMNASIO</span>
          <span class="brand-accent">Abito</span>
        </div>
      </div>
      
      <div class="auth-content">
        <RegisterStep2 :token="token"/>
      </div>
      
    </div>

    <div class="simple-footer">
      <p>© {{anio}} Gimnasio Abito</p>
    </div>
  </div>
</template>

<script>
// Ya no necesitamos AuthBackground porque usamos el estilo directo
import RegisterStep2 from '@/components/Inicio/RegisterStep2.vue';
import { obtenerAnioActual } from '@/utils/formatters';

export default {
  name: 'RegistroFinalView',
  data() {
    return {
      anio: obtenerAnioActual()
    }
  },
  components: {
    RegisterStep2
  },
  computed: {
    // Extraemos el token de la barra de direcciones (?token=...)
    token() {
      return this.$route.query.token;
    }
  }
}
</script>

<style scoped>
/* --- ESTRUCTURA GENERAL (Igual a LoginView) --- */
.login-layout {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #050505;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 20px;
}

.bg-pattern-fixed {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: radial-gradient(#222 1px, transparent 1px);
  background-size: 30px 30px; z-index: 0;
}

.hero-gradient-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at center, transparent 0%, #050505 120%);
  pointer-events: none; z-index: 1;
}

/* --- TARJETA PRINCIPAL --- */
.auth-container {
  position: relative; z-index: 10;
  width: 100%;
  /* Un poco más ancho que el Login para acomodar las columnas del formulario */
  max-width: 520px; 
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px; /* Bordes redondeados consistentes */
  padding: 2.5rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.6s ease;
}

.auth-header { text-align: center; margin-bottom: 2rem; }

.brand-logo {
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem; font-weight: 700;
  margin-bottom: 0.5rem; letter-spacing: -0.5px;
}
.brand-text { color: #fff; }
.brand-accent { color: #e50914; }

/* FOOTER */
.simple-footer { 
  position: relative; z-index: 10; margin-top: 2rem; 
  color: #444; font-size: 0.8rem; font-family: 'Inter', sans-serif; 
}

@keyframes slideUp { 
  from { opacity: 0; transform: translateY(20px); } 
  to { opacity: 1; transform: translateY(0); } 
}
</style>