<template>
  <div class="form-wrapper">
    <form class="auth-form" @submit.prevent="cambiarContrasena">
      
      <!-- TÍTULO DINÁMICO SEGÚN EL MODO -->
      <h3 class="form-title">
        {{ modo === 'actualizacion' ? 'Actualiza tu contraseña' : 'Restablecer Contraseña' }}
      </h3>

      <!-- SUBTÍTULO SOLO PARA MODO ACTUALIZACIÓN -->
      <p v-if="modo === 'actualizacion'" class="form-subtitle">
        Por motivos de seguridad debe cambiar su contraseña ya que actualmente es su DNI y no es segura.
      </p>
      
      <!-- Nueva Contraseña -->
      <div class="form-group">
        <div class="input-container">
          <input 
            v-model="passwordData.newPassword"
            :type="passwordFieldType" 
            id="new-password"
            class="form-input"
            placeholder=" "
            required
            autocomplete="new-password"
            @input="limpiarError"
          >
          <label for="new-password" class="form-label">Nueva Contraseña</label>
          
          <button type="button" @click="togglePass('main')" class="toggle-btn" tabindex="-1">
            <svg v-if="passwordFieldType === 'password'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </button>
        </div>
      </div>

      <!-- Confirmar Contraseña -->
      <div class="form-group">
        <div class="input-container">
          <input 
            v-model="passwordData.confirmPassword"
            :type="confirmFieldType" 
            id="confirm-password"
            class="form-input"
            placeholder=" "
            required
            autocomplete="new-password"
            @input="limpiarError"
          >
          <label for="confirm-password" class="form-label">Confirmar Contraseña</label>
          
          <button type="button" @click="togglePass('confirm')" class="toggle-btn" tabindex="-1">
            <svg v-if="confirmFieldType === 'password'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </button>
        </div>

        <!-- Lista de Requisitos (Debajo, estilo vertical como te gustó) -->
        <div class="password-requirements">
          <div class="req-item" :class="{ 'met': passwordChecks.length }">
            <span class="dot">•</span> Mínimo 8 caracteres
          </div>
          <div class="req-item" :class="{ 'met': passwordChecks.number }">
            <span class="dot">•</span> Al menos un número
          </div>
          <div class="req-item" :class="{ 'met': passwordChecks.upper }">
            <span class="dot">•</span> Al menos una mayúscula
          </div>
        </div>
      </div>

      <!-- Mensaje de Error (Validaciones locales) -->
      <transition name="slide-fade">
        <div v-if="errorMessage" class="error-banner">
          <span class="error-icon">⚠️</span> {{ errorMessage }}
        </div>
      </transition>

      <!-- Botón Guardar -->
      <button type="submit" class="auth-btn primary" :disabled="loading">
        <span v-if="!loading">GUARDAR NUEVA CONTRASEÑA</span>
        <div class="btn-loader" v-else></div>
      </button>

    </form>

    <!-- ================================================= -->
    <!-- ===            MODALES GENÉRICOS              === -->
    <!-- ================================================= -->

    <!-- Modal Éxito -->
    <Transition name="modal-fade">
      <div v-if="mostrarModalExito" class="modal-overlay">
        <div class="modal-exito">
          <div class="modal-header-exito">
            <i class="fas fa-check-circle"></i>
            <h3>¡Éxito!</h3>
          </div>
          <div class="modal-body-exito">
            <p>{{ mensajeModalExito }}</p>
          </div>
          <div class="modal-footer-exito">
            <button class="btn-modal-continuar" @click="handleContinuarExito">
              Continuar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Error -->
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
// Importamos la nueva función changePassword y getUser para saber a dónde redirigir al final
import { resetPassword, changePassword } from '@/api/services/authService';
import { getUser, getToken } from '@/api/storage/userStorage'; 

export default {
  name: 'Recuperacion',
  props: {
    modo: { type: String, default: 'recuperacion' },
    token: { type: String, default: '' }
  },
  data() {
    return {
      loading: false,
      passwordData: { newPassword: '', confirmPassword: '' },
      passwordFieldType: 'password',
      confirmFieldType: 'password',
      errorMessage: '',
      
      mostrarModalExito: false,
      mensajeModalExito: '',
      mostrarModalError: false,
      mensajeModalError: ''
    }
  },
  computed: {
    passwordChecks() {
      const pwd = this.passwordData.newPassword;
      return { length: pwd.length >= 8, number: /\d/.test(pwd), upper: /[A-Z]/.test(pwd) };
    },
    isPasswordValid() {
      const c = this.passwordChecks;
      return c.length && c.number && c.upper;
    },
    tokenReal() {
      if (this.token) return this.token;
      return this.$route.query.token || '';
    }
  },
  watch: {
    tokenReal: {
      immediate: true,
      handler(newVal) {
        if (this.modo === 'recuperacion' && newVal) {
          this.mostrarModalError = false;
        }
      }
    }
  },
  mounted() {
    // --- VALIDACIONES DE SEGURIDAD AL CARGAR ---
    setTimeout(() => {
      // CASO 1: Modo Recuperación (Requiere Token en URL)
      if (this.modo === 'recuperacion' && !this.tokenReal) {
        this.mensajeModalError = "Enlace inválido: No se encontró el token de seguridad.";
        this.mostrarModalError = true;
      }
      
      // CASO 2: Modo Actualización (Requiere estar Logueado)
      if (this.modo === 'actualizacion') {
        const tokenSesion = getToken(); // Función de tu userStorage.js
        if (!tokenSesion) {
          this.mensajeModalError = "Acceso denegado: Debes iniciar sesión primero.";
          this.mostrarModalError = true;
          setTimeout(() => this.$router.push('/login'), 2000);
        }
      }
    }, 500);
  },
  methods: {
    async cambiarContrasena() {
      if (!this.isPasswordValid || this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.errorMessage = 'Verifique las contraseñas.';
        return;
      }

      this.loading = true;
      this.errorMessage = '';

      try {
        // --- LOGICA DIFERENCIADA ---
        if (this.modo === 'recuperacion') {
          // Flujo: Olvidé mi contraseña (Token de Email)
          if (!this.tokenReal) throw new Error("Falta token.");
          await resetPassword(this.tokenReal, this.passwordData.newPassword);
          this.mensajeModalExito = "Contraseña restaurada. Por favor inicie sesión.";
        
        } else {
          // Flujo: Primer Ingreso (Token de Sesión / JWT)
          await changePassword(this.passwordData.newPassword);
          this.mensajeModalExito = "Contraseña actualizada exitosamente. ¡Bienvenido!";
        }
        
        this.mostrarModalExito = true;

      } catch (error) {
        console.error("Error:", error);
        this.mensajeModalError = error.response?.data?.detail || 'Ocurrió un error al procesar la solicitud.';
        this.mostrarModalError = true;
      } finally {
        this.loading = false;
      }
    },
    
    handleContinuarExito() {
      this.mostrarModalExito = false;
      
      if (this.modo === 'recuperacion') {
        // Si recuperó, va al login a poner su nueva clave
        this.$router.push('/login');
      } else {
        // Si actualizó (primer ingreso), ya está logueado, lo mandamos a su Home
        const user = getUser();
        if (user.esAdmin) this.$router.push('/admin');
        else if (user.esEmpleado) this.$router.push('/Empleado');
        else if (user.esAlumno) this.$router.push('/Usuario');
        else this.$router.push('/Persona');
      }
    },
    
    // ... resto de helpers (togglePass, etc) ...
    handleContinuarError() { this.mostrarModalError = false; },
    togglePass(field) {
        if(field === 'main') this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
        else this.confirmFieldType = this.confirmFieldType === 'password' ? 'text' : 'password';
    },
    limpiarError() { this.errorMessage = ''; }
  }
}
</script>

<style scoped>
.form-wrapper { width: 100%; animation: fadeIn 0.4s ease; }
.auth-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { position: relative; }

.form-title { 
  color: #fff; font-family: 'Poppins', sans-serif; 
  text-align: center; margin-bottom: 0.5rem; font-size: 1.5rem; 
}

/* Subtítulo específico para modo actualización */
.form-subtitle {
  color: #d1d5db; /* Gris claro */
  font-family: 'Inter', sans-serif;
  text-align: center;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  padding: 0 10px;
}

/* REQUISITOS (Lista Vertical) */
.password-requirements {
  margin-top: 10px;
  display: flex; flex-direction: column; gap: 6px; padding-left: 10px;
}
.req-item {
  font-size: 0.85rem; color: #666;
  transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;
  font-family: 'Inter', sans-serif;
}
.req-item .dot { font-size: 1rem; line-height: 0; }
.req-item.met { color: #00ff88; }

/* INPUTS (Estilo redondeado consistente) */
.input-container {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 60px;
  transition: all 0.3s ease;
}
.input-container:hover { background: rgba(255, 255, 255, 0.06); }
.input-container:focus-within { border-color: #e50914; background: rgba(255, 255, 255, 0.08); box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.1); }

.form-input {
  width: 100%; height: 100%; background: transparent; border: none;
  padding: 20px 16px 6px 16px; color: #fff; font-size: 1rem; font-family: 'Inter', sans-serif; border-radius: 12px;
}
.form-input:focus { outline: none; }

.form-label {
  position: absolute; top: 50%; left: 16px; transform: translateY(-50%);
  color: #888; font-size: 1rem; pointer-events: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', sans-serif;
}
.form-input:focus + .form-label, .form-input:not(:placeholder-shown) + .form-label {
  top: 14px; font-size: 0.75rem; color: #e50914; font-weight: 600;
}

.toggle-btn {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: transparent; border: none; color: #666; cursor: pointer; padding: 8px; display: flex;
}
.toggle-btn:hover { color: #fff; }

/* BOTÓN */
.auth-btn {
  width: 100%; padding: 1rem;
  background: linear-gradient(135deg, #e50914, #ff3f3f);
  border: none; border-radius: 12px;
  color: white; font-weight: 600; font-size: 1rem; cursor: pointer;
  transition: all 0.3s ease; font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.25); margin-top: 1rem;
}
.auth-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(229, 9, 20, 0.4); }
.auth-btn:disabled { opacity: 0.7; cursor: not-allowed; background: #555; }

/* Error */
.error-banner { 
  color: #ff4d4d; background: rgba(255, 77, 77, 0.1); 
  padding: 10px; border-radius: 8px; 
  font-size: 0.9rem; text-align: center; 
  border: 1px solid rgba(255, 77, 77, 0.2);
}

.btn-loader { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid #fff; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
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