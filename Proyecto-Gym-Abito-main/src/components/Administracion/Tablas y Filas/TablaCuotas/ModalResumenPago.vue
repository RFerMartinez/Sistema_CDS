<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="modal-overlay" @click.self="$emit('cancelar')">
        <div class="resumen-container">
          <div class="resumen-header">
            <i class="fas fa-file-invoice-dollar"></i>
            <h3>Resumen de Pago</h3>
          </div>

          <div class="resumen-body">
            <div class="info-principal">
              <span class="mes-label">{{ nombreMes }} {{ cuota.anio }}</span>
              <span class="trabajo-label">{{ cuota.trabajo }}</span>
            </div>

            <div class="detalles-lista">
    <div class="detalle-item">
      <span>Monto cuota</span>
      <span>${{ cuota.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}</span>
    </div>

              <div v-if="esVencida" class="detalle-item con-recargo">
                <span>Recargo por vencimiento (10%)</span>
                <span>${{ recargoMora.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}</span>
              </div>

              <div class="detalle-item">
                <span>Servicio Mercado Pago ({{ porcentajeRecargoReal.toFixed(2) }}%)</span>
                <span>${{ comisionMP.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>

              <div class="divisor"></div>

              <div class="detalle-item total">
                <span>Total a pagar</span>
                <span>${{ totalFinal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
            </div>
            
            <div class="alerta-comision">
              <i class="fas fa-exclamation-circle"></i>
              <p>
                <strong>Importante:</strong> El costo por servicio de Mercado Pago se aplica solo en pagos online. Si abona en <strong>efectivo o transferencia</strong> (enviando el comprobante a los profesores), no se le cobrará este porcentaje y solo deberá pagar el <strong>monto neto de la cuota</strong>.
              </p>
            </div>
            <p class="nota-pago">
              Al continuar, serás redirigido para generar el código QR de pago.
            </p>
          </div>

          <div class="resumen-footer">
            <button class="btn-volver" @click="$emit('cancelar')">
              Volver
            </button>
            <button class="btn-pagar" @click="$emit('confirmar', totalFinal)">
              Continuar al Pago <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  cuota: { 
    type: Object, 
    required: true 
  },
  esVencida: { 
    type: Boolean, 
    default: false 
  }
});

const emit = defineEmits(['cancelar', 'confirmar']);

// --- Constantes de Mercado Pago ---
// La tasa que MP te descuenta (6,19%)
const TASA_DESCUENTO_MP = 0.0619; 
// El divisor para el cálculo inverso (100% - 6,19% = 93,81%)
const DIVISOR = 1 - TASA_DESCUENTO_MP; 

// --- Lógica de Visualización ---
const nombreMes = computed(() => {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  // Maneja tanto el nombre del mes como el índice numérico
  return isNaN(props.cuota.mes) ? props.cuota.mes : meses[parseInt(props.cuota.mes) - 1];
});

// --- Lógica de Cálculos ---

// 1. Calculamos el recargo por mora (10%) si la cuota está vencida
const recargoMora = computed(() => {
  return props.esVencida ? props.cuota.monto * 0.10 : 0;
});

// 2. El subtotal neto es lo que VOS necesitás recibir (Cuota + Mora opcional)
const subtotalNeto = computed(() => {
  return props.cuota.monto + recargoMora.value;
});

// 3. El Total Final es lo que debe pagar el alumno (Inversa: Neto / 0.9381)
const totalFinal = computed(() => {
  return subtotalNeto.value / DIVISOR;
});

// 4. La comisión en pesos que se lleva la plataforma
const comisionMP = computed(() => {
  return totalFinal.value - subtotalNeto.value;
});

// 5. El porcentaje de RECARGO REAL que le aplicamos al neto
// Aunque la tasa de MP sea 6,19%, el recargo aplicado será ~6,60%
const porcentajeRecargoReal = computed(() => {
  if (subtotalNeto.value === 0) return 0;
  // Calculamos la relación entre lo cobrado y lo recibido
  return ((totalFinal.value / subtotalNeto.value) - 1) * 100;
});
</script>

<style scoped>
.resumen-container {
  background: white;
  border-radius: 24px;
  width: 95%;
  max-width: 420px;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.resumen-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.resumen-header i {
  font-size: 2.5rem;
  color: #009ee3; /* Azul Mercado Pago */
  margin-bottom: 0.5rem;
}

.resumen-header h3 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 0;
}

.info-principal {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  border: 1px dashed #cbd5e1;
}

.mes-label {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1e293b;
}

.trabajo-label {
  font-size: 0.9rem;
  color: #64748b;
}

.detalles-lista {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.detalle-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #475569;
}

.con-recargo {
  color: #e11d48;
  font-weight: 500;
}

.divisor {
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
}

.total {
  font-size: 1.25rem !important;
  font-weight: 800;
  color: #0f172a !important;
  padding-top: 0.5rem;
}

.nota-pago {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 1.5rem;
  text-align: center;
  line-height: 1.4;
}

.resumen-footer {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 2rem;
}

.btn-pagar {
  background: #009ee3;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.2s, background 0.2s;
}

.btn-pagar:hover {
  background: #008ad0;
  transform: translateY(-2px);
}

.btn-volver {
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 0.8rem;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-volver:hover {
  background: #f1f5f9;
  color: #1e293b;
}

/* Responsive */
@media (max-width: 480px) {
  .resumen-container {
    padding: 1.5rem;
  }
  .total {
    font-size: 1.15rem !important;
  }
}
.alerta-comision {
  background-color: #f0f7ff;
  border-left: 4px solid #009ee3;
  padding: 1rem;
  margin-top: 1.5rem;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  text-align: left;
}

.alerta-comision i {
  color: #009ee3;
  font-size: 1.1rem;
  margin-top: 2px;
}

.alerta-comision p {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.4;
  color: #334155;
}

.alerta-comision strong {
  color: #0f172a;
}

/* Ajuste a la nota de pago inferior para que no compita visualmente */
.nota-pago {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 1rem;
  text-align: center;
  line-height: 1.4;
}
</style>