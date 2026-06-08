<template>
  <div class="reporte-wrapper">
    
    <div v-if="datosReporte" class="reporte-main-card">
      
      <div class="reporte-header">
        
        <div class="total-global-section">
          <div class="icon-global">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="total-info">
            <span class="badge-label">Recaudación Total del Mes</span>
            <span class="badge-monto">{{ formatoMoneda(datosReporte.totalRecaudado) }}</span>
          </div>
        </div>

        <div class="filtros-section">
          <div class="filtro-grupo">
            <label><i class="far fa-calendar-alt"></i> Mes</label>
            <div class="select-wrapper">
              <select v-model="mesSeleccionado" @change="cargarDatos" class="custom-select">
                <option v-for="(mes, index) in meses" :key="index" :value="index + 1">{{ mes }}</option>
              </select>
              <i class="fas fa-chevron-down select-icon"></i>
            </div>
          </div>
          <div class="filtro-grupo">
            <label><i class="far fa-calendar"></i> Año</label>
            <div class="select-wrapper">
              <select v-model="anioSeleccionado" @change="cargarDatos" class="custom-select">
                <option v-for="anio in anios" :key="anio" :value="anio">{{ anio }}</option>
              </select>
              <i class="fas fa-chevron-down select-icon"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="desglose-grid">
        
        <div class="role-card admin-card">
          <div class="role-header">
            <div class="avatar-circle admin-avatar"><i class="fas fa-user-shield"></i></div>
            <div class="role-title">
              <h4>Administrador</h4>
              <span class="badge">Gestión General</span>
            </div>
            <div class="role-total-compact">
              {{ formatoMoneda(datosReporte.desglose.administrador.totalRecaudado) }}
            </div>
          </div>
          
          <div class="metodos-pago-modern">
            <div class="metodo-box box-efectivo">
              <div class="metodo-header">
                <span><i class="fas fa-money-bill-wave"></i> Efectivo</span>
                <strong>{{ formatoMoneda(datosReporte.desglose.administrador.totalEfectivo) }}</strong>
              </div>
              <div class="progress-bar-bg"><div class="progress-fill fill-green" :style="{ width: calcularPorcentaje(datosReporte.desglose.administrador.totalEfectivo, datosReporte.desglose.administrador.totalRecaudado) }"></div></div>
            </div>

            <div class="metodo-box box-transferencia">
              <div class="metodo-header">
                <span><i class="fas fa-qrcode"></i> Transferencia / QR</span>
                <strong>{{ formatoMoneda(datosReporte.desglose.administrador.totalTransferencia) }}</strong>
              </div>
              <div class="progress-bar-bg"><div class="progress-fill fill-blue" :style="{ width: calcularPorcentaje(datosReporte.desglose.administrador.totalTransferencia, datosReporte.desglose.administrador.totalRecaudado) }"></div></div>
            </div>
          </div>
        </div>

        <div 
          v-for="empleado in datosReporte.desglose.empleados" 
          :key="empleado.nombre" 
          class="role-card employee-card"
        >
          <div class="role-header">
            <div class="avatar-circle employee-avatar"><i class="fas fa-user-tie"></i></div>
            <div class="role-title">
              <h4>{{ empleado.nombre }}</h4>
              <span class="badge">Profesor / Empleado</span>
            </div>
            <div class="role-total-compact">
              {{ formatoMoneda(empleado.totalRecaudado) }}
            </div>
          </div>
          
          <div class="metodos-pago-modern">
            <div class="metodo-box box-efectivo">
              <div class="metodo-header">
                <span><i class="fas fa-money-bill-wave"></i> Efectivo</span>
                <strong>{{ formatoMoneda(empleado.totalEfectivo) }}</strong>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-fill fill-green" :style="{ width: calcularPorcentaje(empleado.totalEfectivo, empleado.totalRecaudado) }"></div>
              </div>
            </div>

            <div class="metodo-box box-transferencia">
              <div class="metodo-header">
                <span><i class="fas fa-qrcode"></i> Transferencia / QR</span>
                <strong>{{ formatoMoneda(empleado.totalTransferencia) }}</strong>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-fill fill-blue" :style="{ width: calcularPorcentaje(empleado.totalTransferencia, empleado.totalRecaudado) }"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { obtenerDesgloseGanancia } from '@/api/services/dashboardService';

const formatoMoneda = (valor) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(valor);
};

const calcularPorcentaje = (monto, total) => {
  if (total === 0) return '0%';
  return `${(monto / total) * 100}%`;
};

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const anios = [2024, 2025, 2026, 2027];

const fechaActual = new Date();
const mesSeleccionado = ref(fechaActual.getMonth() + 1);
const anioSeleccionado = ref(fechaActual.getFullYear());

// Estados de la API
const datosReporte = ref(null);
const isLoading = ref(false); // Para mostrar un spinner o deshabilitar selects
const errorMsg = ref('');     // Para manejar errores del backend

const cargarDatos = async () => {
  // 1. Iniciamos el estado de carga
  isLoading.value = true;
  errorMsg.value = '';
  
  try {
    console.log(`Llamando a la API -> Mes: ${mesSeleccionado.value} | Año: ${anioSeleccionado.value}`);
    
    // 2. Llamada real a la API
    const data = await obtenerDesgloseGanancia(mesSeleccionado.value, anioSeleccionado.value);
    
    // 3. Validamos que la respuesta contenga el reporte
    // Recuerda que en nuestro servicio JS retornamos 'null' si falla
    if (data && data.reporte) {
        datosReporte.value = data.reporte;
    } else {
        errorMsg.value = "No se encontraron datos para la fecha seleccionada.";
        datosReporte.value = null;
    }

  } catch (error) {
    // 4. Manejo de Errores inesperados en el componente
    console.error("Error al obtener el reporte de recaudación:", error);
    errorMsg.value = "Hubo un problema al cargar los datos. Intenta nuevamente.";
    datosReporte.value = null; 
  } finally {
    // 5. Finalizamos la carga
    isLoading.value = false;
  }
};

onMounted(() => {
  cargarDatos();
});
</script>

<style scoped>
/* --- Base --- */
.reporte-main-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 5px 25px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

/* --- Cabecera Mejorada --- */
.reporte-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.total-global-section {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.icon-global {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #e6fcf5 0%, #c3fae8 100%);
  color: #12b886;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  box-shadow: 0 4px 10px rgba(18, 184, 134, 0.15);
}

.total-info {
  display: flex;
  flex-direction: column;
}

.badge-label {
  font-size: 0.85rem;
  color: #718096; /* Gris más suave y legible */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

/* AQUÍ MEJORAMOS EL NÚMERO PRINCIPAL */
.badge-monto {
  font-size: 2.2rem;
  font-weight: 700; /* Bajamos el grosor de 800 a 700 */
  color: #2d3748; /* Usamos el gris oscuro elegante del dashboard */
  line-height: 1;
  /* Eliminamos el letter-spacing negativo que los amontonaba */
}

/* --- Filtros --- */
.filtros-section {
  display: flex;
  gap: 1rem;
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.filtro-grupo label {
  font-weight: 600;
  color: #718096;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.custom-select {
  padding: 10px 35px 10px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background-color: #f8fafc;
  color: #2d3748;
  font-weight: 600;
  font-size: 0.95rem;
  appearance: none; 
  cursor: pointer;
  transition: all 0.2s;
  min-width: 140px;
  width: 100%;
}

.custom-select:hover {
  border-color: #cbd5e0;
}

.custom-select:focus {
  border-color: #3182ce;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.15);
}

.select-icon {
  position: absolute;
  right: 12px;
  color: #a0aec0;
  pointer-events: none;
  font-size: 0.8rem;
}

/* --- Separador --- */
.divider {
  height: 1px;
  background: #edf2f7;
  width: 100%;
}

/* --- Desglose (Diseño Moderno) --- */
.desglose-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.role-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.8rem;
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}

.role-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.8rem;
}

.avatar-circle {
  width: 55px;
  height: 55px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.admin-avatar { background: #ebf8ff; color: #3182ce; }
.employee-avatar { background: #faf5ff; color: #805ad5; }

.role-title {
  flex-grow: 1;
}

/* TÍTULOS DE ROLES MÁS SUAVES */
.role-title h4 {
  margin: 0 0 4px 0;
  font-size: 1.15rem;
  color: #2d3748;
  font-weight: 700;
}

.badge {
  font-size: 0.75rem;
  background: #edf2f7;
  padding: 4px 10px;
  border-radius: 20px;
  color: #718096;
  font-weight: 600;
  border: 1px solid #e2e8f0;
}

/* NÚMERO TOTAL DEL ROL */
.role-total-compact {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  background: #f8fafc;
  padding: 8px 15px;
  border-radius: 10px;
  border: 1px solid #edf2f7;
}

/* --- Cajas de Métodos de Pago con Progreso --- */
.metodos-pago-modern {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.metodo-box {
  background: #f8fafc;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  border: 1px solid #edf2f7;
}

/* TEXTOS DE LOS MÉTODOS DE PAGO */
.metodo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
  color: #718096; /* Gris medio para el texto "Efectivo/Transferencia" */
  font-weight: 500;
}

.metodo-header i {
  margin-right: 6px;
  opacity: 0.8;
}

.metodo-header strong {
  font-size: 1.1rem;
  color: #2d3748; /* Gris oscuro elegante para el número */
  font-weight: 700;
}

.progress-bar-bg {
  height: 6px;
  background: #edf2f7;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease-out;
}

.fill-green { background: #48bb78; }
.fill-blue { background: #4299e1; }

/* --- Responsive Móvil --- */
@media (max-width: 1024px) {
  .desglose-grid {
    grid-template-columns: 1fr; 
  }
}

@media (max-width: 600px) {
  .reporte-main-card {
    padding: 1.2rem;
  }
  
  .reporte-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
  
  .total-global-section {
    justify-content: center;
    text-align: center;
    flex-direction: column;
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 16px;
  }

  .badge-monto {
    font-size: 1.8rem;
  }

  .filtros-section {
    width: 100%;
    justify-content: space-between;
  }
  
  .filtro-grupo {
    width: 48%; 
  }

  .custom-select {
    min-width: 100%;
  }

  .role-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .role-total-compact {
    width: 100%;
    text-align: center;
  }
  
  .role-card {
    padding: 1.2rem;
  }
}
</style>