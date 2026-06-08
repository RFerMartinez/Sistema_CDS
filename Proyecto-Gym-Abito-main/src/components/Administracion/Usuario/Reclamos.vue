<template>
  <div class="contenedor-reclamos">
    <div class="encabezado">
      <Titulo texto="Observaciones" />
      <p class="subtitulo">
        Ayúdanos a mejorar<br>
        <span class="aclaracion-anonimo">Las observaciones son anónimos</span>
      </p>
      
    </div>
    <div class="controles-superiores">
      <button 
        v-if="!mostrarFormulario" 
        @click="mostrarFormulario = true"
        class="btn-nuevo"
      >
        <i class="fas fa-plus"></i>
        Nueva Observación
      </button>

      <div class="contador-reclamos" v-if="!mostrarFormulario">
        <span class="numero">{{ reclamos.length }}</span>
        <span class="texto">Total</span>
      </div>
    </div>

    <!-- Componente NuevoReclamo -->
    <NuevoReclamo 
      v-if="mostrarFormulario"
      @guardar="agregarReclamo"
      @cancelar="mostrarFormulario = false"
      class="componente-separado"
    />

    <!-- Componente ListaReclamos mejorado -->
    <ListaReclamos 
      :reclamos="reclamosPaginados" 
      :class="{'con-espacio-superior': mostrarFormulario}"
    />
    
    <!-- Paginación para reclamos -->
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ListaReclamos from './ListaReclamos.vue'
import NuevoReclamo from './NuevoReclamo.vue'
import Titulo from '../Titulo.vue';

// servicios (ferchu)
import { obtenerReclamos, crearReclamo } from '@/api/services/reclamosService';

const reclamos = ref([])
const cargando = ref(true); // <-- estado de carga

const mostrarFormulario = ref(false)
const paginaActual = ref(1)
const elementosPorPagina = ref(5)
const isMobile = ref(false)

// Computed properties para la paginación
const totalPaginas = computed(() => 
  Math.ceil(reclamos.value.length / elementosPorPagina.value)
)

const reclamosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * elementosPorPagina.value
  const fin = inicio + elementosPorPagina.value
  return reclamos.value.slice(inicio, fin)
})

const numerosPaginas = computed(() => {
  const total = totalPaginas.value
  const current = paginaActual.value
  const delta = 1
  
  let range = []
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < total - 1) {
    range.push('...')
  }
  
  range.unshift(1)
  if (total > 1) range.push(total)
  
  return range
})

// Métodos
const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
  // Ajustar elementos por página según el dispositivo
  elementosPorPagina.value = isMobile.value ? 5 : 10
}

// --- Método para agregar el reclamo usando la API ---
const agregarReclamo = async (descripcionReclamo) => {
  try {
    // Llama al servicio para crear el reclamo en el backend
    const nuevoReclamo = await crearReclamo(descripcionReclamo);
    
    // Agrega el nuevo reclamo (devuelto por la API) al inicio de la lista
    reclamos.value.unshift(nuevoReclamo);
    
    mostrarFormulario.value = false;
    paginaActual.value = 1; // Volver a la primera página
  } catch (error) {
    // Aquí podrías mostrar un mensaje de error al usuario
    alert('No se pudo guardar el reclamo porque es muy corto o hubo un problema. Inténtalo de nuevo.');
  }
};

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina !== '...' && nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
    document.querySelector('.contenedor-reclamos').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }
}

// Cargar reclamos desde la API al montar el componente ---
onMounted(async () => {
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
  
  cargando.value = true;
  reclamos.value = await obtenerReclamos();
  cargando.value = false;
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
/*max-width: 1100px;  <-- ELIMINADO */
/*margin: auto;         <-- ELIMINADO */
box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
min-height: 70vh; /* <-- AÑADIDO (para que no sea tan corto) */
overflow-y: auto;
box-sizing: border-box;
}


.controles-superiores {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 1.5rem;
gap: 1rem;
flex-wrap: wrap;
}

.btn-nuevo {
background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
color: white;
border: none;
padding: 0.8rem 1.5rem;
border-radius: 25px;
cursor: pointer;
font-family: 'Poppins', sans-serif;
font-weight: 500;
display: flex;
align-items: center;
gap: 0.5rem;
transition: all 0.3s ease;
box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.btn-nuevo:hover {
transform: translateY(-2px);
box-shadow: 0 6px 16px rgba(66, 185, 131, 0.4);
}

.contador-reclamos {
display: flex;
flex-direction: column;
align-items: center;
background: rgba(248, 249, 250, 0.8);
border-radius: 12px;
padding: 0.6rem 1rem;
border: 1px solid #e9ecef;
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

.componente-separado {
margin-bottom: 1.5rem;
}

.con-espacio-superior {
margin-top: 1rem;
}

/* Paginación inferior */
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

/* Ajustes responsivos */
@media (max-width: 768px) {
.contenedor-reclamos {
padding: 1.5rem;
}

.titulo {
font-size: 1.8rem;
margin-bottom: 1.2rem;
}

.controles-superiores {
flex-direction: column;
gap: 1rem;
}

.btn-nuevo {
width: 100%;
justify-content: center;
padding: 0.7rem 1.2rem;
}

.contador-reclamos {
width: 100%;
flex-direction: row;
justify-content: center;
gap: 0.5rem;
padding: 0.5rem 0.8rem;
}

.contador-reclamos .numero {
font-size: 1.1rem;
}

.contador-reclamos .texto {
font-size: 0.65rem;
}

.paginacion-inferior {
margin-top: 1.5rem;
padding: 1rem;
}

.btn-paginacion {
width: 35px;
height: 35px;
font-size: 0.8rem;
}

.numero-pagina {
width: 30px;
height: 30px;
font-size: 0.8rem;
}
}

@media (max-width: 480px) {
.contenedor-reclamos {
padding: 1rem;
}

.titulo {
font-size: 1.6rem;
}

.btn-nuevo {
padding: 0.6rem 1rem;
font-size: 0.9rem;
}

.contador-reclamos {
padding: 0.4rem 0.6rem;
}

.contador-reclamos .numero {
font-size: 1rem;
}

.contador-reclamos .texto {
font-size: 0.6rem;
}

.paginacion-inferior {
margin-top: 1.2rem;
padding: 0.8rem;
}

.paginacion-controles {
gap: 0.6rem;
}

.btn-paginacion {
width: 32px;
height: 32px;
font-size: 0.75rem;
}

.numero-pagina {
width: 28px;
height: 28px;
font-size: 0.75rem;
}

.numeros-pagina {
gap: 0.3rem;
}
}
.subtitulo {
  color: #666;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  line-height: 1.4; /* Añadido para que las líneas no se peguen */
}

.aclaracion-anonimo {
  font-size: 0.85rem; /* Un poco más pequeña */
  opacity: 0.8;       /* Un poco más sutil */
  display: block;    /* Asegura que el salto de línea se respete */
  margin-top: 5px;   /* Separación respecto a la línea de arriba */
}
.encabezado {
  text-align: center;
  margin-bottom: 2rem;
}
</style>