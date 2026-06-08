<template>
    <div class="occupancy-grid-container">
        <div class="occupancy-grid-header">
            <h3 class="occupancy-title">
                <i class="fas fa-calendar-alt"></i>
                Ocupación Semanal por Horario
            </h3>
        </div>

        <div v-if="loading" class="loading-state">Cargando datos...</div>
        <div v-else-if="error" class="error-state">Error al cargar datos.</div>
        <div v-else class="occupancy-grid">
            <div class="grid-header grid-cell time-header">HORARIO</div>
            <div v-for="dia in uniqueDays" :key="dia" class="grid-header grid-cell day-header">
                {{ getShortDayName(dia) }}
            </div>

            <template v-for="horario in uniqueHorarios" :key="horario">
                <div class="grid-cell time-cell">{{ formatHorario(horario) }}</div>
                <div v-for="dia in uniqueDays" :key="`${dia}-${horario}`" class="grid-cell occupancy-cell"
                    :class="getOccupancyClass(dia, horario)" :title="getOccupancyTooltip(dia, horario)">
                    <span class="occupancy-text">{{ getOccupancyText(dia, horario) }}</span>
                </div>
            </template>
        </div>

        <div class="occupancy-legend">
            <h4>Leyenda de Ocupación:</h4>
            <div class="legend-items">
                <div class="legend-item"><span class="color-box occupancy-low"></span> Vacío / Baja</div>
                <div class="legend-item"><span class="color-box occupancy-medium"></span> Media</div>
                <div class="legend-item"><span class="color-box occupancy-high"></span> Alta</div>
                <div class="legend-item"><span class="color-box occupancy-full"></span> Completo</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, useCssVars } from 'vue';

const props = defineProps({
    // Recibe directamente el array del JSON
    occupancyData: {
        type: Array,
        required: true,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    error: {
        type: Boolean,
        default: false
    }
});

const DIAS_GRILLA = [
    'Lunes', 
    'Martes', 
    'Miércoles', 
    'Jueves', 
    'Viernes', 
    'Sábado',
    'Domingo'
];

// Extraer días y horarios únicos
const uniqueDays = computed(() => {
    // Ya no leemos de props.occupancyData[0]
    // Simplemente devolvemos la lista constante de días.
    return DIAS_GRILLA;
});

const uniqueHorarios = computed(() => {
    if (!props.occupancyData) return [];
    // Extrae y ordena los horarios de inicio
    const horarios = props.occupancyData.map(g => g.horaInicio);
    return [...new Set(horarios)].sort(); // Ordena HH:MM:SS
});


// 👇 --- NUEVO: Calcula y expone la variable CSS --- 👇
const gridColumns = computed(() => uniqueDays.value.length);

useCssVars(ctx => ({
    '--grid-columns': gridColumns.value
}));
// --- Fin Nuevo ---


// Función para obtener información de una celda específica
const getCellData = (dia, horarioInicio) => {
    const grupo = props.occupancyData.find(g => g.horaInicio === horarioInicio);
    if (!grupo) return null;
    const diaInfo = grupo.dias_asignados?.find(d => d.dia === dia);
    return diaInfo || null; // Devuelve null si no se encuentra info para ese día
};

// Función para calcular porcentaje y obtener clase CSS
const getOccupancyInfo = (dia, horarioInicio) => {
    const cellData = getCellData(dia, horarioInicio);
    if (!cellData || cellData.capacidadMax <= 0) {
        return { percentage: -1, available: 0, max: 0, class: 'occupancy-nodata' }; // Sin datos o capacidad 0
    }

    const inscritos = cellData.alumnos_inscritos || 0;
    const capacidad = cellData.capacidadMax;
    const disponibles = Math.max(0, capacidad - inscritos); // Asegura que no sea negativo
    const percentage = Math.min(100, Math.round((inscritos / capacidad) * 100)); // Calcula % y limita a 100

    let occupancyClass = 'occupancy-low'; // Verde por defecto (vacío o baja)
    if (percentage === 0) {
        occupancyClass = 'occupancy-low'; // Mantiene verde si es 0%
    } else if (percentage >= 1 && percentage < 40) {
        occupancyClass = 'occupancy-low'; // Verde (Baja)
    } else if (percentage >= 40 && percentage < 70) {
        occupancyClass = 'occupancy-medium'; // Amarillo (Media)
    } else if (percentage >= 70 && percentage < 100) {
        occupancyClass = 'occupancy-high'; // Naranja (Alta)
    } else if (percentage >= 100) {
        occupancyClass = 'occupancy-full'; // Rojo (Completo)
    }

    return {
        percentage,
        available: disponibles,
        max: capacidad,
        inscribed: inscritos,
        class: occupancyClass
    };
};

// Métodos usados en el template
const getOccupancyClass = (dia, horarioInicio) => {
    return getOccupancyInfo(dia, horarioInicio).class;
};

const getOccupancyTooltip = (dia, horarioInicio) => {
    const info = getOccupancyInfo(dia, horarioInicio);
    if (info.class === 'occupancy-nodata') return 'No disponible';
    return `${info.inscribed} / ${info.max} (${info.percentage}% ocupado) - ${info.available} ${info.available === 1 ? 'lugar disponible' : 'lugares disponibles'}`;
};

// Texto opcional dentro de la celda
const getOccupancyText = (dia, horarioInicio) => {
    const info = getOccupancyInfo(dia, horarioInicio);
    if (info.class === 'occupancy-nodata') return '-';
    // Puedes mostrar el porcentaje o los cupos disponibles/ocupados
    // return `${info.percentage}%`; // Mostrar porcentaje
    return `${info.inscribed}/${info.max}`; // Mostrar ocupados/total
    // return `${info.available}`; // Mostrar solo disponibles
};

// Formatear horario HH:MM:SS a HH:MM
const formatHorario = (horarioInicio) => {
    const grupo = props.occupancyData.find(g => g.horaInicio === horarioInicio);
    if (!grupo) return horarioInicio.slice(0, 5); // Fallback
    return `${grupo.horaInicio.slice(0, 5)} - ${grupo.horaFin.slice(0, 5)}`;
};

// Obtener nombre corto del día
const getShortDayName = (dia) => {
    const map = {
        'Lunes': 'Lun',
        'Martes': 'Mar',
        'Miércoles': 'Mié',
        'Jueves': 'Jue',
        'Viernes': 'Vie',
        'Sábado': 'Sáb', 
        'Domingo': 'Dom'
    };
    return map[dia] || dia;
}

</script>

<style scoped>
.occupancy-grid-container {
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid #eee;
    overflow-x: auto;
    /* Permite scroll horizontal si no cabe */
}

.occupancy-grid-header {
    margin-bottom: 1.5rem;
}

.occupancy-title {
    color: #333;
    font-size: 1.4rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.occupancy-title i {
    color: #d32f2f;
}

.occupancy-grid {
    display: grid;
    grid-template-columns: 140px repeat(var(--grid-columns, 7), 1fr);
    gap: 5px;
    min-width: 700px;
}

.grid-cell {
    padding: 0.8rem 0.5rem;
    border-radius: 6px;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 500;
    min-height: 60px;
    /* Altura mínima para celdas */
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #f0f0f0;
    /* Borde sutil por defecto */
}

/* Encabezados */
.grid-header {
    background-color: #f8f9fa;
    color: #495057;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.time-header {
    background-color: #e9ecef;
    color: #343a40;
}

.day-header {
    background-color: #f1f3f5;
    color: #495057;
}

/* Celda de Horario (Columna izquierda) */
.time-cell {
    background-color: #f8f9fa;
    color: #495057;
    font-weight: 600;
}

/* Celda de Ocupación */
.occupancy-cell {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: help;
    /* Indica que hay tooltip */
    color: rgba(0, 0, 0, 0.7);
    /* Color de texto por defecto */
}

.occupancy-cell:hover {
    transform: scale(1.03);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1;
    /* Para que se vea sobre otras celdas */
}

/* Texto dentro de la celda (opcional) */
.occupancy-text {
    font-weight: 600;
    font-size: 0.9rem;
}

/* --- Colores de Ocupación --- */
/* Baja/Vacío (Verde) */
.occupancy-low {
    background-color: #e8f5e9;
    /* Fondo verde muy claro */
    border-color: #c8e6c9;
}

.occupancy-low .occupancy-text {
    color: #2e7d32;
}

/* Texto verde oscuro */

/* Media (Amarillo) */
.occupancy-medium {
    background-color: #fffde7;
    /* Fondo amarillo muy claro */
    border-color: #fff9c4;
}

.occupancy-medium .occupancy-text {
    color: #f57f17;
}

/* Texto ámbar oscuro */

/* Alta (Naranja) */
.occupancy-high {
    background-color: #fff3e0;
    /* Fondo naranja muy claro */
    border-color: #ffe0b2;
}

.occupancy-high .occupancy-text {
    color: #e65100;
}

/* Texto naranja oscuro */

/* Completo (Rojo) */
.occupancy-full {
    background-color: #ffebee;
    /* Fondo rojo muy claro */
    border-color: #ffcdd2;
}

.occupancy-full .occupancy-text {
    color: #b71c1c;
}

/* Texto rojo oscuro */

/* Sin Datos */
.occupancy-nodata {
    background-color: #f5f5f5;
    /* Gris claro */
    border-color: #e0e0e0;
    cursor: default;
}

.occupancy-nodata .occupancy-text {
    color: #9e9e9e;
}

/* Texto gris */

/* Leyenda */
.occupancy-legend {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

.occupancy-legend h4 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1rem;
    font-weight: 600;
}

.legend-items {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #555;
}

.color-box {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.2);
}

/* Asigna los mismos fondos que las celdas */
.color-box.occupancy-low {
    background-color: #e8f5e9;
}

.color-box.occupancy-medium {
    background-color: #fffde7;
}

.color-box.occupancy-high {
    background-color: #fff3e0;
}

.color-box.occupancy-full {
    background-color: #ffebee;
}

/* Estados de carga y error */
.loading-state,
.error-state {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
    font-style: italic;
    min-height: 150px;
    /* Para que ocupe espacio */
    display: flex;
    align-items: center;
    justify-content: center;
}

.error-state {
    color: #dc3545;
    font-weight: bold;
}


/* Responsive */
@media (max-width: 992px) {
    .occupancy-grid {
        /* Ajusta la primera columna y las de los días */
        grid-template-columns: 120px repeat(var(--grid-columns, 7), 1fr);
        min-width: 0;
    }

    .grid-cell {
        font-size: 0.8rem;
        min-height: 50px;
    }

    .occupancy-text {
        font-size: 0.8rem;
    }
}

@media (max-width: 768px) {
    .occupancy-grid {
         /* Ajusta la primera columna y las de los días */
        grid-template-columns: 100px repeat(var(--grid-columns, 7), 1fr);
        gap: 4px;
    }

    .occupancy-grid {
        grid-template-columns: 100px repeat(auto-fit, minmax(70px, 1fr));
        gap: 4px;
    }

    .grid-cell {
        padding: 0.6rem 0.3rem;
        min-height: 45px;
    }

    .occupancy-text {
        font-size: 0.75rem;
    }

    .legend-items {
        gap: 1rem;
    }

    .legend-item {
        font-size: 0.8rem;
    }
}

@media (max-width: 480px) {
    .occupancy-grid {
        /* Ajusta la primera columna y las de los días */
        grid-template-columns: 80px repeat(var(--grid-columns, 7), 1fr);
        gap: 3px;
    }

    .grid-cell {
        padding: 0.4rem 0.2rem;
        min-height: 40px;
        font-size: 0.7rem;
    }

    .occupancy-text {
        font-size: 0.7rem;
        font-weight: 500;
    }

    /* Texto más pequeño */
    .legend-items {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
</style>