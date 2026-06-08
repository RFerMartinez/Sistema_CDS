<template>
  <div class="contenedor">
    <div class="dashboard-admin-container">
      
      <DashboardSection 
        v-if="!(props.nombre === 'Davor' && props.apellido === 'Cristoff')" 
        title="Indicadores Clave"
      >
        <KpiList :kpis="kpiData" />
      </DashboardSection>

      <div class="dashboard-grid">
        
        <DashboardSection title="Alumnos por Metodología">
          <DonutChart
              :chart-data="alumnosPorMetodologiaData"
              :chart-options="donutChartOptions"
              chart-title="Distribución por Metodología"
              height="300px"
          />
        </DashboardSection>

        <DashboardSection title="Alumnos por Turno Mensual">
          <BarChart
            :chart-data="alumnosPorTurnoMesData"
            :chart-options="stackedBarChartOptions"
            chart-title="Alumnos por Turno Mensual"
            height="300px"
          />
        </DashboardSection>

        <DashboardSection title="Ocupación y Asistencia" class="grid-span-2">
          <OccupancyGrid
            :occupancy-data="datosOcupacion"
            :loading="loadingOcupacion"
            :error="errorOcupacion"
          />
        </DashboardSection>

      </div> <DashboardSection title="Rendimiento del Staff" class="staff-section">
        <div class="trainers-grid"> <TrainerCard 
            v-for="entrenador in staffStats" 
            :key="entrenador.dni"
            :entrenador="entrenador"
          />
          
          <div v-if="staffStats.length === 0" class="no-data-message">
            No hay datos de entrenadores disponibles.
          </div>
        </div>
      </DashboardSection>
      <div style="margin-top: 1.5rem; margin-bottom: 2rem;">
        <DashboardSection 
        v-if="!(props.nombre === 'Davor' && props.apellido === 'Cristoff')"
        title="Historial de Ingresos"
        >
          <ReporteRecaudacion />
        </DashboardSection>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// --- Componentes Visuales ---
import KpiList from '@/components/DashBoard/KPIs/KpiList.vue';
import OccupancyGrid from '@/components/DashBoard/Charts/OccupancyGrid.vue';
import DonutChart from '@/components/DashBoard/Charts/DonutChart.vue';
import BarChart from '@/components/DashBoard/Charts/BarChart.vue';
import TrainerCard from '@/components/DashBoard/KPIs/TrainerCard.vue';
import ReporteRecaudacion from '@/components/DashBoard/KPIs/ReporteRecaudacion.vue';

const props = defineProps({
  nombre: {
    type: String,
    default: ''
  },
  apellido: {
    type: String,
    default: ''
  }
});
// --- Servicios ---
import { 
  obtenerHorariosCompletos, 
  obtenerOcupacionTotal, 
  obtenerKPIs,
  obtenerAlumnosPorTurno,
  obtenerRendimientoStaff
} from '@/api/services/dashboardService';

// --- Utilidades ---
const formatoMoneda = (valor) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(valor);
};

// ==========================================
// 1. ESTADO DE KPIS (Indicadores)
// ==========================================
const kpiData = ref([]);
const staffStats = ref([]);

// ==========================================
// 2. GRÁFICO DE BARRAS APILADAS (Turnos)
// ==========================================
const alumnosPorTurnoMesData = ref({
  labels: [],
  datasets: []
});

const stackedBarChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
    tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
            footer: (tooltipItems) => {
                let sum = 0;
                tooltipItems.forEach(function(tooltipItem) {
                    sum += tooltipItem.parsed.y;
                });
                return 'Total: ' + sum;
            },
        },
    }
  },
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: { stacked: true, beginAtZero: true, grid: { color: '#e9ecef' } }
  }
});

// ==========================================
// 3. GRÁFICO DE TORTA (Metodologías)
// ==========================================
const alumnosPorMetodologiaData = ref({
  labels: [],
  datasets: [{ backgroundColor: [], data: [] }]
});
const datosMetodologiaEjemplo = ref([]); // Variable para raw data

const donutChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
       callbacks: {
          label: function(context) {
              let label = context.label || '';
              if (label) label += ': ';
              if (context.parsed !== null) {
                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.parsed / total) * 100).toFixed(1) + '%';
                  label += `${context.parsed} (${percentage})`;
              }
              return label;
          }
      }
    }
  }
});

const procesarDatosMetodologia = (rawData) => {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    alumnosPorMetodologiaData.value = { labels: [], datasets: [{ data: [] }] };
    return;
  }

  const labels = [];
  const data = [];

  rawData.forEach(item => {
    if (item.data && Array.isArray(item.data) && item.data.length > 0) {
      const info = item.data.find(d => d.nombre && typeof d.cantidad === 'number');
      if (info) {
            labels.push(info.nombre);
            data.push(info.cantidad);
        }
    }
  });

  const backgroundColors = [
    '#E74C3C', '#2ECC71', '#F1C40F', '#3498DB', '#9B59B6',
    '#34495E', '#1ABC9C', '#E67E22', '#BDC3C7', '#7F8C8D'
  ];

  alumnosPorMetodologiaData.value = {
    labels: labels,
    datasets: [{
        backgroundColor: backgroundColors.slice(0, labels.length),
        data: data
      }]
  };
};

// ==========================================
// 4. OCUPACIÓN Y ASISTENCIA
// ==========================================
const datosOcupacion = ref([]);
const loadingOcupacion = ref(true);
const errorOcupacion = ref(false);


// ==========================================
// LÓGICA DE CARGA GENERAL
// ==========================================
const cargarDatosDashboard = async () => {
  
  // --- A) Cargar KPIs ---
  try {
    const kpiResponse = await obtenerKPIs();
    
    // Formateamos "Cant | $Monto" para las cuotas vencidas
    const textoVencidas = `${kpiResponse.cuotas_vencidas} | ${formatoMoneda(kpiResponse.monto_cuotas_vencidas)}`;

    kpiData.value = [
      { 
        title: 'Alumnos Activos', 
        value: kpiResponse.alumnos_activos.toString(), 
        icon: 'fas fa-users', 
        color: 'info' 
      },
      { 
        title: 'Cuotas Vencidas', 
        value: textoVencidas, 
        icon: 'fas fa-exclamation-circle', 
        color: 'danger' 
      },
      { 
        title: 'Ingreso Mensual (cobrado)', 
        value: formatoMoneda(kpiResponse.cantidad_cobrado), 
        icon: 'fas fa-dollar-sign', 
        color: 'success' 
      },
      { 
        title: 'Efectividad de Cobro', 
        value: `${kpiResponse.porcentaje_cobro}%`, 
        icon: 'fas fa-chart-pie', 
        color: 'warning' 
      },
    ];
    console.log('KPIs cargados');
  } catch (error) {
    console.error("Error KPIs:", error);
    // Datos vacíos en caso de error para no romper la UI
    kpiData.value = [
      { title: 'Alumnos Activos', value: '-', icon: 'fas fa-users', color: 'info' },
      { title: 'Cuotas Vencidas', value: '-', icon: 'fas fa-exclamation-circle', color: 'danger' },
      { title: 'Ingreso Mensual', value: '-', icon: 'fas fa-dollar-sign', color: 'success' },
      { title: 'Efectividad', value: '-', icon: 'fas fa-chart-pie', color: 'warning' },
    ];
  }

  // --- B) Cargar Gráfico de Barras (Turnos) ---
  try {
    const turnosResponse = await obtenerAlumnosPorTurno();
    // La API ya devuelve la estructura { labels: [], datasets: [] } correcta para Chart.js
    alumnosPorTurnoMesData.value = turnosResponse;
    console.log('Gráfico Turnos cargado');
  } catch (error) {
    console.error("Error Gráfico Turnos:", error);
  }

  // --- C) Cargar Ocupación ---
  errorOcupacion.value = false;
  loadingOcupacion.value = true;
  try {
    const response = await obtenerHorariosCompletos();
    datosOcupacion.value = response;
    console.log("Datos ocupación cargados");
  } catch (error) {
    console.error("Error ocupación:", error);
    errorOcupacion.value = true;
  } finally {
    loadingOcupacion.value = false;
  }

  // --- D) Cargar Metodologías ---
  try {
    const response = await obtenerOcupacionTotal();
    datosMetodologiaEjemplo.value = response;
    procesarDatosMetodologia(datosMetodologiaEjemplo.value);
    console.log("Datos metodologías cargados");
  } catch (error) {
    console.error("Error metodologías:", error);
  }

  // --- E) Cargar Rendimiento Staff ---
  try {
    const staffResponse = await obtenerRendimientoStaff();
    staffStats.value = staffResponse;
    console.log("Rendimiento staff cargado");
  } catch (error) {
    console.error("Error staff:", error);
  }
};

onMounted(() => {
  cargarDatosDashboard();
});
</script>

<style scoped>
.ingresos-section {
  margin-top: 2rem;
}
.contenedor {
  padding: 2rem; /* <-- RESTAURADO: Padding general */
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  /* max-width: 900px; */ /* <-- Eliminado para que ocupe el ancho */
  /* margin: auto; */ /* <-- Eliminado para que no se centre */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  overflow: hidden; /* Mantenido para contener bordes de DetallePersona */
  width: 100%;
}

/* El estilo del título se elimina porque el h2 está comentado/eliminado */
/* .titulo { ... } */


/* Media query para dispositivos móviles */
@media (max-width: 768px) {
  .contenedor {
    width: 100%; /* Asegura ancho completo */
    padding: 1.5rem; /* <-- RESTAURADO: Padding mediano */
    margin: 0; /* Asegura que no haya margen auto */
    box-sizing: border-box; /* Asegura que el padding no desborde */
  }
}

@media (max-width: 480px) {
  .contenedor {
     padding: 1rem; /* <-- RESTAURADO: Padding pequeño */
  }
}

.dashboard-admin-container {
  padding: 1rem;
}
.dashboard-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two equal columns */
  gap: 1.5rem;
}

.grid-span-2 {
  grid-column: span 2; /* Make this item span both columns */
}

@media (max-width: 992px) { /* On smaller screens, switch to one column */
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .grid-span-2 {
    grid-column: span 1;
  }
}
/* Grid para las tarjetas de entrenadores */
.trainers-grid {
  display: grid;
  /* En pantallas grandes: 2 columnas */
  /* grid-template-columns: repeat(2, 1fr);  */
  gap: 1.5rem;
  /* Opcional: si quieres que el título y la grilla se separen un poco */
  margin-top: 1rem; 
}

.no-data-message {
  grid-column: 1 / -1; /* Si no hay datos, el mensaje ocupa todo el ancho */
  text-align: center;
  color: #888;
  padding: 2rem;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 12px;
}

/* Responsive: En tablets y móviles pasa a 1 sola columna */
@media (max-width: 992px) {
  .trainers-grid {
    grid-template-columns: 1fr;
  }
}

/* Agrega esto a tu estilo existente */
.staff-section {
  margin-top: 1.5rem;
}
</style>

