<template>
  <div class="contenedor-cuotas">
    
    <!-- 1. Encabezado con información de cuotas -->
    <div class="encabezado-cuotas">
      <Titulo texto="CUOTAS" /> 
      <div class="controles-superiores">
        <div class="estado-cuotas-sutil">
          <div class="info-cuota-sutil">
            <span class="numero-sutil">{{ cuotas.length }}</span>
            <span class="texto-sutil">Total</span>
          </div>
          <div class="separador"></div>
          <div class="info-cuota-sutil">
            <span class="numero-sutil pendiente">{{ cuotasPendientes }}</span>
            <span class="texto-sutil">Pendientes</span>
          </div>
          <div class="separador"></div>
          <div class="info-cuota-sutil">
            <span class="numero-sutil pagada">{{ cuotasPagadas }}</span>
            <span class="texto-sutil">Pagadas</span>
          </div>
        </div>

        <button 
          class="btn-filtrar"
          :class="{ 'activo': mostrarSoloPendientes }"
          @click="toggleFiltroPendientes"
          aria-label="Filtrar cuotas pendientes"
        >
          <i class="fas fa-filter"></i>
          <span class="btn-texto">Solo pendientes</span>
          <span class="btn-badge" v-if="mostrarSoloPendientes">{{ cuotasPendientes }}</span>
        </button>
      </div>
    </div>

    <!-- 
      2. AVISO LATERAL (WIDGET FLOTANTE)
      Condición: Solo se muestra si (mostrarAviso es true) Y (hay cuotas pendientes)
    -->
    <Transition name="fade-aviso">
      <div v-if="mostrarAviso && cuotasPendientes > 0" class="aviso-widget">
        <!-- .stop para evitar propagación de eventos -->
        <button class="btn-cerrar-widget" @click.stop="cerrarAviso">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="contenido-widget">
          <div class="icono-widget">
            <i class="fas fa-info-circle"></i>
          </div>
          <div class="texto-widget-container">
            <p class="titulo-widget">¡Mantente al día!</p>
            <p class="desc-widget">
              Si se vence una cuota se le cobrará un <strong>10% más</strong> del valor de la cuota por pago fuera de término.
              <br><span class="firma-widget">Gracias.</span>
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 3. Tabla con las cuotas -->
    <TablaCuotas 
      :cuotas="cuotasMostradas" 
      :elementos-por-pagina="6"
      :cargando="cargando"
      @PagoExitoso="ProcesarPagoExistoso"
    />
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
  </div>
</template>

<script setup>

// --- VARIABLES PARA EL MODAL DE ÉXITO ---
const mostrarModalExito = ref(false);
const mensajeModalExito = ref('')

import { ref, computed, onMounted } from 'vue'
import TablaCuotas from '../Tablas y Filas/TablaCuotas/TablaCuotas.vue'
import Titulo from '../Titulo.vue'
import { obtenerMisCuotas } from '@/api/services/cuotasService.js'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const cuotas = ref([])
const cargando = ref(true) 
const mostrarSoloPendientes = ref(false)

// --- LÓGICA DEL AVISO ---
const mostrarAviso = ref(true);

const cerrarAviso = () => {
  mostrarAviso.value = false;
}
// ------------------------
// --- LÓGICA DE PAGO EXITOSO ---
const ProcesarPagoExistoso = (cuotaPagada) => {

  // 1. Configuramos el mensaje del modal
  mensajeModalExito.value = `La cuota del mes ${cuotaPagada.mes} fue pagada correctamente.`;
  // 2. Mostramos el modal
  mostrarModalExito.value = true;
}

// --- HANDLER AL CERRAR EL MODAL DE ÉXITO ---
const handleContinuarExito = async () => {
  // 1. Cerramos el modal
  mostrarModalExito.value = false;
  
  // 2. Recargamos los datos (Simula el "volver a montar" o refrescar)
  await cargarDatosCuotas();
}

// --- FUNCION REUTILIZABLE PARA CARGAR DATOS ---
const cargarDatosCuotas = async () => {
  cargando.value = true;
  // await sleep(500); // Opcional: si quieres mantener el delay simulado
  try {
    cuotas.value = await obtenerMisCuotas();
  } catch (error) {
    console.error("Error cargando cuotas:", error);
  } finally {
    cargando.value = false;
  }
};

// --- CICLO DE VIDA ---
onMounted(async () => {
  await cargarDatosCuotas();
});

const cuotasPendientes = computed(() => 
  cuotas.value.filter(cuota => !cuota.pagada).length
)

const cuotasPagadas = computed(() => 
  cuotas.value.filter(cuota => cuota.pagada).length
)

const cuotasMostradas = computed(() => 
  mostrarSoloPendientes.value 
    ? cuotas.value.filter(cuota => !cuota.pagada)
    : cuotas.value
)

const toggleFiltroPendientes = () => {
  mostrarSoloPendientes.value = !mostrarSoloPendientes.value
}
</script>

<style scoped>
.contenedor-cuotas {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
  
  /* Necesario para el absolute del widget en PC */
  position: relative; 
}

/* ================================================= */
/* ===       ESTILOS DEL WIDGET (AVISO)          === */
/* ================================================= */

.aviso-widget {
  /* --- ESTILO BASE (PC) --- */
  position: absolute;
  top: 2rem;       
  left: 2rem;       
  
  /* CAMBIO: Más ancho para ocupar el espacio horizontal disponible */
  width: 320px;    
  
  background: white;
  
  /* Borde izquierdo naranja elegante */
  border-left: 5px solid #FF9800; 
  
  /* Bordes redondeados más suaves */
  border-radius: 12px;
  border-top-left-radius: 4px; 
  border-bottom-left-radius: 4px;

  padding: 1.5rem;
  
  /* Sombra suave y difusa */
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  border: 1px solid rgba(0,0,0,0.05);
  
  z-index: 50;
  font-family: 'Poppins', sans-serif;
  
  /* --- EFECTO FLOTANTE --- */
  /* Animación suave de subida y bajada */
  animation: float 5s ease-in-out infinite;
}

/* Animación de flotación */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); } /* Flota hacia arriba */
  100% { transform: translateY(0px); }
}

/* Botón cerrar */
.btn-cerrar-widget {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: #bbb;
  cursor: pointer;
  padding: 8px; /* Área de toque aumentada */
  font-size: 1.1rem;
  line-height: 1;
  z-index: 60; /* Z-index alto para asegurar click */
  transition: color 0.2s;
}
.btn-cerrar-widget:hover { color: #d32f2f; }

/* Contenido */
.contenido-widget {
  display: flex;
  flex-direction: row; /* Horizontal en PC */
  align-items: center; /* <--- CENTRADO VERTICAL (PC) */
  text-align: left;
  gap: 1rem;
}

.icono-widget {
  flex-shrink: 0; /* Evita que el icono se aplaste */
}

.icono-widget i {
  font-size: 2.2rem;
  color: #FF9800;
  /* Sombra sutil al icono */
  text-shadow: 0 4px 10px rgba(255, 152, 0, 0.3);
}

.titulo-widget {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.4rem 0;
  letter-spacing: -0.3px;
}

.desc-widget {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}
.desc-widget strong { 
  color: #e50914; 
  font-weight: 600;
}

.firma-widget {
  display: block;
  margin-top: 0.5rem;
  font-style: italic;
  font-weight: 500;
  color: #999;
  font-size: 0.8rem;
}

/* Animación de entrada */
.fade-aviso-enter-active, .fade-aviso-leave-active { transition: opacity 0.4s, transform 0.4s; }
.fade-aviso-enter-from, .fade-aviso-leave-to { opacity: 0; transform: translateY(10px); }

/* ================================================= */
/* ===    RESPONSIVE DEL WIDGET (ADAPTADO)       === */
/* ================================================= */

/* Breakpoint Intermedio: Cuando ya no cabe a la izquierda */
@media (max-width: 1400px) {
  .aviso-widget {
    position: relative; 
    top: auto; left: auto;
    width: 100%;       
    max-width: 700px;
    margin: 0 auto 2rem auto; 
    
    /* Mantenemos estilo limpio */
    padding: 1rem 1.5rem;
    padding-right: 2.5rem;
    
    /* En tablet/laptop pequeña quitamos flotación para no distraer */
    animation: none; 
  }
}

/* Móvil (Celulares): Diseño Limpio y Blanco (Consistente con PC) */
@media (max-width: 768px) {
  .aviso-widget {
    position: relative;
    top: auto; left: auto;
    width: 100%;
    margin: 1.5rem 0;
    
    /* CAMBIO: Fondo Blanco limpio igual que en PC */
    background: #ffffff; 
    
    /* Mantenemos el borde izquierdo */
    border: none;
    border-left: 4px solid #FF9800; 
    
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08); 
    
    padding: 1.2rem;
    padding-right: 2.5rem; /* Espacio para la X */
    animation: none; /* Sin flotar en móvil */
  }

  .contenido-widget {
    /* En móvil mantenemos layout horizontal */
    flex-direction: row; 
    align-items: center; /* <--- CENTRADO VERTICAL (MOVIL) */
    gap: 1rem;
  }
  
  .icono-widget i {
    font-size: 1.8rem;
    margin-top: 0; /* Aseguramos que no haya margen superior que desalinee */
  }

  .btn-cerrar-widget {
    top: 5px;
    right: 5px;
    padding: 10px; /* Touch area grande */
    color: #ccc;
  }
}

/* ================================================= */
/* ===           ESTILOS DEL RESTO               === */
/* ================================================= */

.encabezado-cuotas {
  text-align: center;
  margin-bottom: 2rem;
}

.controles-superiores {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.estado-cuotas-sutil {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 12px;
  padding: 0.8rem 1.5rem;
  border: 1px solid #e9ecef;
  flex: 1;
}

.info-cuota-sutil {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  flex: 1;
}

.numero-sutil {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 0.3rem;
}
.numero-sutil.pendiente { color: #ff4d4d; }
.numero-sutil.pagada { color: #4caf50; }

.texto-sutil {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.separador {
  width: 1px;
  height: 30px;
  background: linear-gradient(to bottom, transparent 0%, #dee2e6 50%, transparent 100%);
  margin: 0 0.5rem;
}

/* ================================================= */
/* ===    ESTILO MINIMALISTA BOTÓN FILTRAR       === */
/* ================================================= */

.btn-filtrar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.2rem;
  /* Neutro por defecto */
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #495057;
  white-space: nowrap;
  position: relative;
}

.btn-filtrar i {
  font-size: 0.85rem;
  color: #adb5bd;
}

.btn-filtrar:hover {
  background: #f8f9fa;
  border-color: #ced4da;
}

/* Estado Activo: Rojo institucional */
.btn-filtrar.activo {
  border-color: #D32F2F;
  background: #fff5f5;
  color: #D32F2F;
}

.btn-filtrar.activo i {
  color: #D32F2F;
}

.btn-texto { font-size: 0.85rem; }

.btn-badge {
  background: #D32F2F;
  color: white;
  border-radius: 4px;
  padding: 0.1rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 0.3rem;
  box-shadow: 0 2px 4px rgba(211, 47, 47, 0.2);
}

/* ================================================= */
/* ===                RESPONSIVE                 === */
/* ================================================= */

@media (max-width: 768px) {
  .contenedor-cuotas { padding: 1.5rem; }
  .controles-superiores { flex-direction: column; gap: 1rem; }
  .estado-cuotas-sutil { width: 100%; }
  
  /* Mantener el botón centrado y con ancho contenido en móvil */
  .btn-filtrar { 
    width: auto; 
    min-width: 200px;
    justify-content: center; 
  }
}

@media (max-width: 480px) {
  .contenedor-cuotas { padding: 1rem; }
  .estado-cuotas-sutil { padding: 0.6rem 1rem; }
}
</style>