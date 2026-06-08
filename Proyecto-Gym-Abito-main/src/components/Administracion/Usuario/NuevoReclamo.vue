
<template>
  <div class="nuevo-reclamo-container">
    <h2 class="subtitulo">Nueva observación</h2>
    
    <!-- FORMULARIO COMPACTO -->
    <div class="form-group compacto">
      <label>Descripción:</label>
      <textarea 
        v-model="descripcion" 
        class="campo-texto"
        rows="4"
        required
        placeholder="Describe tu observación aquí..."
      ></textarea>
    </div>
    
    <div class="acciones">
      <button type="submit" @click="guardar" class="btn-guardar">
        <i class="fas fa-check"></i>
        Guardar
      </button>
      <button type="button" @click="cancelar" class="btn-cancelar">
        <i class="fas fa-times"></i>
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['guardar', 'cancelar'])

const descripcion = ref('')

const guardar = () => {
  if (!descripcion.value.trim()) return
  
  // const nuevoReclamo = {
  //   id: Math.floor(Math.random() * 900) + 100,
  //   fecha: new Date().toLocaleDateString('es-AR'),
  //   hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
  //   descripcion: descripcion.value
  // }
  // emit('guardar', nuevoReclamo)

  // Ahora solo emitimos el texto de la descripción
  emit('guardar', descripcion.value);

  // Limpiamos el campo después de emitir
  descripcion.value = ''
}

const cancelar = () => {
  emit('cancelar')
}
</script>

<style scoped>
.nuevo-reclamo-container {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  margin-bottom: 1rem;
}

.subtitulo {
  font-size: 1.3rem;
  /* Cambiado a un azul pizarra profesional para evitar la sensación de "peligro" */
  color: #334155; 
  margin-bottom: 1.2rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;
  text-align: left; /* Asegurado a la izquierda */
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 600;
  color: #475569;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
}

.campo-texto {
  width: 100%;
  padding: 0.8rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  color: #1e293b;
  background-color: #f8fafc;
  transition: all 0.3s ease;
  resize: none;
  box-sizing: border-box;
}

.campo-texto:focus {
  outline: none;
  border-color: #10b981; /* Verde al hacer foco para una sensación positiva */
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.acciones {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.btn-guardar {
  flex: 1;
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.btn-guardar:hover {
  background-color: #059669;
  transform: translateY(-1px);
}

.btn-cancelar {
  flex: 1;
  background-color: #64748b; /* Gris azulado neutro para cancelar */
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.btn-cancelar:hover {
  background-color: #475569;
  transform: translateY(-1px);
}

/* RESPONSIVE MÓVIL CORREGIDO */
@media (max-width: 480px) {
  .nuevo-reclamo-container {
    padding: 1.2rem;
    border-radius: 12px;
  }

  .subtitulo {
    font-size: 1.2rem;
    text-align: left; /* CORRECCIÓN: Ahora se queda a la izquierda en móvil */
  }

  .acciones {
    flex-direction: row; 
    gap: 0.5rem;
  }

  .btn-guardar, .btn-cancelar {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
}
</style>