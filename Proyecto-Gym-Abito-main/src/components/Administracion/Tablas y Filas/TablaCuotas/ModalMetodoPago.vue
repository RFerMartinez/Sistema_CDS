<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="modal-overlay" @click.self="$emit('cancelar')">
        <div class="selector-pago-container">
          <div class="icono-flotante">
            <i class="fas fa-cash-register"></i>
          </div>

          <div class="selector-header">
            <h3>Registrar Pago</h3>
            <p>Cuota de <strong>{{ mesNombre }}</strong></p>
          </div>
          
          <div class="selector-body">
            <span class="label-ayuda">¿Cómo recibiste el dinero?</span>
            
            <div class="opciones-pago">
              <button 
                class="btn-opcion" 
                :class="{ 'seleccionado': metodoSeleccionado === 'efectivo' }"
                @click="metodoSeleccionado = 'efectivo'"
              >
                <div class="check-icon" v-if="metodoSeleccionado === 'efectivo'">
                  <i class="fas fa-check-circle"></i>
                </div>
                <i class="fas fa-money-bill-wave icon-main"></i>
                <span>Efectivo</span>
              </button>
              
              <button 
                class="btn-opcion" 
                :class="{ 'seleccionado': metodoSeleccionado === 'transferencia' }"
                @click="metodoSeleccionado = 'transferencia'"
              >
                <div class="check-icon" v-if="metodoSeleccionado === 'transferencia'">
                  <i class="fas fa-check-circle"></i>
                </div>
                <i class="fas fa-university icon-main"></i>
                <span>Transferencia</span>
              </button>
            </div>
          </div>

          <div class="selector-footer">
            <button class="btn-cancelar" @click="$emit('cancelar')">
              Volver
            </button>
            <button 
              class="btn-continuar" 
              :disabled="!metodoSeleccionado"
              @click="$emit('confirmar', metodoSeleccionado)"
            >
              Continuar <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
defineProps(['mesNombre']);
defineEmits(['cancelar', 'confirmar']);

const metodoSeleccionado = ref(null);
</script>

<style scoped>
/* Contenedor principal con diseño único */
.selector-pago-container {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: slideUp 0.3s ease-out;
}

/* Icono superior distintivo */
.icono-flotante {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 8px 16px rgba(76, 175, 80, 0.4);
}

.selector-header {
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.selector-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.selector-header p {
  color: #7f8c8d;
  margin: 0.5rem 0 0;
}

.label-ayuda {
  display: block;
  font-size: 0.9rem;
  color: #95a5a6;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

/* Estetica de las opciones (lo que te gustó, mejorado) */
.opciones-pago {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.btn-opcion {
  flex: 1;
  height: 120px;
  border: 2px solid #f1f3f5;
  border-radius: 20px;
  background: #f8f9fa;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-weight: 700;
  color: #6c757d;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.icon-main { font-size: 2rem; }

.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #4CAF50;
  font-size: 1.2rem;
  background: white;
  border-radius: 50%;
}

.btn-opcion:hover {
  border-color: #4CAF50;
  background: white;
  transform: translateY(-5px);
}

.btn-opcion.seleccionado {
  border-color: #4CAF50;
  background-color: #f0fff4;
  color: #2e7d32;
  box-shadow: 0 10px 20px rgba(76, 175, 80, 0.15);
}

/* Footer con botones diferentes */
.selector-footer {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.btn-continuar {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s;
}

.btn-continuar:hover:not(:disabled) {
  background: #43a047;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-continuar:disabled {
  background: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
}

.btn-cancelar {
  background: transparent;
  color: #95a5a6;
  border: none;
  font-weight: 600;
  padding: 0.5rem;
  cursor: pointer;
}

.btn-cancelar:hover {
  color: #7f8c8d;
  text-decoration: underline;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>