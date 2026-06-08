<template>
    <div class="kpi-list-container">
        <KpiCard v-for="(kpi, index) in kpis" :key="index" :kpi="kpi" />
    </div>
</template>

<script setup>
import KpiCard from './KpiCard.vue'; // Asegúrate que la ruta sea correcta

defineProps({
    kpis: {
        type: Array,
        required: true,
        default: () => [] // Valor por defecto como array vacío
    }
});
</script>

<style scoped>
.kpi-list-container {
    display: grid;
    /* Por defecto 4 columnas en pantallas grandes */
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    /* Espacio entre tarjetas */
    width: 100%;
    /* Ocupa el ancho disponible */
}

/* Responsive: 2 columnas en pantallas medianas */
@media (max-width: 992px) {
    .kpi-list-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
}

/* Responsive: 1 columna en pantallas pequeñas */
@media (max-width: 576px) {
    .kpi-list-container {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}
</style>