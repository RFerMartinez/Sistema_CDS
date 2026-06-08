<template>
  <div class="form-wrapper">
    <form v-if="!correoEnviado" class="auth-form" @submit.prevent="enviarVerificacion">
      
      <div class="step-indicator">
        <div class="step active">1</div>
        <div class="step-line"></div>
        <div class="step">2</div>
      </div>

      <div class="form-group">
        <div class="input-container">
          <input 
            v-model="registerData.email"
            type="email" 
            id="email"
            class="form-input"
            placeholder=" "
            required
            autocomplete="email"
            @blur="validarEmail"
            @input="limpiarErrorEmail"
          >
          <label for="email" class="form-label">Correo Electrónico</label>
        </div>
        <div class="error-msg-mini" v-if="emailError">{{ emailError }}</div>
      </div>

      <div class="form-group">
        <div class="input-container">
          <input 
            v-model="registerData.username"
            type="text" 
            id="reg-username"
            class="form-input"
            placeholder=" "
            required
            autocomplete="username"
          >
          <label for="reg-username" class="form-label">Usuario</label>
        </div>
        <div class="password-requirements" style="margin-bottom: 5px;">
          <div class="req-item" :class="{ 'met': usernameHasNoSpaces }">
            <span class="dot">•</span> No debe contener espacios
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="input-container">
          <input 
            v-model="registerData.password"
            :type="registerPasswordFieldType" 
            id="reg-password"
            class="form-input"
            placeholder=" "
            required
            autocomplete="new-password"
            @input="limpiarErrorPassword"
          >
          <label for="reg-password" class="form-label">Contraseña</label>
          
          <button type="button" @click="togglePass('pass')" class="toggle-btn" tabindex="-1">
             <svg v-if="registerPasswordFieldType === 'password'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
             <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </button>
        </div>
      </div>
      
      <div class="form-group">
        <div class="input-container">
          <input 
            v-model="registerData.confirmPassword"
            :type="registerConfirmPasswordFieldType" 
            id="reg-confirm-password"
            class="form-input"
            placeholder=" "
            required
            autocomplete="new-password"
            @blur="validarContraseñas"
            @input="limpiarErrorPassword"
          >
          <label for="reg-confirm-password" class="form-label">Confirmar Contraseña</label>
          
          <button type="button" @click="togglePass('confirm')" class="toggle-btn" tabindex="-1">
             <svg v-if="registerConfirmPasswordFieldType === 'password'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
             <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </button>
        </div>

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
      
      <div v-if="passwordError" class="error-banner">{{ passwordError }}</div>

      <button type="submit" class="auth-btn primary" :disabled="loading || !usernameHasNoSpaces">
        <span v-if="!loading">CONTINUAR</span>
        <div class="btn-loader" v-else></div>
      </button>

      <div class="form-links">
        <router-link to="/" class="link-text">← Volver al inicio</router-link>
      </div>
    </form>

    <div v-else class="success-wrapper">
      <div class="success-content">
        <div class="mail-icon-container">
           <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </div>
        
        <h3 class="success-title">Verifica tu correo</h3>
        <div class="success-message">
           <p>Hemos enviado un enlace de confirmación a <strong>{{ registerData.email }}</strong>.</p>
           <p>Por favor, revisa tu bandeja de entrada o en spam y haz clic en el enlace para completar el paso 2 del registro.</p>
        </div>
        
        <button @click="reenviarCorreo" class="link-text" style="background:none; border:none; cursor:pointer;">
            ¿No recibiste el correo? Reenviar
        </button>
      </div>
    </div>

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
import { registroPaso1 } from '@/api/services/authService';

export default {
  name: 'RegisterStep1',
  data() {
    return {
      loading: false,
      correoEnviado: false,
      registerData: {
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      },
      emailError: '',
      passwordError: '',
      registerPasswordFieldType: 'password',
      registerConfirmPasswordFieldType: 'password',
      mostrarModalError: false,
      mensajeModalError: ''
    }
  },
  computed: {
    // Validación de usuario sin espacios (incluyendo intermedios)
    usernameHasNoSpaces() {
      if (!this.registerData.username) return false;
      return !/\s/.test(this.registerData.username.trim());
    },
    passwordChecks() {
      const pwd = this.registerData.password;
      return {
        length: pwd.length >= 8,
        number: /\d/.test(pwd),
        upper: /[A-Z]/.test(pwd)
      }
    },
    isPasswordValid() {
      const c = this.passwordChecks;
      return c.length && c.number && c.upper;
    }
  },
  methods: {
    async enviarVerificacion() {
      // 1. Limpieza de espacios accidentales (Sanitización)
      this.registerData.email = this.registerData.email.trim();
      this.registerData.username = this.registerData.username.trim();
      this.registerData.password = this.registerData.password.trim();
      this.registerData.confirmPassword = this.registerData.confirmPassword.trim();

      // 2. Validaciones post-limpieza
      if (!this.usernameHasNoSpaces) {
        this.mensajeModalError = 'El nombre de usuario no debe contener espacios.';
        this.mostrarModalError = true;
        return;
      }

      if (!this.isPasswordValid) {
        this.passwordError = 'La contraseña no cumple con los requisitos.';
        return;
      }
      
      this.validarContraseñas();
      this.validarEmail();
      if (this.passwordError || this.emailError) return;

      this.loading = true;

      try {
        const payload = {
          email: this.registerData.email,
          usuario: this.registerData.username,
          contrasenia: this.registerData.password,
          confirmar_contrasenia: this.registerData.confirmPassword
        };

        await registroPaso1(payload);
        this.correoEnviado = true;
        
      } catch (error) {
        console.error(error);
        const mensajeAPI = error.response?.data?.detail || 'Error al conectar con el servidor';
        this.mensajeModalError = mensajeAPI;
        this.mostrarModalError = true;
      } finally {
        this.loading = false;
      }
    },
    
    handleContinuarError() {
      this.mostrarModalError = false;
    },

    togglePass(field) {
        if(field === 'pass') this.registerPasswordFieldType = this.registerPasswordFieldType === 'password' ? 'text' : 'password';
        else this.registerConfirmPasswordFieldType = this.registerConfirmPasswordFieldType === 'password' ? 'text' : 'password';
    },
    validarEmail() {
      const email = this.registerData.email.trim();
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !regex.test(email)) {
        this.emailError = 'Correo inválido';
      } else {
        this.emailError = '';
      }
    },
    limpiarErrorEmail() { this.emailError = ''; },
    validarContraseñas() {
      if (this.registerData.password.trim() !== this.registerData.confirmPassword.trim()) {
        this.passwordError = 'Las contraseñas no coinciden';
      } else {
        this.passwordError = '';
      }
    },
    limpiarErrorPassword() { this.passwordError = ''; },
    reenviarCorreo() { alert("Correo reenviado (Simulación)"); }
  }
}
</script>

<style scoped>
/* REUTILIZACIÓN DE ESTILOS */
.form-wrapper { width: 100%; animation: fadeIn 0.4s ease; }
.auth-form { display: flex; flex-direction: column; gap: 1.2rem; }
.form-group { position: relative; }

/* REQUISITOS DE CONTRASEÑA (LISTA VERTICAL) */
.password-requirements {
  margin-top: 10px;
  display: flex;
  flex-direction: column; /* Vuelta a vertical */
  gap: 6px;
  padding-left: 10px;
}

.req-item {
  font-size: 0.85rem; /* Letra legible */
  color: #666;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
}

.req-item .dot { font-size: 1rem; line-height: 0; }

/* Cuando se cumple el requisito */
.req-item.met {
  color: #00ff88; /* Verde neón */
}

/* Pasos */
.step-indicator { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1rem; }
.step { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.5); font-family: 'Inter', sans-serif; font-size: 0.9rem; }
.step.active { background: rgba(229, 9, 20, 0.2); color: #e50914; border: 1px solid #e50914; }
.step-line { flex: 1; height: 2px; background: rgba(255, 255, 255, 0.1); max-width: 60px; }

/* Inputs */
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
  width: 100%; height: 100%;
  background: transparent; border: none;
  padding: 20px 16px 6px 16px;
  color: #fff; font-size: 1rem; font-family: 'Inter', sans-serif;
  border-radius: 12px;
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

.auth-btn {
  width: 100%; padding: 1rem;
  background: linear-gradient(135deg, #e50914, #ff3f3f);
  border: none; border-radius: 12px;
  color: white; font-weight: 600; font-size: 1rem; cursor: pointer;
  transition: all 0.3s ease; font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.25); margin-top: 0.5rem;
}
.auth-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(229, 9, 20, 0.4); }
.auth-btn:disabled { opacity: 0.7; cursor: not-allowed; background: #555; }

.error-banner { color: #ff4d4d; background: rgba(255, 77, 77, 0.1); padding: 10px; border-radius: 8px; font-size: 0.9rem; text-align: center; }
.error-msg-mini { color: #ff4d4d; font-size: 0.8rem; margin-top: 4px; margin-left: 5px; }
.form-links { text-align: center; margin-top: 1rem; }
.link-text { color: rgba(255, 255, 255, 0.5); text-decoration: none; font-size: 0.9rem; transition: color 0.3s; }
.link-text:hover { color: #fff; }

.success-wrapper { text-align: center; padding: 2rem 0; animation: fadeIn 0.6s ease; }
.mail-icon-container { margin-bottom: 1.5rem; }
.success-title { color: #fff; margin-bottom: 1rem; font-family: 'Poppins', sans-serif; }
.success-message { color: rgba(255,255,255,0.8); margin-bottom: 2rem; line-height: 1.6; font-size: 0.95rem; }
.btn-loader { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid #fff; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

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