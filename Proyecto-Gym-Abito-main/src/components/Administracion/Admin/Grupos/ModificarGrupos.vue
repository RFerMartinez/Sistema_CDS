<template>
  <div class="contenedor">
    
    <div class="encabezado">
      <Titulo texto="MODIFICAR GRUPOS" />
      <p class="subtitulo">Gestiona y cambia los horarios de los grupos y días</p>
    </div>

    <div class="acciones-globales">
      <button class="btn-anadir" @click="anadirNuevoGrupo">
        <div class="icon-circle">
          <i class="fas fa-plus"></i>
        </div>
        <span>Añadir Nuevo Grupo</span>
      </button>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <span>Cargando grupos...</span>
    </div>

    <div v-else class="lista-grupos" ref="listaGruposRef">
      <FilaModificarGrupo
        v-for="grupo in grupos"
        :key="grupo.nroGrupo"
        :grupo="grupo"
        @guardar-grupo="manejarGuardarGrupo"
        @eliminar-grupo="manejarEliminarGrupo"
      />
    </div>

    <Transition name="modal-fade">
      <div v-if="mostrarModalConfirmacion" class="modal-overlay">
        <div class="modal-confirmacion" style="border-top: 5px solid #F44336;"> 
          <div class="modal-header">
            <i class="fas fa-exclamation-triangle" style="color: #F44336;"></i>
            <h3>Eliminar Grupo</h3>
          </div>
          <div class="modal-body"><p>{{ mensajeModalConfirmacion }}</p></div>
          <div class="modal-footer">
            <button class="btn-modal btn-cancelar-modal" @click="mostrarModalConfirmacion = false">Cancelar</button>
            <button class="btn-modal btn-confirmar-peligro" @click="confirmarEliminacion">Sí, Confirmar</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="mostrarModalExito" class="modal-overlay">
        <div class="modal-exito">
          <div class="modal-header-exito"><i class="fas fa-check-circle"></i><h3>¡Éxito!</h3></div>
          <div class="modal-body-exito"><p>{{ mensajeModalExito }}</p></div>
          <div class="modal-footer-exito">
            <button class="btn-modal-continuar" @click="handleContinuarExito">Continuar</button>
          </div>
        </div>
      </div>
    </Transition>
    
    <Transition name="modal-fade">
      <div v-if="mostrarModalError" class="modal-overlay">
        <div class="modal-error"> 
          <div class="modal-header-error"><i class="fas fa-exclamation-triangle"></i> <h3>Error</h3></div>
          <div class="modal-body-error"><p>{{ mensajeModalError }}</p></div>
          <div class="modal-footer-error">
            <button class="btn-modal-error" @click="handleContinuarError">Entendido</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Titulo from '../../Titulo.vue';
import FilaModificarGrupo from './FilaModificarGrupo.vue'; 
const listaGruposRef = ref(null)
const grupos = ref([])
const loading = ref(true)

// Modales Refs
const mostrarModalExito = ref(false);
const mensajeModalExito = ref('');
const mostrarModalError = ref(false);
const mensajeModalError = ref('');
const mostrarModalConfirmacion = ref(false);
const mensajeModalConfirmacion = ref('');
const grupoPendienteEliminar = ref(null);

import {
  obtenerHorariosCompletos,
  eliminarHorarioGrupo,
  crearHorarioGrupo,
  actualizarHorarioGrupo
} from '@/api/services/horarioService';

const listarGrupoFromAPI = async () => {
  loading.value = true
  try {
    const data = await obtenerHorariosCompletos(); 
    grupos.value = data;
  } catch (error) {
    console.error("Error API:", error);
    mensajeModalError.value = error.response?.data?.detail || "Error al cargar grupos.";
    mostrarModalError.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(async () => { listarGrupoFromAPI(); })

const anadirNuevoGrupo = async() => {
  const maxNro = Math.max(0, ...grupos.value.map(g => parseInt(g.nroGrupo) || 0));
  const nuevoGrupo = {
    nroGrupo: String(maxNro + 1),
    horaInicio: '09:00:00', 
    horaFin: '10:00:00',  
    dias_asignados: [],
    _isNew: true 
  }
  grupos.value.push(nuevoGrupo)
  await nextTick();
  if (listaGruposRef.value) {
    const ultimoElemento = listaGruposRef.value.lastElementChild;
    if (ultimoElemento) ultimoElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

const manejarGuardarGrupo = async (grupoModificado) => {
  try {
    let mensaje = '';
    if (grupoModificado._isNew) {
      const grupoParaCrear = { ...grupoModificado };
      delete grupoParaCrear._isNew; 
      delete grupoParaCrear.originalNroGrupo;
      const grupoCreado = await crearHorarioGrupo(grupoParaCrear);
      const index = grupos.value.findIndex(g => g._isNew && g.nroGrupo === grupoModificado.nroGrupo);
      if (index !== -1) grupos.value[index] = grupoCreado; 
      mensaje = 'Grupo añadido correctamente';
    } else {
      const grupoParaGuardar = { ...grupoModificado };
      const grupoActualizado = await actualizarHorarioGrupo(grupoParaGuardar);
      const index = grupos.value.findIndex(g => g.nroGrupo === grupoModificado.originalNroGrupo);
      if (index !== -1) grupos.value[index] = grupoActualizado;
      mensaje = 'Grupo modificado correctamente';
    }
    mensajeModalExito.value = mensaje;
    mostrarModalExito.value = true;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || 'No se pudo guardar.';
    mensajeModalError.value = errorMsg;
    mostrarModalError.value = true;
  } finally {
    await listarGrupoFromAPI();
  }
}

const manejarEliminarGrupo = (grupoParaEliminar) => {
  if (grupoParaEliminar._isNew) {
    grupos.value = grupos.value.filter(g => g.nroGrupo !== grupoParaEliminar.nroGrupo);
    return;
  }
  grupoPendienteEliminar.value = grupoParaEliminar;
  mensajeModalConfirmacion.value = "¿Estás seguro que deseas eliminar este grupo?";
  mostrarModalConfirmacion.value = true;
}

const confirmarEliminacion = async () => {
  mostrarModalConfirmacion.value = false;
  if (!grupoPendienteEliminar.value) return;
  try {
    const exito = await eliminarHorarioGrupo(grupoPendienteEliminar.value.nroGrupo);
    if (exito) {
      grupos.value = grupos.value.filter(g => g.nroGrupo !== grupoPendienteEliminar.value.nroGrupo);
      mensajeModalExito.value = 'Grupo eliminado correctamente';
      mostrarModalExito.value = true;
    } else { throw new Error("Fallo"); }
  } catch (error) {
    mensajeModalError.value = error.response?.data?.error || 'Error al eliminar.';
    mostrarModalError.value = true;
  } finally {
    grupoPendienteEliminar.value = null;
  }
}

const handleContinuarExito = () => { mostrarModalExito.value = false; }
const handleContinuarError = () => { mostrarModalError.value = false; }
</script>

<style scoped>
.contenedor {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  width: 100%;
  margin: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  min-height: 80vh;
  box-sizing: border-box;
}

/* Encabezado limpio */
.encabezado {
  text-align: center;
  margin-bottom: 2.5rem;
}
.subtitulo {
  color: #666; font-size: 1.1rem; font-weight: 300; margin-top: 0.5rem;
}

/* Botón Añadir Mejorado */
.acciones-globales {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start; 
}

.btn-anadir {
  padding: 0.75rem 1.5rem;
  background-color: #ffffff;
  border: 2px solid #333; /* Borde negro como en la img */
  color: #333;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-anadir:hover {
  background-color: #f4f4f4;
  border-color: #e50914; /* Rojo al hacer hover */
  color: #e50914;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.icon-circle {
  background: rgba(255,255,255,0.2);
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 0.8rem;
}

/* Loading & List */
.loading-container { display: flex; flex-direction: column; align-items: center; padding: 4rem; gap: 1rem; color: #666; }
.spinner { border: 4px solid rgba(0,0,0,0.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: #D32F2F; animation: spin 1s infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* En ModificarGrupos.vue */
.lista-grupos {
  display: flex;
  flex-direction: column;
  gap: 1.2rem; /* ANTES ERA 1.5rem o más. Esto las junta. */
}
/* Modales */
.modal-footer { display: flex; justify-content: center; gap: 1.5rem; padding-bottom: 1.5rem; width: 100%; }

/* Responsive */
@media (max-width: 480px) {
  .contenedor { padding: 1rem; }
  .btn-anadir { width: 100%; justify-content: center; }
}
</style>