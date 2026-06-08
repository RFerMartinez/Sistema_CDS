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
        
        <div class="tabs-container">
          <div class="tabs-background">
            <button 
              class="tab-btn" 
              :class="{ active: currentModo !== 'registro' }" 
              @click="cambiarModo('login')"
            >
              Iniciar Sesión
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: currentModo === 'registro' }" 
              @click="cambiarModo('registro')"
            >
              Registrarse
            </button>
            <div class="tab-glider" :class="{ right: currentModo === 'registro' }"></div>
          </div>
        </div>
      </div>

      <div class="auth-content">
        <transition name="fade" mode="out-in">
          <LoginForm v-if="currentModo !== 'registro'" />
          <RegisterStep1 v-else />
        </transition>
      </div>

    </div>
    
    <div class="simple-footer">
      <p>© {{anio}} Gimnasio Abito</p>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/Inicio/LoginForm.vue';
import RegisterStep1 from '@/components/Inicio/RegisterStep1.vue';
import { obtenerAnioActual } from '@/utils/formatters';

export default {
  name: 'LoginView',
  components: { LoginForm, RegisterStep1 },
  data() {
    return {
      anio: obtenerAnioActual()
    }
  },
  computed: {
    currentModo() { return this.$route.query.modo || 'login'; }
  },
  methods: {
    cambiarModo(m) {
      if (this.currentModo !== m) this.$router.push({ path: '/login', query: { modo: m } });
    }
  }
}
</script>

<style scoped>
/* ESTRUCTURA (Fondo oscuro y patrón) */
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

/* TARJETA PRINCIPAL (Con bordes redondeados) */
.auth-container {
  position: relative; z-index: 10;
  width: 100%; max-width: 440px;
  background: rgba(18, 18, 18, 0.95); /* Casi sólido para mejor lectura */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px; /* <--- BORDES REDONDEADOS AQUÍ */
  padding: 2.5rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.auth-header { text-align: center; margin-bottom: 2rem; }

.brand-logo {
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem; font-weight: 700;
  margin-bottom: 1.5rem; letter-spacing: -0.5px;
}
.brand-text { color: #fff; }
.brand-accent { color: #e50914; }

/* TABS REDONDEADOS */
.tabs-container { display: flex; justify-content: center; }

.tabs-background {
  position: relative; display: flex;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px;
  border-radius: 50px; /* <--- ESTILO PASTILLA */
  width: 100%;
  border: 1px solid rgba(255,255,255,0.05);
}

.tab-btn {
  flex: 1; position: relative; z-index: 2;
  padding: 0.7rem 0;
  border: none; background: transparent;
  color: #888; font-weight: 500; font-size: 0.9rem;
  cursor: pointer; transition: color 0.3s ease;
  font-family: 'Inter', sans-serif;
}
.tab-btn.active { color: #fff; font-weight: 600; }

.tab-glider {
  position: absolute; top: 4px; left: 4px;
  width: calc(50% - 4px); height: calc(100% - 8px);
  background: #2a2a2a; /* Fondo gris oscuro para la selección */
  border-radius: 40px; /* Redondeado */
  z-index: 1;
  transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.tab-glider.right { transform: translateX(100%); }

.simple-footer { position: relative; z-index: 10; margin-top: 2rem; color: #444; font-size: 0.8rem; font-family: 'Inter', sans-serif; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>