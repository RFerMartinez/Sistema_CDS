<template>
  <tr v-if="!isMobile" class="fila-cuota desktop-view">
    <td class="col-mes-anio">
      <div class="mes-anio-container">
        <span class="mes-td">{{ obtenerNombreMes(cuota.mes) }}</span>
        <span class="anio-td">{{ cuota.anio }}</span>
      </div>
    </td>
    <td class="col-trabajo-suscripcion">
      <div class="trabajo-suscripcion-container">
        <div class="trabajo">{{ cuota.trabajo }}</div>
        <div class="suscripcion">{{ cuota.suscripcion }}</div>
      </div>
    </td>
    <td class="col-monto">
      <div class="monto-container">
        <span>${{ cuota.monto.toLocaleString('es-AR') }}</span>
        <span v-if="esPendiente && estaVencida" class="aumento-vencimiento-desktop">
          + 10%
        </span>
      </div>
    </td>
    <td class="col-accion">
      <div class="accion-container">
        <BotonAccion
          :pagada="cuota.pagada"
          :modo="modo"
          @accion-click="manejarAccionPrincipal"
        />
      </div>
    </td>
    <td class="col-estado">
      <div class="estado-container">
        <Estado :positivo="cuota.pagada" :texto="cuota.pagada ? 'PAGADA' : 'PENDIENTE'" />
        <div v-if="esPendiente" class="info-vencimiento" :class="claseVencimiento">
            <i v-if="estaPorVencer && !estaVencida" class="fas fa-exclamation-triangle warning-icon"></i>
            <span>{{ textoVencimiento }}</span>
        </div>
      </div>
    </td>
    <td v-if="modo === 'infoAlumno'" class="col-adicional">
      <div class="botones-adicionales">
        <button class="boton-modificar" @click="manejarModificar">
          Modificar
        </button>
        <button class="boton-eliminar" @click="manejarEliminar">
          Eliminar
        </button>
      </div>
    </td>
  </tr>

  <div v-else class="cuota-card mobile-view" :class="{ 'expandida': expandida, 'pagada': cuota.pagada, 'vencida': esPendiente && estaVencida, 'por-vencer': esPendiente && estaPorVencer }">
    <div class="card-header" @click="toggleExpandida">
      <div class="mes-anio">
        <div class="mes-anio-texto">
            <span class="mes">{{ obtenerNombreMes(cuota.mes) }}</span>
            <span class="anio">{{ cuota.anio }}</span>
        </div>
        <span v-if="esPendiente" class="vencimiento-icono-header">
            <i v-if="estaVencida" class="fas fa-calendar-times vencida-icon" title="Cuota Vencida"></i>
            <i v-else-if="estaPorVencer" class="fas fa-exclamation-triangle por-vencer-icon" title="Cuota por Vencer"></i>
        </span>
      </div>
      <div class="monto-estado">
        <span class="monto">${{ cuota.monto.toLocaleString('es-AR') }}</span>
        <Estado :positivo="cuota.pagada" :texto="cuota.pagada ? 'PAGADA' : 'PENDIENTE'" />
      </div>

      <div class="expand-icon">
        <i :class="expandida ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
      </div>
    </div>

    <transition name="slide" mode="out-in">
      <div v-if="expandida" class="card-details">
        <div class="detail-row first-detail">
          <span class="detail-label">Trabajo:</span>
          <span class="detail-value">{{ cuota.trabajo }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Suscripción:</span>
          <span class="detail-value">{{ cuota.suscripcion }}</span>
        </div>

        <div v-if="esPendiente" class="detail-row info-vencimiento-mobile" :class="claseVencimiento">
          <span class="detail-label">Vencimiento:</span>
          <span class="detail-value">
              <i v-if="estaPorVencer && !estaVencida" class="fas fa-exclamation-triangle warning-icon"></i>
              {{ textoVencimiento }}
          </span>
        </div>

        <div v-if="esPendiente && estaVencida" class="detail-row aumento-vencimiento-mobile">
            <span class="detail-label aumento-label">Aumento Vencimiento:</span>
            <span class="detail-value aumento-value">+ 10%</span>
        </div>

        <div class="action-container">
          <BotonAccion
            :pagada="cuota.pagada"
            :modo="modo"
            :is-mobile="true"
            @accion-click="manejarAccionPrincipal"
          />
        </div>
        <div v-if="modo === 'infoAlumno'" class="botones-adicionales-mobile">
          <button class="boton-modificar" @click="manejarModificar">
            Modificar
          </button>
          <button class="boton-eliminar" @click="manejarEliminar">
            Eliminar
          </button>
        </div>
      </div>
    </transition>
  </div>

  <Teleport to="body">
    <div v-if="mostrarModalQR" class="modal-overlay" @click.self="cerrarQR">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Escaneá para Pagar</h3>
          <button class="close-btn" @click="cerrarQR">&times;</button>
        </div>
        
        <p class="modal-subtitle">
          Cuota: {{ obtenerNombreMes(cuota.mes) }} - {{ cuota.trabajo }}
        </p>
        
        <div class="qr-wrapper">
          <qrcode-vue :value="urlPagoQR" :size="220" level="H" render-as="svg" />
        </div>
  
        <p class="instruccion">
          Abrí la App de Mercado Pago y escaneá este código.
        </p>
        
        <div class="modal-actions">
          <a :href="urlPagoQR" class="btn-link-directo" target="_blank">
            O pagá con este link directo
          </a>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- MODAL DE CONFIRMACIÓN DE PAGO -->
  <!-- AQUI AGREGUE TELEPORT PARA QUE SE MUESTRE EN TODA LA PANTALLA -->
  <Teleport to="body">
    <Transition name="modal-fade">
        <div v-if="mostrarModalConfirmacion" class="modal-overlay">
          <!-- Cambié el estilo del borde a verde/azul (o neutral) en lugar de rojo, ya que es un pago -->
          <div class="modal-confirmacion" style="border-top: 5px solid #4CAF50;"> 
            <div class="modal-header">
              <!-- Icono de billete o check en vez de alerta -->
              <i class="fas fa-money-bill-wave" style="color: #4CAF50;"></i>
              <h3>Confirmar Pago</h3>
            </div>
            <div class="modal-body"><p>{{ mensajeModalConfirmacion }}</p></div>
            <div class="modal-footer">
              <button class="btn-modal btn-cancelar-modal" @click="mostrarModalConfirmacion = false">Cancelar</button>
              <!-- Botón de confirmar acción -->
              <button class="btn-modal" style="background-color: #4CAF50; color: white;" @click="confirmarPago">Sí, Confirmar</button>
            </div>
          </div>
        </div>
      </Transition>
  </Teleport>
  <ModalMetodoPago 
    v-if="mostrarModalMetodo"
    :mes-nombre="obtenerNombreMes(cuota.mes)"
    @cancelar="mostrarModalMetodo = false"
    @confirmar="abrirConfirmacionFinal"
  />
  <ModalResumenPago 
    v-if="mostrarResumenPago"
    :cuota="cuota"
    :esVencida="estaVencida"
    @cancelar="mostrarResumenPago = false"
    @confirmar="procederAlPagoMercadoPago"
  />
</template>
<script setup>
import QrcodeVue from 'qrcode.vue';
import pagosService from '@/api/services/pagosService';
import { verComprobante, marcarPagadaAdmin, iniciarPago } from '@/api/services/pagosService'; // Asegúrate de importar iniciarPago si se usa
import { ref, computed } from 'vue';
import BotonAccion from './BotonAccion.vue';
import Estado from '../../Estado.vue';
import ModalMetodoPago from './ModalMetodoPago.vue'; // Ajusta la ruta
import ModalResumenPago from './ModalResumenPago.vue';
const mostrarModalMetodo = ref(false);
const metodoSeleccionadoFinal = ref('');
const props = defineProps({
  cuota: Object,
  isMobile: Boolean,
  modo: {
    type: String,
    default: 'cuota'
  }
});

const emit = defineEmits(['accion-principal', 'modificar', 'eliminar','PagoExitoso', 'pago-realizado']);

// --- REFS PARA MODAL QR ---
const mostrarModalQR = ref(false);
const urlPagoQR = ref('');

// --- REFS PARA MODAL CONFIRMACIÓN ---
const mostrarModalConfirmacion = ref(false);
const mensajeModalConfirmacion = ref('');

const expandida = ref(false);

const toggleExpandida = () => {
  expandida.value = !expandida.value;
};

const obtenerNombreMes = (mes) => {
  const mesNum = parseInt(mes);
  if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) return mes;
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return meses[mesNum - 1];
};

// Computadas para Vencimiento
const esPendiente = computed(() => !props.cuota.pagada);
const fechaVencimiento = computed(() => {
    if (!props.cuota.vencimiento) return null;
    try {
        const parts = props.cuota.vencimiento.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0]);
            const monthIndex = parseInt(parts[1]) - 1; 
            const day = parseInt(parts[2]);
            return new Date(Date.UTC(year, monthIndex, day));
        }
    } catch (e) { console.error("Error parsing date:", props.cuota.vencimiento, e); }
    return null;
});
const diasRestantes = computed(() => {
    if (!fechaVencimiento.value) return Infinity; 
    const hoy = new Date();
    const hoyUTC = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()));
    const diffTime = fechaVencimiento.value.getTime() - hoyUTC.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});
const estaVencida = computed(() => diasRestantes.value < 0);
const estaPorVencer = computed(() => diasRestantes.value >= 0 && diasRestantes.value <= 5);
const textoVencimiento = computed(() => {
    if (!fechaVencimiento.value) return '';
    const dias = diasRestantes.value;
    const fechaFormatoLocal = fechaVencimiento.value.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }); 
    if (estaVencida.value) { return `Venció el ${fechaFormatoLocal}`; }
    else if (dias === 0) { return 'Vence hoy'; }
    else if (dias === 1) { return 'Vence mañana'; }
    else if (estaPorVencer.value) { return `Vence en ${dias} días (${fechaFormatoLocal})`; }
    else { return `Vence el ${fechaFormatoLocal}`; }
});
const claseVencimiento = computed(() => {
    if (estaVencida.value) return 'vencida';
    if (estaPorVencer.value) return 'por-vencer';
    return '';
});

const procesandoPago = ref(false);
let intervaloPolling = null;

//Modal de resumen de cuota

// 2. Crear el ref para controlar la visibilidad
const mostrarResumenPago = ref(false);

// 3. Crear una función para abrir el resumen
const abrirResumenDePago = () => {
  mostrarResumenPago.value = true;
};
//Modal de resumen de cuota

const procederAlPagoMercadoPago = async (montoFinal) => {
  mostrarResumenPago.value = false;
  
  // Aquí llamaremos luego a la lógica de Mercado Pago
    try {
      procesandoPago.value = true;
      const data = await pagosService.iniciarPago(props.cuota.idCuota, montoFinal);
      const urlPago = data.init_point; 
      
      if (urlPago) {
        urlPagoQR.value = urlPago;
        mostrarModalQR.value = true;
        iniciarPollingDePago(); 
      } else {
        alert('Error: No se recibió URL de pago.');
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un error al intentar iniciar el pago.');
    } finally {
      procesandoPago.value = false;
    }
};





// --- MANEJO DE ACCIONES ---
const manejarAccionPrincipal = async () => {
  // === MODO ALUMNO ===
  if (props.modo === 'cuota') {
    if (props.cuota.pagada) {
      try {
        procesandoPago.value = true;
        await verComprobante(props.cuota.idCuota);
      } catch (e) {
        console.error('Error al ver comprobante:', e);
      } finally {
        procesandoPago.value = false;
      }
      return;
    }
    abrirResumenDePago();
    // Iniciar pago con MercadoPago

  } else { 
    // === MODO ADMIN ===
    
    // CASO A: Ya está pagada -> El Admin quiere ver el comprobante
    if (props.cuota.pagada) {
      try {
        await verComprobante(props.cuota.idCuota);
      } catch (e) {
        console.error(e);
        alert('No se pudo generar el comprobante.');
      }
      return;
    }

    mostrarModalMetodo.value = true;
    // CASO B: No está pagada -> El Admin quiere marcarla como PAGADA
    // AQUÍ ES DONDE LLAMAMOS AL MODAL EN VEZ DEL CONFIRM NATIVO
    //mensajeModalConfirmacion.value = `¿Estás seguro que deseas marcar como pagada la cuota de  #${props.cuota.mes}?`;
    //mostrarModalConfirmacion.value = true;
  }
};




// Se ejecuta cuando elegís Efectivo/Transf. en el primer modal
const abrirConfirmacionFinal = (metodo) => {

  // -----------ACA ESTE EL METODO DE PAGO SELECCIONADO-----------


  metodoSeleccionadoFinal.value = metodo; // ACA ESTA EL METODO SELECCIONADOO (Efect o tranf)


  //---------------------------------------------------------------------------------------
  mostrarModalMetodo.value = false;       // Cerramos el selector
  
  // PASO 2: Abrir el modal de confirmación que ya tenías
  mensajeModalConfirmacion.value = `¿Estás seguro que deseas marcar como pagada (en ${metodo}) la cuota de #${props.cuota.mes}?`;
  mostrarModalConfirmacion.value = true;
};







//Tu función confirmarPago (el paso final)
const confirmarPago = async () => {
  mostrarModalConfirmacion.value = false;

  try {
    procesandoPago.value = true;
    
    // Aquí es donde en el futuro enviaremos metodoSeleccionadoFinal.value a la API
    
    await marcarPagadaAdmin(props.cuota.idCuota, metodoSeleccionadoFinal.value);

    emit('PagoExitoso', props.cuota); 
    
  } catch (error) {
    console.error(error);
    alert('Error al registrar el pago manual.');
  } finally {
    procesandoPago.value = false;
  }
};

// --- FUNCIONES DE POLLING (QR) ---
const iniciarPollingDePago = () => {
  intervaloPolling = setInterval(async () => {
    const estaPagada = await pagosService.verificarEstadoPago(props.cuota.idCuota);
    
    if (estaPagada) {
      detenerPolling();
      cerrarQR();
      emit('PagoExitoso', props.cuota);
    }
  }, 1500);
};

const detenerPolling = () => {
  if (intervaloPolling) {
    clearInterval(intervaloPolling);
    intervaloPolling = null;
  }
};

const cerrarQR = () => {
  mostrarModalQR.value = false;
  urlPagoQR.value = '';
  detenerPolling();
};

const manejarModificar = () => {
  emit('modificar', props.cuota);
};
const manejarEliminar = () => {
  emit('eliminar', props.cuota);
};
</script>

<style scoped>
/* Botones Adicionales */
.botones-adicionales {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.botones-adicionales-mobile {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1rem;
  width: 100%;
}
.boton-modificar, .boton-eliminar {
  padding: 6px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
  white-space: nowrap;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  width: 100%;
  max-width: 120px;
  margin: 0 auto;
}
.boton-modificar:hover, .boton-eliminar:hover {
  transform: scale(1.05);
}
.boton-modificar {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #1976d2;
}
.boton-eliminar {
  background: #ffebee;
  color: #d32f2f;
  border: 1px solid #d32f2f;
}
.col-adicional {
  text-align: center;
  width: 10%;
  padding: 0.75rem 0.5rem !important;
}

/* Vencimiento */
.info-vencimiento {
  font-size: 0.8rem;
  margin-top: 0.4rem;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}
.info-vencimiento.por-vencer { color: #ff9800; font-weight: 500; }
.info-vencimiento.vencida { color: #d32f2f; font-weight: 600; }
.warning-icon { font-size: 0.9em; }
.info-vencimiento-mobile .detail-value { display: flex; align-items: center; gap: 0.3rem; color: #6c757d; font-weight: 500; }
.info-vencimiento-mobile.por-vencer .detail-value { color: #ff9800; }
.info-vencimiento-mobile.vencida .detail-value { color: #d32f2f; font-weight: 600; }

/* Iconos Header Móvil */
.mes-anio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}
.mes-anio-texto {
  display: flex;
  flex-direction: column;
}
.vencimiento-icono-header {
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
}
.por-vencer-icon { color: #ff9800; }
.vencida-icon { color: #d32f2f; }

/* Estilos Fila Desktop */
.fila-cuota.desktop-view { height: 70px; border-bottom: 1px solid #eee; font-family: 'Poppins', sans-serif; font-size: 0.95rem; transition: all 0.2s ease; }
.fila-cuota.desktop-view:hover { background-color: #f8fafc; }
.fila-cuota.desktop-view td { vertical-align: middle; padding: 0.75rem 0.5rem; height: 70px; box-sizing: border-box; }
.mes-anio-container, .trabajo-suscripcion-container, .monto-container, .accion-container, .estado-container { display: flex; flex-direction: column; justify-content: center; height: 100%; width: 100%; }
.col-mes-anio { text-align: center; width: 15%; padding: 0.75rem 0.5rem !important; }
.mes-td { font-weight: 700; font-size: 1rem; color: #2c3e50; line-height: 1.2; text-align: center; }
.anio-td { font-size: 0.85rem; color: #718096; margin-top: 0.3rem; line-height: 1.2; text-align: center; }
.col-trabajo-suscripcion { text-align: left; padding: 0.75rem 0.5rem !important; width: 35%; padding-left: 1.5rem !important; }
.trabajo-suscripcion-container { justify-content: center; align-items: flex-start; }
.trabajo { font-weight: 700; font-size: 1rem; color: #2c3e50; line-height: 1.2; text-align: left; width: 100%; }
.suscripcion { font-size: 0.85rem; color: #718096; margin-top: 0.3rem; line-height: 1.2; text-align: left; width: 100%; }
.col-monto { text-align: right; padding: 0.75rem 0.5rem !important; padding-right: 1.5rem !important; width: 15%; }
.monto-container { align-items: flex-end; justify-content: center; text-align: right; font-weight: 600; color: #2c3e50;}
.col-accion { text-align: center; width: 20%; padding: 0.75rem 0.5rem !important; }
.accion-container { align-items: center; justify-content: center; display: flex; }
.col-estado { text-align: center; width: 15%; padding: 0.75rem 0.5rem !important; }
.estado-container { align-items: center; justify-content: center; display: flex; flex-direction: column; }

/* Estilos Card Móvil */
.cuota-card.mobile-view { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden; width: 100%; transition: all 0.3s ease; }
.cuota-card.mobile-view.pagada { opacity: 0.9; border-left: 4px solid #4caf50; }
.cuota-card.mobile-view:not(.pagada) { border-left: 4px solid #ff4d4d; }
.cuota-card.mobile-view.vencida:not(.pagada) { border-left-color: #d32f2f !important; }
.cuota-card.mobile-view.por-vencer:not(.pagada) { border-left-color: #ff9800 !important; }

.card-header { display: flex; justify-content: space-between; align-items: center; padding: 1.2rem; cursor: pointer; width: 100%; box-sizing: border-box; transition: background-color 0.2s ease; }
.card-header:hover { background-color: #f8f9fa; }
.mes { font-weight: 600; font-size: 1.1rem; color: #2c3e50; }
.anio { font-size: 0.9rem; color: #7f8c8d; margin-top: 0.2rem; }
.monto-estado { display: flex; flex-direction: column; align-items: flex-end; margin: 0 1rem; gap: 0.3rem; }
.monto { font-weight: 700; font-size: 1.1rem; color: #2c3e50; }
.expand-icon { color: #95a5a6; font-size: 0.9rem; transition: transform 0.3s ease; }
.cuota-card.mobile-view.expandida .expand-icon { transform: rotate(180deg); }
.slide-enter-active { animation: slideDown 0.4s ease-out; }
.slide-leave-active { animation: slideUp 0.25s ease-in; }
@keyframes slideDown { from { max-height: 0; opacity: 0; transform: translateY(-10px); } to { max-height: 300px; opacity: 1; transform: translateY(0); } } 
@keyframes slideUp { from { max-height: 300px; opacity: 1; transform: translateY(0); } to { max-height: 0; opacity: 0; transform: translateY(-10px); } }
.card-details { padding: 0 1.2rem 1.2rem 1.2rem; width: 100%; box-sizing: border-box; overflow: hidden; }
.detail-row { display: flex; justify-content: space-between; margin-bottom: 1rem; width: 100%; align-items: flex-start; }
.first-detail { margin-top: 1.2rem; }
.detail-label { font-weight: 600; color: #7f8c8d; font-size: 0.9rem; min-width: 80px; }
.detail-value { color: #2c3e50; font-size: 0.9rem; text-align: right; margin-left: 1rem; flex: 1; line-height: 1.4; }
.action-container { display: flex; justify-content: center; margin-top: 1.5rem; width: 100%; }

/* Aumento Vencimiento */
.aumento-vencimiento-desktop {
  font-size: 0.8rem;
  color: #d32f2f;
  font-weight: 500;
  margin-top: 0.3rem;
  line-height: 1;
  display: block;
  text-align: right;
}
.aumento-vencimiento-mobile .aumento-label {
  font-weight: 600;
  color: #d32f2f;
  font-size: 0.9rem;
}
.aumento-vencimiento-mobile .aumento-value {
  color: #d32f2f;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: right;
}

/* Media Queries */
@media (max-width: 768px) {
  .boton-modificar, .boton-eliminar { padding: 8px 14px; font-size: 0.9rem; min-height: 38px; max-width: 140px; }
  .botones-adicionales-mobile { gap: 1rem; }
  .card-header { padding: 1rem; }
  .mes { font-size: 1rem; }
  .monto { font-size: 1rem; }
  .monto-estado { margin: 0 0.8rem; gap: 0.2rem; }
  .card-details { padding: 0 1rem 1rem 1rem; }
  .detail-row { margin-bottom: 0.9rem; }
  .first-detail { margin-top: 1rem; }
  .action-container { margin-top: 1.2rem; }
  .vencimiento-icono-header { font-size: 1rem; }
  .aumento-vencimiento-mobile .aumento-label,
  .aumento-vencimiento-mobile .aumento-value { font-size: 0.85rem; }
}

@media (max-width: 380px) {
  .card-header { padding: 0.8rem; }
  .mes { font-size: 0.95rem; }
  .anio { font-size: 0.8rem; }
  .monto { font-size: 0.95rem; }
  .monto-estado { margin: 0 0.5rem; }
  .card-details { padding: 0 0.8rem 0.8rem 0.8rem; }
  .detail-label, .detail-value { font-size: 0.85rem; }
  .detail-row { margin-bottom: 0.8rem; }
  .first-detail { margin-top: 0.8rem; }
  .action-container { margin-top: 1rem; }
  .vencimiento-icono-header { font-size: 0.9rem; }
  .aumento-vencimiento-mobile .aumento-label,
  .aumento-vencimiento-mobile .aumento-value { font-size: 0.8rem; }
  .aumento-vencimiento-desktop { font-size: 0.75rem; }
}

/* Modales */

.modal-content{
  background: white; padding: 2rem; border-radius: 16px; width: 90%; max-width: 380px;
  text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2); animation: popIn 0.3s ease; position: relative;
}



.close-btn { background: none; border: none; font-size: 1.8rem; color: #95a5a6; cursor: pointer; line-height: 1; padding: 0; position: absolute; right: 1rem; top: 1rem;}

.modal-subtitle { color: #7f8c8d; margin-bottom: 1.5rem; font-size: 0.95rem; }
.qr-wrapper { background: #f8f9fa; padding: 1rem; border-radius: 12px; display: inline-block; margin-bottom: 1.5rem; border: 1px solid #eee; }
.instruccion { font-size: 0.9rem; color: #2c3e50; margin-bottom: 1.5rem; font-weight: 500; }
.btn-link-directo { display: inline-block; padding: 10px 20px; background-color: #009ee3; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 0.9rem; transition: background 0.2s; width: 100%; box-sizing: border-box; }
.btn-link-directo:hover { background-color: #007eb5; }

/* Modal Footer para confirmación */



@keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.modal-footer {
  display: flex;
  justify-content: center; /* <--- ESTO centra los botones */
  align-items: center;
  gap: 1.5rem; /* Espacio entre los botones Cancelar y Confirmar */
  padding-bottom: 1.5rem; /* Un poco de aire abajo si lo necesitas */
  width: 100%;
}
</style>