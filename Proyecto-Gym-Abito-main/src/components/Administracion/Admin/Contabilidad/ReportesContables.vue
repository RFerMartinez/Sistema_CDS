<template>
  <div class="contenedor-reportes">
    <div class="encabezado-contabilidad">
      <Titulo texto="CONTABILIDAD" />
      <p class="subtitulo">Gestión y descarga de reportes históricos</p>
    </div>

    <div class="filtros-container" v-if="!cargando && listaReportes.length > 0">
      <div class="filtro-item">
        <label for="filtro-titular">
          <i class="fas fa-filter"></i> Filtrar por Titular:
        </label>
        <select id="filtro-titular" v-model="titularSeleccionado" class="select-personalizado">
          <option value="todos">Todos los titulares</option>
          <option v-for="titular in titularesUnicos" :key="titular" :value="titular">
            {{ titular }}
          </option>
        </select>
      </div>
      
      <div class="info-resultados">
        <i class="fas fa-list-ol"></i>
        <span>{{ reportesFiltrados.length }} reporte(s) encontrado(s)</span>
      </div>
    </div>

    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <span>Procesando historial de reportes...</span>
    </div>

    <div v-else class="lista-reportes">
      <transition-group name="list-fade">
        <Reporte 
          v-for="reporte in reportesFiltrados" 
          :key="reporte.idFacturacion"
          :reporte="reporte"
          @descargar-reporte="manejarDescarga"
        />
      </transition-group>
      
      <div v-if="reportesFiltrados.length === 0" class="sin-datos-reporte">
        <i class="fas fa-search"></i>
        <p>No se encontraron reportes para el titular seleccionado.</p>
        <button class="btn-limpiar" @click="titularSeleccionado = 'todos'">Ver todos</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Titulo from '../../Titulo.vue';
import Reporte from './Reporte.vue'; // Asegúrate de que la ruta sea correcta

import facturacionService from '@/api/services/facturacionService';

// Estado
const listaReportes = ref([]);
const cargando = ref(true);
const titularSeleccionado = ref('todos');

// 1. EXTRAER TITULARES ÚNICOS PARA EL SELECTOR
const titularesUnicos = computed(() => {
  const titulares = listaReportes.value.map(r => r.titular);
  // Set elimina duplicados, sort() los ordena alfabéticamente
  return [...new Set(titulares)].sort();
});

// 2. LÓGICA DE FILTRADO Y ORDENAMIENTO (MÁS RECIENTE PRIMERO)
const reportesFiltrados = computed(() => {
  let resultado = [...listaReportes.value];
  
  // Filtro por titular
  if (titularSeleccionado.value !== 'todos') {
    resultado = resultado.filter(r => r.titular === titularSeleccionado.value);
  }

  // Ordenar por idFacturacion (de mayor a menor)
  // Esto asegura que el último generado aparezca primero
  return resultado.sort((a, b) => {
    return parseInt(b.idFacturacion) - parseInt(a.idFacturacion);
  });
});

// 3. SIMULACIÓN DE LLAMADA A API
const cargarReportes = async () => {
  cargando.value = true;
  try {
    const response = await facturacionService.obtenerFacturaciones();
    // Asignamos la data real. Axios suele devolver la data en .data
    listaReportes.value = response.data; 
  } catch (error) {
    console.error("Error al cargar reportes:", error);
    // Aquí podrías mostrar una notificación de error si tienes un sistema de alertas
  } finally {
    cargando.value = false;
  }
};

// 4. MANEJO DE DESCARGA
const manejarDescarga = async (id) => {
  try {
    const response = await facturacionService.obtenerReportePdf(id);
    
    // 1. Creamos el Blob especificando que es un PDF
    const file = new Blob([response.data], { type: 'application/pdf' });
    
    // 2. Generamos una URL temporal para ese archivo en memoria
    const fileURL = window.URL.createObjectURL(file);
    
    // 3. Abrimos esa URL en una nueva pestaña ('_blank')
    window.open(fileURL, '_blank');

  } catch (error) {
    console.error("Error al visualizar el PDF:", error);
    alert("Hubo un error al cargar el reporte.");
  }
};

onMounted(cargarReportes);
</script>

<style scoped>
.contenedor-reportes {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
  box-sizing: border-box;
}

.encabezado-contabilidad {
  text-align: center;
  margin-bottom: 2.5rem;
}

.subtitulo {
  color: #666;
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* DISEÑO DE LA BARRA DE FILTROS */
.filtros-container {
  background: white;
  padding: 1.2rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}

.filtro-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filtro-item label {
  font-weight: 700;
  color: #333;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.select-personalizado {
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  background-color: #fcfcfc;
  font-family: 'Poppins', sans-serif;
  color: #444;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 220px;
}

.select-personalizado:focus {
  border-color: #D32F2F;
  background-color: white;
}

.info-resultados {
  font-size: 0.85rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* LISTA */
.lista-reportes {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

/* SPINNER */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem;
  gap: 1rem;
  color: #666;
}

.spinner {
  border: 4px solid rgba(0,0,0,0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-left-color: #D32F2F;
  animation: spin 1s infinite linear;
}

@keyframes spin { 100% { transform: rotate(360deg); } }

/* MENSAJE SIN RESULTADOS */
.sin-datos-reporte {
  text-align: center;
  padding: 5rem 2rem;
  color: #999;
}

.sin-datos-reporte i { font-size: 3rem; margin-bottom: 1.5rem; color: #eee; }

.btn-limpiar {
  background: none;
  border: 1px solid #D32F2F;
  color: #D32F2F;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-limpiar:hover { background: #D32F2F; color: white; }

/* ANIMACIÓN DE LISTA */
.list-fade-enter-active, .list-fade-leave-active { transition: all 0.4s ease; }
.list-fade-enter-from, .list-fade-leave-to { opacity: 0; transform: translateX(-20px); }

/* RESPONSIVE CORREGIDO */
@media (max-width: 768px) {
  .contenedor-reportes { padding: 1rem; }
  
  .filtros-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1.2rem;
    padding: 1.5rem 1rem;
  }

  .filtro-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .select-personalizado {
    width: 100%;
    min-width: 0;
  }

  .info-resultados {
    justify-content: center;
    border-top: 1px solid #eee;
    padding-top: 1rem;
  }
}
</style>