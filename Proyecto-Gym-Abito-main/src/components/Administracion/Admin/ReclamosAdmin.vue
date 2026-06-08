<template>
  <div class="contenedor-reclamos">
    <Titulo texto="ADMINISTRACIÓN DE observaciones" />
    
    <div class="controles-superiores">
      
      <!-- Filtros de Ordenamiento -->
      <div class="grupo-filtros">
        <span class="label-filtro">Ordenar por:</span>
        <button 
          class="btn-filtro" 
          :class="{ 'activo': filtroOrden === 'recientes' }"
          @click="filtroOrden = 'recientes'"
        >
          Más Recientes
        </button>
        <button 
          class="btn-filtro" 
          :class="{ 'activo': filtroOrden === 'antiguos' }"
          @click="filtroOrden = 'antiguos'"
        >
          Más Antiguos
        </button>
      </div>

      <!-- Contador -->
      <div class="contador-reclamos">
        <span class="numero">{{ reclamos.length }}</span>
        <span class="texto">Total</span>
      </div>
    </div>

    <!-- PANTALLA DE CARGA (Estilo ModificarGrupo) -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <span>Cargando observaciones...</span>
    </div>

    <!-- LISTA Y PAGINACIÓN -->
    <div v-else>
      <!-- Componente ListaReclamos reutilizado -->
      <ListaReclamos 
        :reclamos="reclamosPaginados" 
      />
      
      <!-- Paginación (Igual que en Reclamos.vue) -->
      <div class="paginacion-inferior" v-if="totalPaginas > 1">
        <div class="paginacion-controles">
          <button 
            class="btn-paginacion" 
            :disabled="paginaActual === 1"
            @click="cambiarPagina(paginaActual - 1)"
            aria-label="Página anterior"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <div class="numeros-pagina">
            <span 
              v-for="numero in numerosPaginas" 
              :key="numero"
              class="numero-pagina"
              :class="{ 'activa': numero === paginaActual }"
              @click="cambiarPagina(numero)"
            >
              {{ numero }}
            </span>
          </div>
          
          <button 
            class="btn-paginacion" 
            :disabled="paginaActual === totalPaginas"
            @click="cambiarPagina(paginaActual + 1)"
            aria-label="Página siguiente"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ListaReclamos from '../Usuario/ListaReclamos.vue'
import Titulo from '../Titulo.vue';

import { listarTodosReclamos } from '@/api/services/reclamosService';

// Estado
const reclamos = ref([])
const loading = ref(true)
const filtroOrden = ref('recientes') // 'recientes' | 'antiguos'

// Paginación
const paginaActual = ref(1)
const elementosPorPagina = ref(5)
const isMobile = ref(false)

// ========================================================
// ===       SIMULACIÓN DE LLAMADA A LA API             ===
// ========================================================

const cargarReclamosAdmin = async () => {
  loading.value = true;
  
  try {
    const datos = await listarTodosReclamos();
    reclamos.value = datos;
  } catch (error) {
    console.error("Error cargando reclamos:", error);
  } finally {
    loading.value = false;
  }
}

// ========================================================
// ===           LÓGICA DE ORDENAMIENTO                 ===
// ========================================================
const reclamosOrdenados = computed(() => {
  // Creamos una copia para no mutar el original directamente
  const lista = [...reclamos.value];

  return lista.sort((a, b) => {
    // Combinar fecha y hora para comparar correctamente
    // Formato ISO: YYYY-MM-DDTHH:mm:ss
    const fechaA = new Date(`${a.fecha}T${a.hora}`);
    const fechaB = new Date(`${b.fecha}T${b.hora}`);

    if (filtroOrden.value === 'recientes') {
      return fechaB - fechaA; // Descendente
    } else {
      return fechaA - fechaB; // Ascendente
    }
  });
});

// ========================================================
// ===           LÓGICA DE PAGINACIÓN                   ===
// ========================================================
const totalPaginas = computed(() => 
  Math.ceil(reclamosOrdenados.value.length / elementosPorPagina.value)
)

const reclamosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * elementosPorPagina.value
  const fin = inicio + elementosPorPagina.value
  return reclamosOrdenados.value.slice(inicio, fin)
})

const numerosPaginas = computed(() => {
  const total = totalPaginas.value
  const current = paginaActual.value
  const delta = 1
  
  let range = []
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) range.unshift('...')
  if (current + delta < total - 1) range.push('...')
  
  range.unshift(1)
  if (total > 1) range.push(total)
  
  return range
})

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina !== '...' && nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
    // Scroll suave arriba
    const container = document.querySelector('.contenedor-reclamos');
    if(container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Responsive
const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
  elementosPorPagina.value = isMobile.value ? 5 : 8
}

onMounted(() => {
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
  cargarReclamosAdmin();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<style scoped>
.contenedor-reclamos {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 70vh;
  overflow-y: auto;
  box-sizing: border-box;
}

/* --- Controles Superiores (Filtros y Contador) --- */
.controles-superiores {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.grupo-filtros {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 30px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.label-filtro {
  font-size: 0.85rem;
  color: #666;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  font-weight: 500;
}

.btn-filtro {
  border: none;
  background: transparent;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  color: #666;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
}

.btn-filtro:hover {
  background: #f0f0f0;
  color: #333;
}

.btn-filtro.activo {
  background: #e91e63;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(233, 30, 99, 0.3);
}

.contador-reclamos {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 12px;
  padding: 0.6rem 1rem;
  border: 1px solid #e9ecef;
  min-width: 80px;
}

.contador-reclamos .numero {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Poppins', sans-serif;
}

.contador-reclamos .texto {
  font-size: 0.7rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* --- Loading Container (Igual a ModificarGrupo) --- */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
  color: #666;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #dc3545; 
  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* --- Paginación --- */
.paginacion-inferior {
  margin-top: 2rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  border: 1px solid #dee2e6;
  display: flex;
  justify-content: center;
  align-items: center;
}

.paginacion-controles {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.btn-paginacion {
  width: 40px;
  height: 40px;
  border: 2px solid #e91e63;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #e91e63;
  font-size: 0.9rem;
}

.btn-paginacion:hover:not(:disabled) {
  background: #e91e63;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
}

.btn-paginacion:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #ccc;
  color: #ccc;
}

.numeros-pagina {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.numero-pagina {
  width: 35px;
  height: 35px;
  border: 2px solid #dee2e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #6c757d;
  font-size: 0.85rem;
}

.numero-pagina:hover {
  border-color: #e91e63;
  color: #e91e63;
  transform: scale(1.05);
}

.numero-pagina.activa {
  background: #e91e63;
  border-color: #e91e63;
  color: white;
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 768px) {
  .contenedor-reclamos { padding: 1.5rem; }
  
  .controles-superiores {
    flex-direction: column-reverse; /* Poner filtros abajo del contador en móvil si se desea, o normal */
    gap: 1rem;
    align-items: stretch;
  }

  .grupo-filtros {
    justify-content: center;
    flex-wrap: wrap;
  }

  .contador-reclamos {
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .contador-reclamos .numero { font-size: 1.1rem; }
  .contador-reclamos .texto { font-size: 0.65rem; }
}

@media (max-width: 480px) {
  .contenedor-reclamos { padding: 1rem; }
  
  .btn-filtro {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .label-filtro {
    display: none; /* Ahorrar espacio en móviles muy chicos */
  }
}
</style>