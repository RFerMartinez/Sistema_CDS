<template>
  <div class="form-wrapper">
    
    <!-- VISTA LOGIN -->
    <form v-if="viewMode === 'login'" class="auth-form" @submit.prevent="iniciarSesion">
      
      <div class="form-group">
        <div class="input-container">
          <input 
            v-model="loginData.username"
            type="text" 
            id="username"
            class="form-input"
            placeholder=" "
            required
            autocomplete="username"
          >
          <label for="username" class="form-label">Usuario o Correo</label>
        </div>
      </div>

      <div class="form-group">
        <div class="input-container">
          <input 
            v-model="loginData.password"
            :type="passwordFieldType" 
            id="password"
            class="form-input"
            placeholder=" "
            required
            autocomplete="current-password"
          >
          <label for="password" class="form-label">Contraseña</label>
          
          <button 
            type="button" 
            @click="togglePasswordVisibility" 
            class="password-toggle-btn"
            tabindex="-1"
          >
            <svg v-if="passwordFieldType === 'password'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </button>
        </div>
        
        <div class="forgot-password-wrapper">
          <a href="#" @click.prevent="cambiarVista('recovery')" class="forgot-link">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
      
      <transition name="slide-fade">
        <div v-if="loginError" class="error-banner">
          <span class="error-icon">⚠️</span> {{ loginError }}
        </div>
      </transition>

      <button type="submit" class="auth-btn primary" :disabled="loading">
        <span v-if="!loading">INICIAR SESIÓN</span>
        <div class="btn-loader" v-else></div>
      </button>

      <div class="form-links">
        <router-link to="/" class="link-text">
          <span>←</span> Volver al inicio
        </router-link>
      </div>
    </form>

    <!-- VISTA RECUPERACIÓN (Paso 1) -->
    <!-- NOTA: Se agrega () al submit para evitar pasar el evento por defecto -->
    <form v-else-if="viewMode === 'recovery'" class="auth-form" @submit.prevent="enviarCorreoRecuperacion()">
      
      <div class="header-recovery">
        <h3>Recuperar Cuenta</h3>
        <p class="subtitle">Ingresa el correo asociado a tu cuenta.</p>
      </div>

      <div class="form-group">
        <div class="input-container">
          <input 
            v-model="recoveryEmail"
            type="email" 
            id="recovery-email"
            class="form-input"
            placeholder=" "
            required
            autocomplete="email"
            @input="loginError = ''" 
          >
          <label for="recovery-email" class="form-label">Correo Electrónico</label>
        </div>
      </div>

      <button type="submit" class="auth-btn action" :disabled="loading">
        <span v-if="!loading">ENVIAR ENLACE DE RECUPERACIÓN</span>
        <div class="btn-loader" v-else></div>
      </button>

      <div class="form-links">
        <button type="button" class="link-text-btn" @click="cambiarVista('login')">
          Cancelar y volver
        </button>
      </div>
    </form>

    <!-- VISTA ÉXITO -->
    <div v-else class="success-wrapper">
      <div class="success-content">
        <div class="mail-icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>
        </div>
        
        <h3 class="success-title">¡Revisa tu correo!</h3>
        <div class="success-message">
          <p>Hemos enviado un enlace de recuperación a <strong>{{ recoveryEmail }}</strong>. Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para restablecer tu contraseña.</p>
        </div>
        
        <!-- BOTÓN REENVIAR CON CONTADOR -->
        <div class="reenviar-container">
          <p v-if="tiempoEspera > 0" class="texto-espera">
            Podrás reenviar el correo en {{ tiempoEspera }}s
          </p>
          <button 
            v-else 
            @click="reenviarCorreo" 
            class="link-text-btn re-send" 
            :disabled="loading"
          >
            <span v-if="!loading">¿No recibiste el correo? Reenviar</span>
            <span v-else>Reenviando...</span>
          </button>
        </div>

        <button class="auth-btn secondary" @click="cambiarVista('login')">
          VOLVER AL LOGIN
        </button>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- ===             MODAL DE ERROR                === -->
    <!-- ================================================= -->
    <Transition name="modal-fade">
      <div v-if="mostrarModalError" class="modal-overlay">
        <div class="modal-error"> 
          <div class="modal-header-error">
            <i class="fas fa-exclamation-triangle"></i> 
            <h3>Error</h3>
          </div>
          <div class="modal-body-error">
            <p>{{ mensajeModalError }}</p> 
          </div>
          <div class="modal-footer-error">
            <button class="btn-modal-error" @click="handleContinuarError">
              Entendido
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script>
import {
  login,
  forgotPassword
} from '@/api/services/authService';

export default {
  name: 'LoginForm',
  data() {
    return {
      loading: false,
      viewMode: 'login', 
      loginData: { username: '', password: '' },
      recoveryEmail: '',
      loginError: '',
      passwordFieldType: 'password',
      mostrarModalError: false,
      mensajeModalError: '',
      tiempoEspera: 0,
      intervalo: null
    }
  },
  methods: {
    cambiarVista(modo) {
      this.loginError = '';
      this.mensajeModalError = '';
      this.viewMode = modo;
      if (modo !== 'success') {
        this.tiempoEspera = 0;
        if (this.intervalo) clearInterval(this.intervalo);
      }
    },
    async iniciarSesion() {
      // --- APLICACIÓN DE TRIM (Limpieza de espacios accidentales) ---
      this.loginData.username = this.loginData.username.trim();
      this.loginData.password = this.loginData.password.trim();

      this.loading = true;
      this.loginError = '';
      try {
        const userData = await login(this.loginData.username, this.loginData.password);
        
        if (userData.requiereCambioClave) {
          this.$router.push('/Recuperacion?modo=actualizacion');
          return;
        }

        if (userData.esAdmin) {
          this.$router.push('/admin');
        } else if (userData.esEmpleado) {
          this.$router.push('/Empleado');
        } else if (userData.esAlumno) {
          this.$router.push('/Usuario');
        } else {
          this.$router.push('/Persona');
        }

      } catch (error) {
        console.error(error);
        this.loginError = 'Credenciales incorrectas o error de conexión.';
      } finally {
        this.loading = false;
      }
    },

    async enviarCorreoRecuperacion(esReenvio = false) {
      if (typeof esReenvio !== 'boolean') esReenvio = false;

      // --- APLICACIÓN DE TRIM ---
      this.recoveryEmail = this.recoveryEmail.trim();

      this.loading = true;
      
      try {
        await forgotPassword(this.recoveryEmail);
        
        if (!esReenvio) {
          this.viewMode = 'success';
        } else {
          this.iniciarCuentaRegresiva();
        }

      } catch (error) {
        this.mensajeModalError = error.response?.data?.detail || 'Ocurrió un error. Verifique el correo.';
        this.mostrarModalError = true;
      } finally {
        this.loading = false;
      }
    },

    reenviarCorreo() {
      this.enviarCorreoRecuperacion(true);
    },

    iniciarCuentaRegresiva() {
      this.tiempoEspera = 60; 
      this.intervalo = setInterval(() => {
        if (this.tiempoEspera > 0) {
          this.tiempoEspera--;
        } else {
          clearInterval(this.intervalo);
        }
      }, 1000);
    },

    handleContinuarError() {
      this.mostrarModalError = false;
    },

    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    }
  },
  beforeUnmount() {
    if (this.intervalo) clearInterval(this.intervalo);
  }
}
</script>

<style scoped>
.form-wrapper { width: 100%; animation: fadeIn 0.4s ease; }
.auth-form { display: flex; flex-direction: column; gap: 1.5rem; }

.form-group { position: relative; }

/* Contenedor del input */
.input-container {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px 12px 0 0;
  transition: background 0.3s ease;
}
.input-container:hover { background: rgba(255, 255, 255, 0.06); }

.form-input {
  width: 100%;
  padding: 1.5rem 1rem 0.5rem 1rem; 
  background: transparent;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  border-radius: 12px 12px 0 0;
}

.form-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-bottom-color: #e50914;
}

/* Etiqueta Flotante */
.form-label {
  position: absolute; top: 1rem; left: 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem; pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', sans-serif;
}

.form-input:focus + .form-label,
.form-input:not(:placeholder-shown) + .form-label {
  transform: translateY(-0.7rem) scale(0.8);
  transform-origin: left top;
  color: #e50914; font-weight: 600;
}

/* Toggle Password */
.password-toggle-btn {
  position: absolute; top: 50%; right: 1rem; transform: translateY(-50%);
  background: transparent; border: none; cursor: pointer;
  color: rgba(255, 255, 255, 0.4); padding: 0; display: flex; transition: color 0.3s;
}
.password-toggle-btn:hover { color: #ffffff; }

/* --- FORGOT PASSWORD LINK --- */
.forgot-password-wrapper { text-align: right; margin-top: 8px; }
.forgot-link {
  color: #888; font-size: 0.85rem; text-decoration: none; transition: color 0.3s; font-family: 'Inter', sans-serif;
}
.forgot-link:hover { color: #e50914; text-decoration: underline; }

/* RECUPERACIÓN HEADER */
.header-recovery { text-align: center; margin-bottom: 1rem; }
.header-recovery h3 { color: #fff; margin-bottom: 0.5rem; font-family: 'Poppins', sans-serif; }
.subtitle { color: #888; font-size: 0.9rem; line-height: 1.4; }

/* BOTONES */
.auth-btn {
  position: relative; width: 100%; padding: 1rem;
  border: none; border-radius: 12px; font-weight: 600; font-size: 1rem;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.3s ease;
  display: flex; justify-content: center; align-items: center;
}

/* Botón Login Normal (ROJO) */
.auth-btn.primary {
  background: linear-gradient(135deg, #e50914, #ff3f3f); color: white;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.2); margin-top: 0.5rem;
}
.auth-btn.primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4); filter: brightness(1.1); }

/* Botón Recuperación (Ahora también ROJO) */
.auth-btn.action {
  background: linear-gradient(135deg, #e50914, #ff3f3f); 
  color: white;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.2);
  margin-top: 0.5rem;
}

.auth-btn.action:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
  filter: brightness(1.1);
}

.auth-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.auth-btn.secondary {
  background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.1);
}
.auth-btn.secondary:hover { background: rgba(255,255,255,0.15); }

/* Mensaje de Error Inline (Solo para Login) */
.error-banner {
  background: rgba(229, 9, 20, 0.1); border: 1px solid rgba(229, 9, 20, 0.3);
  color: #ff4d4d; padding: 0.8rem; border-radius: 8px; font-size: 0.9rem;
  display: flex; align-items: center; gap: 0.5rem; justify-content: center;
}

/* Links */
.form-links { text-align: center; margin-top: 1rem; }
.link-text { color: rgba(255, 255, 255, 0.5); text-decoration: none; font-size: 0.9rem; transition: color 0.3s; }
.link-text:hover { color: #ffffff; }
.link-text-btn { background: none; border: none; color: #888; cursor: pointer; font-size: 0.9rem; text-decoration: underline; }
.link-text-btn:hover { color: #fff; }

/* REENVÍO */
.reenviar-container {
  margin-bottom: 2rem;
  min-height: 24px; /* Evita saltos de altura */
}
.texto-espera {
  color: #888;
  font-size: 0.9rem;
  font-style: italic;
}
.re-send {
  color: #e50914 !important; /* Rojo para destacar la acción */
  text-decoration: none !important;
  font-weight: 500;
}
.re-send:hover {
  text-decoration: underline !important;
  color: #ff3f3f !important;
}

/* SUCCESS SCREEN */
.success-wrapper { text-align: center; padding: 2rem 0; animation: fadeIn 0.6s ease; }
.mail-icon-container { margin-bottom: 1.5rem; stroke: #00ff88; }
.success-title { color: #fff; margin-bottom: 1rem; font-family: 'Poppins', sans-serif; font-size: 1.5rem; }
.success-message { color: rgba(255,255,255,0.8); margin-bottom: 1.5rem; line-height: 1.6; }

/* Loader */
.btn-loader {
  width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid #e50914; /* Loader rojo por defecto */
  border-radius: 50%; animation: spin 0.8s linear infinite;
}

/* Forzar loader blanco en botones rojos */
.auth-btn.primary .btn-loader,
.auth-btn.action .btn-loader { 
  border-top: 2px solid #ffffff; 
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-10px); opacity: 0; }

/* AUTOCOMPLETE FIX */
.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover, 
.form-input:-webkit-autofill:focus, 
.form-input:-webkit-autofill:active {
  -webkit-text-fill-color: #ffffff !important;
  transition: background-color 5000s ease-in-out 0s;
  caret-color: #ffffff;
}
</style>