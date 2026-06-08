<template>
  <div>
    <div class="tarjeta-header">
      <div class="info-principal">

        <div class="header-nombre-rol">
          <h2 class="nombre-completo">{{ datos.nombre || 'N/A' }} {{ datos.apellido || 'N/A' }}</h2>
          <p v-if="datos.rol" class="rol-empleado">
            <i class="fas fa-briefcase"></i>
            {{ datos.rol }}
          </p>
        </div>
        <p class="dni-persona">{{ datos.dni ? `DNI: ${datos.dni}` : 'DNI no disponible' }}</p>

      </div>
      <template v-if="datos.hasOwnProperty('activo')">
        <div class="estado-alumno">
          <Estado :positivo="datos.activo" :texto="datos.activo ? 'ACTIVO' : 'INACTIVO'" />
        </div>
      </template>
    </div>
    <div class="seccion-tabla">
      <h3 class="titulo-seccion">
        <i class="fas fa-user"></i>
        Información Personal
      </h3>
      <div class="tabla-datos">
        <div class="fila-tabla">
          <div class="celda etiqueta">Nombre:</div>
          <div class="celda valor">{{ datos.nombre || 'N/A' }}</div>
          <div class="celda etiqueta">Apellido:</div>
          <div class="celda valor">{{ datos.apellido || 'N/A' }}</div>
        </div>
        <div class="fila-tabla">
          <div class="celda etiqueta">DNI:</div>
          <div class="celda valor">{{ datos.dni || 'N/A' }}</div>
          <div class="celda etiqueta">Email:</div>
          <div class="celda valor">{{ datos.email || 'No especificado' }}</div>
        </div>
        <div class="fila-tabla">
          <div class="celda etiqueta">Teléfono:</div>
          <div class="celda valor">{{ datos.telefono || 'No especificado' }}</div>
          <template v-if="datos.hasOwnProperty('sexo')">
            <div class="celda etiqueta">Sexo:</div>
            <div class="celda valor">{{ datos.sexo === 'F' ? 'Femenino' : (datos.sexo === 'M' ? 'Masculino' : 'No especificado') }}</div>
          </template>
          <template v-else>
            <div class="celda etiqueta"></div>
            <div class="celda valor"></div>
          </template>
        </div>
      </div>
    </div>

    <div class="separador-seccion"></div>

    <div class="seccion-tabla">
      <h3 class="titulo-seccion">
        <i class="fas fa-map-marker-alt"></i>
        Dirección
      </h3>
      <div class="tabla-datos">
        <div class="fila-tabla">
          <div class="celda etiqueta">Provincia:</div>
          <div class="celda valor">{{ datos.provincia || 'No especificada' }}</div>
          <div class="celda etiqueta">Localidad:</div>
          <div class="celda valor">{{ datos.localidad || 'No especificada' }}</div>
        </div>
        <div class="fila-tabla">
          <div class="celda etiqueta">Calle:</div>
          <div class="celda valor">{{ datos.calle || 'No especificada' }}</div>
          <div class="celda etiqueta">Número:</div>
          <div class="celda valor">{{ datos.nro || 'S/N' }}</div>
        </div>
      </div>
    </div>

    <template v-if="datos.hasOwnProperty('turno') || datos.hasOwnProperty('suscripcion') || datos.hasOwnProperty('trabajoactual') || datos.hasOwnProperty('nivel')">
      <div class="separador-seccion"></div>
      <div class="seccion-tabla">
        <h3 class="titulo-seccion">
          <i class="fas fa-dumbbell"></i>
          Información del Gimnasio
        </h3>
        <div class="tabla-datos">
          <div class="fila-tabla">
            <div class="celda etiqueta">Turno:</div>
            <div class="celda valor">{{ datos.turno || 'N/A' }}</div>
            <div class="celda etiqueta">Suscripción:</div>
            <div class="celda valor">{{ datos.suscripcion || 'N/A' }}</div>
          </div>
          <div class="fila-tabla">
            <div class="celda etiqueta">Trabajo Actual:</div>
            <div class="celda valor">{{ datos.trabajoactual || 'N/A' }}</div>
            <div class="celda etiqueta">Nivel:</div>
            <div class="celda valor">{{ datos.nivel || 'N/A' }}</div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="datos.hasOwnProperty('activo') || datos.hasOwnProperty('cuotasPendientes')">
      <div class="separador-seccion"></div>
      <div class="seccion-tabla">
        <h3 class="titulo-seccion">
          <i class="fas fa-chart-bar"></i>
          Estado y Cuotas
        </h3>
        <div class="tabla-datos">
          <div class="fila-tabla">
            <div class="celda etiqueta">Estado:</div>
            <div class="celda valor">
             <Estado v-if="datos.hasOwnProperty('activo')" :positivo="datos.activo" :texto="datos.activo ? 'ACTIVO' : 'INACTIVO'" />
             <span v-else class="estado-inactivo">N/A</span> </div>
            <div class="celda etiqueta">Cuotas Pendientes:</div>
            <div class="celda valor">
              <span class="badge-cuota" :class="{'ninguna': !datos.cuotasPendientes || datos.cuotasPendientes === 0}">
                {{ datos.cuotasPendientes || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>
     </template>

  </div>
</template>

<script setup>
// V V V IMPORTAR ESTADO V V V
import Estado from '../Estado.vue';
// ^ ^ ^ FIN IMPORTAR ESTADO ^ ^ ^

const props = defineProps({
  datos: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
/* V V V NUEVOS ESTILOS PARA EL HEADER (Copiados de InfoAlumno/IngresoPersona) V V V */
.tarjeta-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem 2rem; /* Ajustado */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
  /* Redondea solo las esquinas superiores si el componente se usa al inicio de un .tarjeta-contenido */
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.info-principal {
  flex: 1; /* Permite que crezca */
}

.nombre-completo {
  font-size: 1.6rem; /* Ajustado */
  color: #2c3e50;
  margin: 0 0 0.3rem 0; /* Ajustado */
  font-weight: 600;
}

/* ============================================= */
/* ===    ESTILO PARA LA ETIQUETA DE 'ROL'     === */
/* ============================================= */
.rol-empleado {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #d32f2f; /* Color rojo del proyecto */
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px; /* Forma de píldora */
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0.5rem 0; /* Espacio entre nombre y DNI */
}
.rol-empleado i {
  opacity: 0.9;
}
/* ============================================= */


.dni-persona { /* Clase genérica para DNI */
  font-size: 1rem; /* Ajustado */
  color: #6c757d;
  margin: 0;
  font-weight: 500;
}

.estado-alumno {
  flex-shrink: 0; /* Evita que el tag de estado se achique */
  margin-left: 1rem;
}
/* ^ ^ ^ FIN NUEVOS ESTILOS HEADER ^ ^ ^ */


/* Estilos existentes */
.seccion-tabla {
  margin-bottom: 2rem;
  padding-top: 2rem;
  /* --- AÑADIDO: El "ligero espacio en blanco" --- */
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

/* PRIMER TITULO-SECCION no necesita margen superior */
.seccion-tabla:first-of-type {
    margin-bottom: 2rem;
    padding-top: 0; /* Quitar padding-top si es el primer elemento */
}
/* APLICAR PADDING TOP AL PRIMERO SI EL HEADER ESTÁ PRESENTE */
.tarjeta-header + .seccion-tabla {
    padding-top: 2rem;
}


.titulo-seccion {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
  border-bottom: 2px solid #d32f2f; /* <-- LÍNEA MODIFICADA */
  padding-bottom: 0.5rem;
}

.titulo-seccion i {
  color: #d32f2f; /* <-- LÍNEA MODIFICADA */
}

.tabla-datos {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.fila-tabla {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  background: white;
}

.fila-tabla:last-child {
  border-bottom: none;
}

.celda {
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
}

.etiqueta {
  font-weight: 600;
  color: #495057;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  min-width: 150px;
  width: 150px;
  font-size: 0.95rem;
  justify-content: flex-start;
}

.valor {
  font-weight: 500;
  color: #2c3e50;
  background-color: white;
  font-size: 1rem;
  flex: 1;
  justify-content: flex-start;
  padding-left: 1.5rem;
  border-left: 1px solid #f0f0f0;
  word-break: break-word;
}

.fila-tabla .celda:nth-child(2) {
  border-right: 1px solid #e0e0e0;
}

.fila-tabla .celda:nth-child(3) {
   border-right: none;
}
.fila-tabla .celda.etiqueta:nth-child(3) {
    border-right: 1px solid #e0e0e0;
}

.separador-seccion {
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 2rem 0;
}

.badge-cuota {
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: #ffebee;
  color: #d32f2f;
  font-size: 1.1rem;
  min-width: 40px;
  text-align: center;
  display: inline-block;
}
.badge-cuota.ninguna {
  background-color: #e8f5e9;
  color: #2e7d32;
}

/* Estilos para Estado (copiados de FilaCuota) */
.estado-activo {
    background-color: #4CAF50;
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-weight: 600;
    font-size: 0.9rem;
}
.estado-inactivo {
    background-color: #F44336;
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-weight: 600;
    font-size: 0.9rem;
}

.header-nombre-rol {
  display: flex;
  align-items: center; /* Alinea verticalmente el nombre y el badge */
  gap: 1rem;          /* Espacio entre el nombre y el badge */
  flex-wrap: wrap;    /* Si la pantalla es muy chica, el rol pasa abajo */
}

/* 2. Ajustamos los márgenes del h2 y el p */
.nombre-completo {
  margin: 0; /* Quitamos el margen inferior original */
}
.rol-empleado {
  margin: 0; /* Quitamos los márgenes verticales originales */
}

/* 3. Ajustamos el DNI para que tenga el espacio superior correcto */
.dni-persona {
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  /* V V V NUEVO: Responsive Header V V V */
  .tarjeta-header {
      padding: 1.5rem;
      flex-direction: column;
      gap: 1rem;
      text-align: center;
      /* Quitar redondeo superior si el contenido también se redondea */
      /* border-top-left-radius: 0; */
      /* border-top-right-radius: 0; */
  }
  .nombre-completo {
      font-size: 1.5rem;
  }
  .dni-persona {
      font-size: 1rem; /* Asegurar consistencia */
  }
  /* ^ ^ ^ FIN NUEVO ^ ^ ^ */

  /* Estilos Responsive Existentes */
  .fila-tabla {
    flex-direction: column;
    border-bottom: 1px solid #e0e0e0;
  }
  .fila-tabla:last-child {
      border-bottom: none;
  }
  .celda {
    padding: 0.8rem 1rem;
    width: 100% !important;
    min-width: auto !important;
    border-right: none !important;
    border-bottom: 1px solid #f0f0f0;
    justify-content: space-between;
  }
  .celda:last-child {
    border-bottom: none;
  }
  .etiqueta {
    background-color: #f8f9fa;
    font-weight: 600;
    border-right: none;
    border-bottom: none;
    width: auto !important;
    min-width: auto;
  }
  .valor {
    border-left: none;
    padding-left: 1rem;
    justify-content: flex-end;
    text-align: right;
    border-bottom: none;
  }
  .celda.etiqueta:empty, .celda.valor:empty {
      display: none;
  }
  .fila-tabla:last-child .celda:not(:empty):last-child {
    border-bottom: none;
  }
  .separador-seccion {
    margin: 1.5rem 0;
  }
}

@media (max-width: 480px) {
    /* V V V NUEVO: Responsive Header V V V */
    .tarjeta-header {
        padding: 1rem;
    }
    .nombre-completo {
        font-size: 1.3rem;
    }
    /* ^ ^ ^ FIN NUEVO ^ ^ ^ */

    .celda {
        padding: 0.7rem;
        font-size: 0.9rem;
    }
    .valor {
        font-size: 0.95rem;
    }
     .separador-seccion {
        margin: 1rem 0;
     }
}
</style>