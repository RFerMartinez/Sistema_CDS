<template>
  <div class="contenedor-modificar-cuota">
    <div class="header-modificacion">
      <h3 class="titulo-modificacion">
        <i class="fas fa-file-invoice-dollar"></i>
        Modificar Cuota
      </h3>
      <p class="subtitulo-modificacion">Ajusta los detalles de la cuota (ID: {{ cuotaEditada.idCuota }})</p>
    </div>

    <div class="formulario-cuota">
      
      <div class="form-grid">
        <div class="form-group">
          <label for="monto">Monto</label>
          <input id="monto" type="number" v-model.number="cuotaEditada.monto" placeholder="Ej: 20000" />
        </div>
        <div class="form-group">
          <label for="mes">Mes</label>
          <select id="mes" v-model="cuotaEditada.mes">
            <option v-for="mes in opcionesMeses" :key="mes.valor" :value="mes.valor">
              {{ mes.nombre }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="anio">Año</label>
          <select id="anio" v-model.number="cuotaEditada.anio">
            <option v-for="anio in opcionesAnios" :key="anio" :value="anio">
              {{ anio }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="fechaComienzo">Fecha Comienzo</label>
          <input id="fechaComienzo" type="date" v-model="cuotaEditada.fechaComienzo" />
        </div>
        <div class="form-group">
          <label for="vencimiento">Fecha Vencimiento</label>
          <input id="vencimiento" type="date" v-model="cuotaEditada.vencimiento" />
          <p v-if="!fechaVencimientoValida" class="error-validacion">
            La fecha de vencimiento no puede ser anterior a la fecha de comienzo.
          </p>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group-listado">
          <label>Suscripción</label>
          <ListadoSuscripciones v-model="cuotaEditada.suscripcion" />
        </div>
        <div class="form-group-listado">
          <label>Trabajo</label>
          <ListadoTrabajos v-model="cuotaEditada.trabajo" />
        </div>
      </div>
      
      <div class="form-group-toggle">
        <label for="pagada">Estado de la Cuota:</label>
        <div class="toggle-switch">
          <input type="checkbox" id="pagada" v-model="cuotaEditada.pagada" />
          <label for="pagada" class="slider"></label>
        </div>
        <span :class="cuotaEditada.pagada ? 'pagada' : 'pendiente'">
          {{ cuotaEditada.pagada ? 'Pagada' : 'Pendiente' }}
        </span>
      </div>

      <div class="botones-formulario">
        <button type="button" class="btn-cancelar" @click="cancelar">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="button" class="btn-guardar" @click="intentarGuardar" :disabled="!formularioValido">
          <i class="fas fa-save"></i> Guardar Cambios
        </button>
      </div>

    </div>

    <Transition name="modal-fade">
      <div v-if="mostrarConfirmacion" class="modal-overlay">
        <div class="modal-confirmacion"> <div class="modal-header">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Confirmar Cambios</h3>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro que deseas guardar los cambios en esta cuota?</p>
          </div>
          <div class="modal-footer">
            <button class="btn-modal btn-cancelar-modal" @click="mostrarConfirmacion = false">
              Cancelar
            </button>
            <button class="btn-modal btn-confirmar-modal" @click="confirmarGuardar">
              Sí, Confirmar
            </button>
          </div>
        </div>
      </div>
    </Transition>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ListadoSuscripciones from '../Listados/ListadoSuscripciones.vue';
import ListadoTrabajos from '../Listados/ListadoTrabajos.vue';

const props = defineProps({
  cuotaOriginal: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['cancelar-modificacion', 'guardar-modificacion-cuota']);

const cuotaEditada = ref(JSON.parse(JSON.stringify(props.cuotaOriginal)));
const mostrarConfirmacion = ref(false);

// Opciones para los <select>
const opcionesMeses = [
  { valor: 'January', nombre: 'Enero' },
  { valor: 'February', nombre: 'Febrero' },
  { valor: 'March', nombre: 'Marzo' },
  { valor: 'April', nombre: 'Abril' },
  { valor: 'May', nombre: 'Mayo' },
  { valor: 'June', nombre: 'Junio' },
  { valor: 'July', nombre: 'Julio' },
  { valor: 'August', nombre: 'Agosto' },
  { valor: 'September', nombre: 'Septiembre' },
  { valor: 'October', nombre: 'Octubre' },
  { valor: 'November', nombre: 'Noviembre' },
  { valor: 'December', nombre: 'Diciembre' }
];

const opcionesAnios = computed(() => {
  const anios = [];
  for (let i = 2050; i >= 2010; i--) {
    anios.push(i);
  }
  return anios;
});

// --- VALIDACIÓN ---
const fechaVencimientoValida = computed(() => {
  if (!cuotaEditada.value?.fechaComienzo || !cuotaEditada.value?.vencimiento) {
    return true; 
  }
  return new Date(cuotaEditada.value.vencimiento) >= new Date(cuotaEditada.value.fechaComienzo);
});

const formularioValido = computed(() => {
  if (!cuotaEditada.value) return false;
  const c = cuotaEditada.value;
  
  return c.monto > 0 &&
        c.mes &&
        c.anio &&
        c.fechaComienzo &&
        c.vencimiento &&
        c.trabajo &&
        c.suscripcion &&
        fechaVencimientoValida.value;
});
// --- FIN VALIDACIÓN ---

// --- MANEJO DE BOTONES (Lógica ya era correcta) ---
const cancelar = () => {
  emit('cancelar-modificacion');
};

const intentarGuardar = () => {
  if (!formularioValido.value) return;
  mostrarConfirmacion.value = true;
};

const confirmarGuardar = () => {
  // --- TODO: AQUÍ IRÁ LA LLAMADA A LA API ---
  // try {
  //   await api.actualizarCuota(cuotaEditada.value.idCuota, cuotaEditada.value);
  //   mostrarConfirmacion.value = false;
  //   emit('guardar-modificacion-cuota', cuotaEditada.value);
  // } catch (error) {
  //   console.error(error);
  //   alert('Error al guardar la cuota');
  //   mostrarConfirmacion.value = false;
  // }
  // --- FIN TODO ---
  
  // Simulación (sin API):
  mostrarConfirmacion.value = false;
  emit('guardar-modificacion-cuota', cuotaEditada.value);
};

</script>

<style scoped>
/* Contenedor principal */
.contenedor-modificar-cuota {
  background: #fdfdfd;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: slide-fade-in 0.3s ease-out;
}
@keyframes slide-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-modificacion {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
}
.titulo-modificacion {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 0;
}
.titulo-modificacion i {
  color: #dc3545;
}
.subtitulo-modificacion {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

/* Formulario */
.formulario-cuota {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}
.form-group, .form-group-listado {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.form-group label, .form-group-listado label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}
.form-group input, .form-group select {
  padding: 0.8rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  font-family: 'Poppins', sans-serif;
}
.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
}
.error-validacion {
  font-size: 0.8rem;
  color: #dc3545;
  margin: 0.25rem 0 0 0;
}

/* --- ESTILOS RESTAURADOS PARA EL TOGGLE SWITCH --- */
.form-group-toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
.form-group-toggle label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}
.form-group-toggle .pagada {
  font-weight: 600;
  color: #28a745;
}
.form-group-toggle .pendiente {
  font-weight: 600;
  color: #ff9800;
}
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 28px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #28a745;
}
input:checked + .slider:before {
  transform: translateX(22px);
}
/* --- FIN DE ESTILOS RESTAURADOS --- */

/* Botones */
.botones-formulario {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  flex-wrap: wrap; 
}
.btn-cancelar, .btn-guardar {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-cancelar {
  background: #6c757d;
  color: white;
}
.btn-cancelar:hover {
  background: #5a6268;
}
.btn-guardar {
  background: #28a745;
  color: white;
}
.btn-guardar:hover:not(:disabled) {
  background: #218838;
}
.btn-guardar:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

/* --- AÑADIDO: Media Queries para Responsive --- */
@media (max-width: 480px) {
  .formulario-cuota {
    padding: 1rem;
  }
  .header-modificacion {
    padding: 1.5rem;
  }
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem; 
  }
  .form-group-toggle {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
  .botones-formulario {
    flex-direction: column;
  }
  .btn-cancelar, .btn-guardar {
    width: 100%; 
    justify-content: center;
  }
}
</style>