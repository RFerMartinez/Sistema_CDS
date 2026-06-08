<template>
    <div class="kpi-card" :class="cardColorClass">
        <div class="kpi-card-inner">
            <h3 class="kpi-value" :class="{ 'justify-value': hasMultipleValues }">
                <span v-if="hasMultipleValues">{{ valuePart1 }}</span>
                <span v-if="hasMultipleValues">{{ valuePart2 }}</span>
                <span v-else v-html="formattedValue"></span>
            </h3>
            <p class="kpi-title">{{ kpi.title }}</p>
        </div>
        <div class="kpi-icon">
            <i :class="kpi.icon"></i>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    kpi: {
        type: Object,
        required: true,
        validator: (value) => {
            return (
                typeof value.title === 'string' &&
                (typeof value.value === 'string' || typeof value.value === 'number') &&
                typeof value.icon === 'string' &&
                (typeof value.color === 'string' || value.color === undefined) // Color es opcional
            );
        }
    }
});

// Mapea el color de AdminLTE a clases CSS locales (puedes personalizarlas)
const cardColorClass = computed(() => {
    const colorMap = {
        info: 'bg-blue',
        success: 'bg-yellow',
        warning: 'bg-green',
        danger: 'bg-red',
        primary: 'bg-purple', // Ejemplo adicional
        secondary: 'bg-gray' // Ejemplo adicional
    };
    // Usa 'bg-gray' como color por defecto si no se especifica o no coincide
    return colorMap[props.kpi.color] || 'bg-gray';
});

// --- 👇 Nuevas propiedades computadas ---
const hasMultipleValues = computed(() => {
  // Verifica si el valor es string y contiene nuestro separador '|'
    return typeof props.kpi.value === 'string' && props.kpi.value.includes('|');
    });

    const valuePart1 = computed(() => {
    // Devuelve la primera parte si existen múltiples valores
    if (hasMultipleValues.value) {
        // Usa optional chaining (?) por si split devuelve menos de 2 elementos
        return props.kpi.value.split('|')[0]?.trim() ?? '';
    }
    return '';
    });

    const valuePart2 = computed(() => {
    // Devuelve la segunda parte si existen múltiples valores
    if (hasMultipleValues.value) {
        return props.kpi.value.split('|')[1]?.trim() ?? '';
    }
    return '';
    });

    const formattedValue = computed(() => {
    // Mantiene el manejo del <sup> para porcentajes si no hay justificación
    if (!hasMultipleValues.value && typeof props.kpi.value === 'string' && props.kpi.value.includes('%')) {
        return props.kpi.value.replace('%', '<sup style="font-size: 0.5em; top: -0.8em;">%</sup>');
    }
  return props.kpi.value; // Devuelve el valor original si no es porcentaje ni justificado
})
// --- Fin nuevas propiedades computadas ---


</script>

<style scoped>
/* Inspirado en AdminLTE 'small-box' pero más moderno */
.kpi-card {
    border-radius: 12px;
    /* Más redondeado */
    position: relative;
    display: block;
    margin-bottom: 1.5rem;
    /* Espaciado */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    color: white;
    overflow: hidden;
    /* Para contener el icono */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    padding: 1.5rem;
    /* Padding interno */
}

.kpi-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.kpi-card-inner {
    position: relative;
    /* Para que el texto esté sobre el icono */
    z-index: 2;
}

.kpi-value {
    font-size: 1.7rem;
    /* Más grande */
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    padding: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.1;
    font-family: 'Poppins', sans-serif;
    /* Usando Poppins */
}

/* Ajuste si el valor tiene '%' (como Bounce Rate) */
.kpi-value sup {
    font-size: 1.8rem;
    /* Más pequeño */
    top: -0.8em;
    /* Ajustar posición vertical */
}

.kpi-title {
    font-size: 0.9rem;
    /* Ligeramente más grande */
    margin: 0;
    padding: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.9;
    /* Ligeramente transparente */
    font-family: 'Poppins', sans-serif;
}

.kpi-icon {
    position: absolute;
    top: -10px;
    /* Ajustar posición */
    right: 15px;
    /* Ajustar posición */
    z-index: 1;
    /* Detrás del texto */
    font-size: 70px;
    /* Tamaño del icono */
    color: rgba(0, 0, 0, 0.15);
    /* Color semi-transparente */
    transition: transform 0.3s ease;
}

.kpi-card:hover .kpi-icon {
    transform: scale(1.1) rotate(-5deg);
    /* Efecto sutil al pasar el mouse */
}

/* 👇 Nuevo estilo para justificar */
.kpi-value.justify-value {
  display: flex;             /* Habilita Flexbox */
  justify-content: space-between; /* Empuja los elementos a los extremos */
  align-items: baseline;     /* Alinea la base del texto */
  width: 100%;               /* Ocupa todo el ancho */
}

/* 👇 Opcional: Puedes ajustar el tamaño si los textos son largos */
.kpi-value.justify-value span {
  font-size: 1.7rem; /* Ligeramente más pequeño */
  /* white-space: normal; */ /* Descomenta si necesitas que el texto se divida en líneas */
}

/* Clases de Color (simplificadas, puedes añadir más) */
.bg-blue {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.bg-green {
    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.bg-yellow {
    background: linear-gradient(135deg, #f1c40f 0%, #f39c12 100%);
}

.bg-red {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.bg-purple {
    background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
}

.bg-gray {
    background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
}

/* Footer opcional */
.kpi-footer {
    position: relative;
    text-align: center;
    padding: 8px 0;
    /* Ajustar padding */
    color: rgba(255, 255, 255, 0.8);
    display: block;
    z-index: 10;
    background: rgba(0, 0, 0, 0.1);
    text-decoration: none;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    margin: 1.5rem -1.5rem -1.5rem -1.5rem;
    /* Ajustar para ocupar el fondo */
    font-size: 0.9rem;
}

.kpi-footer:hover {
    color: #fff;
    background: rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
    .kpi-value { font-size: 2.2rem; }
    .kpi-title { font-size: 0.9rem; }
    .kpi-icon { font-size: 55px; top: 0px; }
    .kpi-card { padding: 1rem; }
    /* 👇 Ajuste responsive para justificación */
    .kpi-value.justify-value span {
        font-size: 2rem;
    }
}
</style>