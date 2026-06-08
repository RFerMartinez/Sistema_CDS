<template>
    <div class="chart-card">
        <div class="card-header">
            <h3 class="card-title">{{ chartTitle }}</h3>
            
        </div>
        <div class="card-body">
            <Doughnut v-if="chartData && chartData.labels && chartData.labels.length > 0" :data="chartData"
                :options="chartOptions" :style="chartStyles" />
            <div v-else class="no-data-message">
                No hay datos disponibles para mostrar el gráfico.
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement, // Needed for Doughnut/Pie charts
    CategoryScale // May not be strictly necessary for Doughnut but often included
} from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const props = defineProps({
    chartData: {
        type: Object,
        required: true,
        default: () => ({ labels: [], datasets: [] }) // Provide default structure
    },
    chartOptions: {
        type: Object,
        default: () => ({ // Sensible defaults
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top', // Position legend like in the image
                },
                title: {
                    display: false, // Title is handled by card-header
                }
            }
        })
    },
    chartTitle: { // Prop for the card title
        type: String,
        default: 'Gráfico de Torta'
    },
    height: { // Prop to control chart height
        type: String,
        default: '250px'
    }
});

// Computed style for chart height
const chartStyles = computed(() => ({
    height: props.height,
    position: 'relative' // Needed for responsiveness
}));

</script>

<style scoped>
/* Styles inspired by AdminLTE Card */
.chart-card {
    margin-bottom: 1rem;
    box-shadow: 0 0 1px rgba(0, 0, 0, .125), 0 1px 3px rgba(0, 0, 0, .2);
    border-radius: .375rem;
    /* Slightly more rounded */
    border: 0;
    /* Remove default border */
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    /* Default background */
    color: #333;
    /* Default text color */
}

/* Specific card colors (add more as needed) */
.card-danger {
    /* Using a slightly softer red than default AdminLTE danger */
    border-top: 5px solid #c0392b;
    /* Thicker top border for emphasis */
}

.card-danger .card-header {
    background-color: #e74c3c;
    /* Header background matches border */
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
    /* Use flexbox */
    justify-content: space-between;
    /* Space out title and tools */
    align-items: center;
    /* Center items vertically */
}

.card-title {
    margin-bottom: 0;
    font-size: 1.1rem;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    /* Use Poppins if available */
}

.card-tools {
    /* Style your collapse/remove buttons here if you add them */
    margin-left: auto;
    /* Push tools to the right */
    display: flex;
    gap: 0.5rem;
}

.card-body {
    flex: 1 1 auto;
    padding: 1.25rem;
    min-height: 1px;
    /* Ensure it has height */
}

/* Canvas styling */
canvas {
    max-width: 100%;
    display: block;
    width: 100% !important;
    /* Force width */
}

/* Message for no data */
.no-data-message {
    text-align: center;
    color: #6c757d;
    padding: 2rem;
    font-style: italic;
}

/* Responsive adjustments if needed */
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