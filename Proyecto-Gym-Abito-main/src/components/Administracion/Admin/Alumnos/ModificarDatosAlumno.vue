
<template>
  <div class="contenedor-modificar-datos">
    <div class="tarjeta-modificacion">
      <div class="header-modificacion">
        <h2 class="titulo-modificacion">
          <i class="fas fa-edit"></i>
          Modificar Datos del Alumno
        </h2>
        <p class="subtitulo-modificacion">Editando información de {{ alumno.nombre }} {{ alumno.apellido }}</p>
      </div>

      <div class="contenido-modificacion">
        <form @submit.prevent="confirmarGuardar" class="formulario-modificacion">
          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">Información Personal</h3>
            <div class="campos-grid grid-personal">
              <div class="campo">
                <label for="nombre" class="etiqueta-campo">Nombre:</label>
                <input type="text" id="nombre" v-model="datosModificados.nombre" class="input-campo" required>
              </div>
              <div class="campo">
                <label for="apellido" class="etiqueta-campo">Apellido:</label>
                <input type="text" id="apellido" v-model="datosModificados.apellido" class="input-campo" required>
              </div>
              <div class="campo">
                <label for="dni" class="etiqueta-campo">DNI:</label>
                <input type="text" id="dni" v-model="datosModificados.dni" class="input-campo" required>
              </div>
              <div class="campo">
                <label for="email" class="etiqueta-campo">Email:</label>
                <input type="email" id="email" v-model="datosModificados.email" class="input-campo" required>
              </div>
              <div class="campo">
                <label for="telefono" class="etiqueta-campo">Teléfono:</label>
                <input type="tel" id="telefono" v-model="datosModificados.telefono" class="input-campo" required>
              </div>
              
              <div class="campo">
                <label for="sexo" class="etiqueta-campo">Sexo:</label>
                <select id="sexo" v-model="datosModificados.sexo" class="input-campo select-custom" required>
                  <option value="" disabled>Seleccione sexo</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              
            </div>
          </div>

          <div class="seccion-formulario">
            <h3 class="titulo-seccion-formulario">Dirección</h3>
            <div class="campos-grid grid-direccion">
              
              <div class="campo">
                <label for="provincia" class="etiqueta-campo">Provincia:</label>
                <select id="provincia" v-model="datosModificados.provincia" class="input-campo select-custom" required>
                  <option value="" disabled>Seleccione provincia</option>
                  <option>Buenos Aires</option>
                  <option>Córdoba</option>
                  <option>Santa Fe</option>
                  <option>Mendoza</option>
                  <option>Chaco</option> 
                </select>
              </div>
              
              <div class="campo">
                <label for="localidad" class="etiqueta-campo">Localidad:</label>
                <select id="localidad" v-model="datosModificados.localidad" class="input-campo select-custom" required>
                  <option value="" disabled>Seleccione localidad</option>
                  <option>La Plata</option>
                  <option>Capital Federal</option>
                  <option>Mar del Plata</option>
                  <option>Bahía Blanca</option>
                  <option>Las Breñas</option> 
                </select>
              </div>
              
              <div class="campo">
                <label for="calle" class="etiqueta-campo">Calle:</label>
                <input type="text" id="calle" v-model="datosModificados.calle" class="input-campo" required>
              </div>
              <div class="campo">
                <label for="numero" class="etiqueta-campo">Número:</label>
                <input type="text" id="numero" v-model="datosModificados.nro" class="input-campo" required>
              </div>
            </div>
          </div>

          <div class="botones-formulario">
            <button type="button" class="btn-cancelar" @click="cancelar">
              <i class="fas fa-times"></i>
              Cancelar Operación
            </button>
            <button type="submit" class="btn-guardar">
              <i class="fas fa-save"></i>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="mostrarConfirmacion" class="modal-overlay">
      <div class="modal-confirmacion">
        <div class="modal-header">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Confirmar Cambios</h3>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro que deseas actualizar los datos del alumno?</p>
        </div>
        <div class="modal-footer">
          <button class="btn-modal btn-cancelar-modal" @click="cancelarGuardar">
            No, Cancelar
          </button>
          <button class="btn-modal btn-confirmar-modal" @click="guardarCambios">
            Sí, Guardar Cambios
          </button>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  alumno: Object
})

const emit = defineEmits(['guardar-cambios', 'cancelar'])

const datosModificados = ref({})
const datosOriginales = ref({})
const mostrarConfirmacion = ref(false)

onMounted(() => {
  datosOriginales.value = { ...props.alumno }
  datosModificados.value = { ...props.alumno }
})

const hayCambios = () => {
  const campos = ['nombre', 'apellido', 'dni', 'email', 'telefono', 'sexo', 'provincia', 'localidad', 'calle', 'nro']
  
  for (const campo of campos) {
    const originalExists = Object.prototype.hasOwnProperty.call(datosOriginales.value, campo);
    const modificadoExists = Object.prototype.hasOwnProperty.call(datosModificados.value, campo);

    if (originalExists !== modificadoExists) {
      return true;
    }
    if (originalExists && modificadoExists && datosModificados.value[campo] !== datosOriginales.value[campo]) {
      return true
    }
  }
  return false
}

const confirmarGuardar = () => {
  if (!validarFormulario()) {
    return
  }
  
  if (!hayCambios()) {
    emit('cancelar')
    return
  }
  
  mostrarConfirmacion.value = true
}

const validarFormulario = () => {
  const camposRequeridos = ['nombre', 'apellido', 'dni', 'email', 'telefono', 'sexo', 'provincia', 'localidad', 'calle', 'nro']
  
  for (const campo of camposRequeridos) {
    if (!Object.prototype.hasOwnProperty.call(datosModificados.value, campo) || 
        datosModificados.value[campo] === null || 
        datosModificados.value[campo] === undefined || 
        datosModificados.value[campo].toString().trim() === '') {
      alert(`El campo ${campo} es requerido`)
      return false
    }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(datosModificados.value.email)) {
    alert('Por favor ingresa un email válido')
    return false
  }
  
  return true
}

const guardarCambios = () => {
  mostrarConfirmacion.value = false
  
  try {
    console.log('Guardando cambios:', datosModificados.value)
    emit('guardar-cambios', datosModificados.value)
    
  } catch (error) {
    console.error('Error al guardar cambios:', error)
    alert('Error al guardar los cambios. Por favor, intenta nuevamente.')
  }
}

const cancelarGuardar = () => {
  mostrarConfirmacion.value = false
}

const cancelar = () => {
  emit('cancelar')
}

</script>

<style scoped>
.contenedor-modificar-datos {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  min-height: 80vh;
}

.tarjeta-modificacion {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header-modificacion {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  padding: 2rem;
  color: white;
}

.titulo-modificacion {
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.subtitulo-modificacion {
  margin: 0;
  opacity: 0.9;
}

.contenido-modificacion {
  padding: 2rem;
}

.seccion-formulario {
  margin-bottom: 2.5rem;
}

.titulo-seccion-formulario {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #2196F3;
  padding-bottom: 0.5rem;
}

.campos-grid {
  display: grid;
  gap: 1.5rem;
}

.campos-grid.grid-personal {
  grid-template-columns: repeat(3, 1fr);
}

.campos-grid.grid-direccion {
  grid-template-columns: repeat(2, 1fr);
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.etiqueta-campo {
  font-weight: 600;
  color: #495057;
  font-size: 1rem;
}

.input-campo {
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background-color: white; 
  color: #2c3e50;
}

.input-campo:focus {
  outline: none;
  border-color: #2196F3;
}

.input-campo.select-custom {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23495057' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 16px;
  
  padding-right: 3rem; 
  cursor: pointer;
}

.input-campo.select-custom option {
  background: #ffffff;
  color: #1a1a1a;
}

.botones-formulario {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.btn-cancelar, .btn-guardar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancelar {
  background: #f44336;
  color: white;
}

.btn-cancelar:hover {
  background: #d32f2f;
  transform: translateY(-1px);
}

.btn-guardar {
  background: #4caf50;
  color: white;
}

.btn-guardar:hover {
  background: #388e3c;
  transform: translateY(-1px);
}

/* ----- ESTILOS DE MODAL ELIMINADOS DE AQUÍ ----- */

@media (max-width: 768px) {
  .contenedor-modificar-datos {
    padding: 1rem;
  }
  
  .campos-grid, 
  .campos-grid.grid-personal, 
  .campos-grid.grid-direccion {
    grid-template-columns: 1fr; 
  }
  
  .botones-formulario {
    flex-direction: column;
  }
}
</style>
