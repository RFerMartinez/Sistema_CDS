<template>
  <div class="contenedor-info-alumno">
    
    <!-- 1. Encabezado con Botón Volver y Título -->
    <div class="encabezado-info">
      <button class="btn-volver-global" @click="emitirVolver">
        <i class="fas fa-arrow-left"></i>
        Volver a Empleados
      </button>
      <Titulo texto="INFORMACIÓN DEL EMPLEADO" />
    </div>

    <!-- 2. Tarjeta principal -->
    <div class="tarjeta-alumno">
      <div class="tarjeta-contenido">
        
        <!-- 3. Componente DetallePersona -->
        <DetallePersona :datos="DatosEmpleado" />
        
        <div class="separador-seccion"></div>

        <!-- 4. Componente TablaHorarios -->
        <div class="seccion-info">
          <h3 class="titulo-seccion">
            <i class="fas fa-calendar-alt"></i>
            Horarios Laborales Asignados
          </h3>
          <TablaHorarios
            :horarios-alumno="HorariosEmpleado"
            :suscripcion="''" 
            :modo-empleado="true"
            @horarios-actualizados="manejarHorariosActualizados"
          />
        </div>

        <!-- ================================= -->
        <!-- ===   BOTÓN DAR DE BAJA       === -->
        <!-- ================================= -->
        <div class="seccion-botones">
          <div class="botones-accion">
            <button class="btn-accion btn-eliminar" @click="iniciarBaja">
              <i class="fas fa-user-times"></i>
              Dar de baja al Empleado
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ================================= -->
    <!-- ===          MODALES          === -->
    <!-- ================================= -->

    <!-- Modal de Confirmación de Baja -->
    <Transition name="modal-fade">
      <div v-if="mostrarModalBaja" class="modal-overlay">
        <div class="modal-confirmacion"> 
          <div class="modal-header">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Confirmar Baja</h3>
          </div>
          <div class="modal-body">
            <p>
              ¿Estás seguro que desea dar de baja al empleado 
              <strong>{{ DatosEmpleado.nombre }} {{ DatosEmpleado.apellido }}</strong>?
            </p>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
              Se lo designará de sus horarios y los alumnos que pertenecían a él quedarán en los mismos horarios.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-modal btn-cancelar-modal" @click="mostrarModalBaja = false">
              Cancelar
            </button>
            <button class="btn-modal btn-confirmar-modal" @click="BajaEmpleado">
              Sí, Confirmar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Éxito -->
    <Transition name="modal-fade">
      <div v-if="mostrarModalExito" class="modal-overlay">
        <div class="modal-exito">
          <div class="modal-header-exito">
            <i class="fas fa-check-circle"></i>
            <h3>Operación Exitosa</h3>
          </div>
          <div class="modal-body-exito">
            <p>{{ mensajeModalExito }}</p>
          </div>
          <div class="modal-footer-exito">
            <button class="btn-modal-continuar" @click="handleContinuarExito">
              Continuar
            </button>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Modal de Error -->
    <Transition name="modal-fade">
      <div v-if="mostrarModalError" class="modal-overlay">
        <div class="modal-error"> 
          <div class="modal-header-error">
            <i class="fas fa-exclamation-triangle"></i> 
            <h3>Error</h3>
          </div>
          <div class="modal-body-error">
            <p>{{ mensajeModalError }}</p> 
          </div>
          <div class="modal-footer-error">
            <button class="btn-modal-error" @click="mostrarModalError = false">
              Entendido
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Titulo from '../../Titulo.vue';
import DetallePersona from '../DetallePersona.vue';
import TablaHorarios from '../../Tablas y Filas/TablaHorario/TablaHorarios.vue';

import {
  obtenerEmpleadoPorDni,
  actualizarHorariosEmpleado,
  eliminarEmpleado
} from '@/api/services/empleadoService';

// --- Props y Datos iniciales ---
const props = defineProps({
  empleadoSeleccionado: {
    type: Object,
    required: true
  }
});
const EmpleadoID = ref(props.empleadoSeleccionado);
console.log('Empleado en InfoEmpleado (desde prop):', EmpleadoID.value);

const emit = defineEmits(['volver-empleados']);

// --- Estados de Modales ---
const mostrarModalBaja = ref(false);
const mostrarModalExito = ref(false);
const mostrarModalError = ref(false);
const mensajeModalExito = ref('');
const mensajeModalError = ref('');

// --- Estados ---
const loading = ref(true);
const DatosEmpleado = ref({});
const HorariosEmpleado = ref({ horarios: [] });

// --- Carga de Datos ---
const cargarDetalleEmpleado = async () => {
  loading.value = true;
  try {
    // Usamos el DNI que viene de la prop (del listado anterior)
    const dni = props.empleadoSeleccionado.dni; 

    // Llamada a la API
    const data = await obtenerEmpleadoPorDni(dni);
    
    // Separamos la respuesta en las dos estructuras que usa tu template
    const { horarios, ...datosPersonales } = data;
    
    DatosEmpleado.value = datosPersonales;
    HorariosEmpleado.value = { horarios: horarios }; // Ajustamos al formato que espera TablaHorarios

  } catch (error) {
    mensajeModalError.value = error.response?.data?.error || "No se pudo cargar la información del empleado.";
    mostrarModalError.value = true;
  } finally {
    loading.value = false;
  }
};

// --- Métodos de Navegación ---
const emitirVolver = () => {
  emit('volver-empleados');
}

// --- Manejo de Actualización de Horarios ---
const manejarHorariosActualizados = async (nuevosHorarios) => {
  loading.value = true;
  try {
    // 1. Preparamos el payload y limpiamos los datos (trim en nroGrupo por si acaso)
    const payload = {
      horarios: nuevosHorarios.horarios.map(h => ({
        dia: h.dia,
        nroGrupo: h.nroGrupo.trim()
      }))
    };

    // 2. Llamada a la API
    await actualizarHorariosEmpleado(DatosEmpleado.value.dni, payload);

    // 3. Notificación de éxito
    mensajeModalExito.value = "Horarios del empleado actualizados correctamente.";
    mostrarModalExito.value = true;

  } catch (error) {
    console.error("Error al guardar horarios:", error);
    mensajeModalError.value = error.response?.data?.error || "Error al actualizar los horarios.";
    mostrarModalError.value = true;
  } finally {
    // 4. Recargamos los datos para asegurar consistencia
    await cargarDetalleEmpleado();
    loading.value = false;
  }
};

// --- Lógica para Dar de Baja ---
const iniciarBaja = () => {
  mostrarModalBaja.value = true;
}

const BajaEmpleado = async () => {
  mostrarModalBaja.value = false;

  try {
    loading.value = true;

    // 2. Llamada a la API
    await eliminarEmpleado(DatosEmpleado.value.dni);
    
    // 3. Éxito
    mensajeModalExito.value = "El empleado ha sido dado de baja correctamente.";
    mostrarModalExito.value = true;

  } catch (error) {
    console.error("Error al dar de baja:", error);
    mensajeModalError.value = error.response?.data?.error || "Ocurrió un error al intentar dar de baja al empleado.";
    mostrarModalError.value = true;
  } finally {
    loading.value = false;
    emitirVolver(); // Volvemos al listado tras la baja
  }
}

const handleContinuarExito = () => {
  mostrarModalExito.value = false;
  // Al finalizar con éxito, volvemos a la lista de empleados
  // emitirVolver();
}

onMounted(cargarDetalleEmpleado);

</script>

<style scoped>
/* Estilos copiados de InfoAlumno.vue para mantener la coherencia */
.contenedor-info-alumno {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
}

.encabezado-info {
  display: grid; 
  grid-template-columns: 1fr auto 1fr; 
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap; 
  gap: 1rem;
}
.encabezado-info .btn-volver-global {
  justify-self: start; 
}

.tarjeta-alumno {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tarjeta-contenido {
  padding: 0; /* DetallePersona ya tiene su propio padding/header */
}

.separador-seccion {
  height: 1px;
  background: linear-gradient(to right, transparent, #e0e0e0, transparent);
  margin: 2rem 2rem; 
}

.seccion-info {
  margin-bottom: 2.5rem;
  padding: 1.5rem 2rem;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  margin-left: 2rem;
  margin-right: 2rem;
}
.seccion-info .titulo-seccion {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
  border-bottom: 2px solid #d32f2f;
  padding-bottom: 0.5rem;
}
.seccion-info .titulo-seccion i { color: #d32f2f; }

.seccion-info:last-child {
  margin-bottom: 0;
  padding-bottom: 2rem; /* Añadimos padding al final */
}

/* --- Estilos para la sección de botones (Baja) --- */
.seccion-botones { 
  margin-top: 2rem; 
  padding: 2rem;
  border-top: 2px solid #e0e0e0; 
  background-color: #fff;
}
.botones-accion { 
  display: flex;
  justify-content: flex-end; /* Botón a la derecha */
}
.btn-accion { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 0.5rem; 
  padding: 1rem 1.5rem; 
  border: none; 
  border-radius: 10px; 
  font-family: 'Poppins', sans-serif; 
  font-weight: 600; 
  font-size: 1rem; 
  cursor: pointer; 
  transition: all 0.3s ease; 
}
.btn-eliminar { 
  background: #F44336; 
  color: white; 
}
.btn-eliminar:hover { 
  background: #D32F2F; 
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
}

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .contenedor-info-alumno { 
    padding: 1rem;
  } 

  .encabezado-info {
    display: flex; 
    flex-direction: column;
    text-align: center;
    align-items: stretch;
    grid-template-columns: none; 
  }
  .encabezado-info .btn-volver-global {
    justify-content: center;
    margin-bottom: 1rem;
    justify-self: auto;
  }

  .tarjeta-contenido { 
    padding: 1rem;
  }

  .separador-seccion { 
    margin: 1.5rem 0; 
  }

  .seccion-info { 
    padding: 1rem 0; 
    border: none;
    background: none; 
    margin-left: 0;
    margin-right: 0;
  }

  .seccion-info .titulo-seccion {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .botones-accion {
    justify-content: center; /* Centrado en móvil */
  }
  .btn-accion {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .contenedor-info-alumno { 
    padding: 0.5rem;
  } 

  .tarjeta-contenido { 
    padding: 0.5rem;
  }

  .separador-seccion { 
    margin: 1rem 0; 
  }

  .seccion-info { 
    padding: 0.8rem 0; 
  }

  .seccion-info .titulo-seccion {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>