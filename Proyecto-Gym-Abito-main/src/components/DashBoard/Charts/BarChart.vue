<template>
    <div class="chart-card">
        <div class="card-header">
            <h3 class="card-title">{{ chartTitle }}</h3>
        </div>
        <div class="card-body">
            <Bar v-if="chartData && chartData.labels && chartData.labels.length > 0" :data="chartData"
                :options="chartOptions" :style="chartStyles" />
            <div v-else class="no-data-message">
                No hay datos disponibles para mostrar el gráfico.
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement, // Necesario para gráficos de barras
    CategoryScale, // Necesario para el eje X (categorías como meses)
    LinearScale // Necesario para el eje Y (valores numéricos)
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
    chartData: {
        type: Object,
        required: true,
        default: () => ({ labels: [], datasets: [] })
    },
    chartOptions: {
        type: Object,
        default: () => ({ // Opciones por defecto razonables
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false, // El título está en el card-header
                }
            },
            scales: { // Importante para apilar
                x: {
                    stacked: true, // Apilar en el eje X
                },
                y: {
                    stacked: true, // Apilar en el eje Y
                    beginAtZero: true // Asegura que el eje Y empiece en 0
                }
            }
        })
    },
    chartTitle: {
        type: String,
        default: 'Gráfico de Barras'
    },
    height: {
        type: String,
        default: '300px' // Altura por defecto un poco mayor para barras
    }
});

const chartStyles = computed(() => ({
    height: props.height,
    position: 'relative'
}));

</script>

<style scoped>
/* Estilos similares a DonutChart.vue, pero puedes ajustar el color */
.chart-card {
    margin-bottom: 1rem;
    box-shadow: 0 0 1px rgba(0, 0, 0, .125), 0 1px 3px rgba(0, 0, 0, .2);
    border-radius: .375rem;
    border: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    color: #333;
}

/* Color específico para esta tarjeta (verde) */
.card-success {
    border-top: 5px solid #27ae60;
    /* Verde */
}

.card-success .card-header {
    background-color: #2ecc71;
    /* Verde más claro */
    color: white;
    border-bottom: 0 solid transparent;
}

.card-header {
    padding: .75rem 1.25rem;
    margin-bottom: 0;
    background-color: rgba(0, 0, 0, .03);
    border-bottom: 1px solid rgba(0, 0, 0, .125);
    border-top-left-radius: .375rem;
    border-top-right-radius: .375rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-title {
    margin-bottom: 0;
    font-size: 1.1rem;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
}

.card-tools {
    margin-left: auto;
    display: flex;
    gap: 0.5rem;
}

.card-body {
    flex: 1 1 auto;
    padding: 1.25rem;
    min-height: 1px;
}

canvas {
    max-width: 100%;
    display: block;
    width: 100% !important;
}

.no-data-message {
    text-align: center;
    color: #6c757d;
    padding: 2rem;
    font-style: italic;
}

@media (max-width: 768px) {
    .card-header {
        padding: .5rem 1rem;
    }

    .card-title {
        font-size: 1rem;
    }

    .card-body {
        padding: 1rem;
    }
}
</style>