<template>
  <div class="fila-pro" :class="{ 'editando': modoEdicion, 'nuevo': grupo._isNew }">
    
    <div class="wrapper-transicion">
      <Transition name="smooth-expand" mode="out-in">

        <!-- ================= VISTA LECTURA ================= -->
        <div v-if="!modoEdicion" key="vista" class="vista-flex">
          
          <div class="bloque-id-centrado">
            <div class="icono-grupo-wrapper">
              <i class="fas fa-user-friends"></i> 
            </div>
            <div class="texto-id">
              <span class="label-id">GRUPO</span>
              <span class="numero-id">{{ grupo.nroGrupo }}</span>
            </div>
          </div>
          
          <div class="bloque-datos">
            <div class="dato-item">
              <i class="far fa-clock icono-acento"></i>
              <div class="info-textos">
                <span class="dato-label">HORARIO</span>
                <span class="dato-valor">{{ formatoHora(grupo.horaInicio) }} - {{ formatoHora(grupo.horaFin) }}</span>
              </div>
            </div>
            
            <div class="dato-item">
              <i class="far fa-calendar-alt icono-acento"></i>
              <div class="info-textos">
                <span class="dato-label">Días Asignados</span>
                <span class="dato-valor">
                  {{ grupo.dias_asignados.length > 0 ? grupo.dias_asignados.length + ' días / Semana' : 'Sin asignar' }}
                </span>
              </div>
            </div>
          </div>

          <div class="bloque-acciones">
            <button class="btn-accion-sutil editar" @click="activarModoEdicion" title="Modificar">
              <i class="fas fa-pen"></i>
            </button>
            <button class="btn-accion-sutil eliminar" @click="emitirEliminarGrupo" title="Eliminar">
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <!-- ================= MODO EDICIÓN ================= -->
        <form v-else key="edicion" class="form-compacto" @submit.prevent="guardarCambios">
          
          <div class="header-edit-layout">
            
            <div class="col-input-grupo">
              <label class="label-superior">Número de Grupo</label>
              <input 
                type="text" 
                v-model="grupoEditable.nroGrupo" 
                class="input-clean input-num"
                :disabled="!props.grupo._isNew"
              />
            </div>

            <div class="col-input-hora">
               
               <div class="hora-box">
                  <label class="label-superior">Hora Inicio</label>
                  <div class="input-time-wrapper">
                    <input type="time" class="input-clean time" v-model="horaInicioEdit" />
                  </div>
               </div>

               <div class="separador-container">
                 <span class="separador-hora">-</span>
               </div>

               <div class="hora-box">
                  <label class="label-superior">Hora Fin</label>
                  <div class="input-time-wrapper">
                    <input type="time" class="input-clean time" v-model="horaFinEdit" />
                  </div>
               </div>

            </div>
          </div>

          <div class="seccion-dias-compacta">
            <p class="label-seccion">Días y Cupos</p>
            <div class="grid-dias-compacto">
              <div 
                v-for="dia in diasEditables" 
                :key="dia.nombre" 
                class="card-dia"
                :class="{ 'seleccionado': dia.seleccionado }"
                @click="toggleDia(dia)"
              >
                <div class="card-dia-header">
                  <i class="fas fa-check-circle icon-check"></i>
                  <span class="dia-nombre">{{ dia.nombre.substring(0, 3) }}</span>
                </div>
                
                <div class="card-dia-body" @click.stop>
                   <div v-if="dia.seleccionado" class="cupo-input-group">
                      <label>Cupo</label>
                      <input
                        type="number"
                        class="input-cupo-mini"
                        v-model.number="dia.capacidadMax"
                        min="1"
                        placeholder="-"
                      />
                   </div>
                   <span v-else class="placeholder-dash">—</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-footer">
            <button type="button" class="btn-texto" @click="cancelarEdicion">Cancelar</button>
            <button type="submit" class="btn-slate-guardar">
              Guardar Cambios
            </button>
          </div>

        </form>
      </Transition>
    </div>

  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({ grupo: { type: Object, required: true } })
const emit = defineEmits(['guardar-grupo', 'eliminar-grupo'])

const modoEdicion = ref(false)
const grupoEditable = ref(null) 
const diasEditables = ref([]) 
const nroGrupoOriginal = ref(null); 
const horaInicioEdit = ref('00:00')
const horaFinEdit = ref('00:00')

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const activarModoEdicion = () => {
  grupoEditable.value = JSON.parse(JSON.stringify(props.grupo))
  nroGrupoOriginal.value = props.grupo.nroGrupo; 
  horaInicioEdit.value = props.grupo.horaInicio.substring(0, 5)
  horaFinEdit.value = props.grupo.horaFin.substring(0, 5)

  const diasNuevos = []
  diasSemana.forEach(nombreDia => {
    const diaExistente = props.grupo.dias_asignados.find(d => d.dia === nombreDia)
    if (diaExistente) {
      diasNuevos.push({ ...diaExistente, nombre: nombreDia, seleccionado: true })
    } else {
      diasNuevos.push({ nombre: nombreDia, seleccionado: false, capacidadMax: null, alumnos_inscritos: 0, empleado: null })
    }
  })
  diasEditables.value = diasNuevos
  modoEdicion.value = true
}

const toggleDia = (dia) => {
  dia.seleccionado = !dia.seleccionado;
  if (!dia.seleccionado) dia.capacidadMax = null;
}

const guardarCambios = () => {
  const nuevosDiasAsignados = diasEditables.value
    .filter(dia => dia.seleccionado) 
    .map(dia => ({
        dia: dia.nombre,
        capacidadMax: dia.capacidadMax || 0,
        alumnos_inscritos: dia.alumnos_inscritos, 
        empleado: dia.empleado 
    }))

  const grupoActualizado = {
    ...grupoEditable.value,
    horaInicio: horaInicioEdit.value + ':00', 
    horaFin: horaFinEdit.value + ':00',
    dias_asignados: nuevosDiasAsignados,
    originalNroGrupo: nroGrupoOriginal.value 
  }
  
  if (props.grupo._isNew) {
      grupoActualizado._isNew = true;
      delete grupoActualizado.originalNroGrupo; 
  }
  emit('guardar-grupo', grupoActualizado)
  modoEdicion.value = false
}

const cancelarEdicion = () => {
  if (props.grupo._isNew) emit('eliminar-grupo', props.grupo)
  modoEdicion.value = false
}
const emitirEliminarGrupo = () => { emit('eliminar-grupo', props.grupo) }
const formatoHora = (h) => (!h || typeof h !== 'string') ? '--:--' : h.substring(0, 5)

watchEffect(() => { if (props.grupo._isNew) activarModoEdicion() })
</script>

<style scoped>
/* --- TARJETA BASE --- */
.fila-pro {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  border: 1px solid #eee;
  border-left: 6px solid #D32F2F; 
  overflow: hidden;
  margin-bottom: 0; 
  transition: all 0.3s ease;
}
.fila-pro:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}
.fila-pro.editando {
  transform: none;
  box-shadow: 0 5px 20px rgba(0,0,0,0.06);
  border: 1px solid #ddd;
  border-left: 6px solid #D32F2F;
}

/* --- VISTA LECTURA --- */
.vista-flex {
  display: flex; align-items: center; padding: 1.5rem 2rem; gap: 2rem; 
}

/* ID Grupo */
.bloque-id-centrado {
  display: flex; align-items: center; gap: 1.2rem; padding-right: 2rem; border-right: 1px solid #f0f0f0;
  min-width: 140px;
}
.icono-grupo-wrapper {
  font-size: 1.4rem; color: #D32F2F; 
  background: #fff0f0; 
  width: 48px; height: 48px; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center;
}
.texto-id { display: flex; flex-direction: column; justify-content: center; }
.label-id { font-size: 0.75rem; font-weight: 700; color: #999; letter-spacing: 0.5px; }
.numero-id { font-size: 2rem; font-weight: 800; color: #333; line-height: 1; }

/* Datos */
.bloque-datos { flex: 1; display: flex; gap: 4rem; align-items: center; }
.dato-item { display: flex; align-items: center; gap: 0.8rem; }
.icono-acento { font-size: 1.4rem; color: #D32F2F; opacity: 0.9; }
.info-textos { display: flex; flex-direction: column; }
.dato-label { font-size: 0.75rem; color: #888; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px; }
.dato-valor { font-size: 1.1rem; color: #333; font-weight: 600; }

/* Acciones */
.bloque-acciones { display: flex; gap: 0.8rem; }
.btn-accion-sutil {
  width: 40px; height: 40px; border-radius: 50%; border: 1px solid transparent; background: #f8f9fa;
  color: #666; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem;
  transition: all 0.2s;
}
.btn-accion-sutil:hover { background: #e9ecef; color: #333; }
.btn-accion-sutil.eliminar:hover { background: #fff0f0; color: #D32F2F; }


/* --- MODO EDICIÓN --- */
.form-compacto { padding: 1.5rem 2rem; background: #fff; }

/* LAYOUT SUPERIOR: Flexbox en escritorio */
.header-edit-layout {
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start;
  margin-bottom: 2rem; 
  gap: 2rem;
}

/* Columna Numero Grupo */
.col-input-grupo { flex: 0 0 auto; }
.input-num { width: 150px; }

/* Columna Horas (Alineada a la derecha) */
.col-input-hora {
  display: flex; 
  align-items: flex-end; 
  gap: 1rem;
}
.hora-box { display: flex; flex-direction: column; }
.input-clean {
  padding: 0.6rem 0.8rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; color: #333;
  transition: border 0.2s; background: #fdfdfd;
}
.input-clean:focus { border-color: #D32F2F; outline: none; background: white; }
.input-clean.time { text-align: center; font-weight: 600; width: 110px; }

.label-superior { font-size: 0.95rem; font-weight: 700; color: #333; margin-bottom: 0.4rem; display: block; }
.separador-container { display: flex; align-items: center; padding-bottom: 0.6rem; }
.separador-hora { font-weight: bold; color: #ccc; font-size: 1.2rem; }

/* SECCIÓN DÍAS */
.seccion-dias-compacta { margin-bottom: 2rem; }
.label-seccion { font-weight: 700; color: #333; margin-bottom: 0.8rem; font-size: 0.95rem; }
.grid-dias-compacto { 
  display: grid; 
  /* Por defecto: Tarjetas fluidas */
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); 
  gap: 0.8rem; 
}

.card-dia {
  border: 1px solid #e0e0e0; border-radius: 8px; cursor: pointer; transition: all 0.2s;
  display: flex; flex-direction: column; overflow: hidden; background: white;
}
.card-dia-header {
  padding: 0.5rem; 
  display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  background: #fdfdfd; border-bottom: 1px solid #f0f0f0; color: #888;
}
.icon-check { font-size: 0.9rem; opacity: 0.3; transition: all 0.2s; }
.dia-nombre { font-weight: 700; text-transform: uppercase; font-size: 0.8rem; }

/* SELECCIÓN */
.card-dia.seleccionado {
  border-color: #546E7A; /* Azul Grisáceo */
  background-color: #fcfcfc;
}
.card-dia.seleccionado .card-dia-header {
  color: #546E7A; 
  border-bottom-color: rgba(84, 110, 122, 0.2);
}
.card-dia.seleccionado .icon-check { opacity: 1; color: #546E7A; }

.card-dia-body { 
  padding: 0.5rem 0.2rem; 
  text-align: center; min-height: 50px; 
  display: flex; 
  flex-direction: column; 
  align-items: center;    
  justify-content: center; 
}

/* === CENTRADO DE CUPOS (CORREGIDO Y FORZADO) === */
.cupo-input-group {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra horizontalmente el contenido */
  justify-content: center;
  width: 100%;
}

.cupo-input-group label { 
  width: 100%;
  text-align: center; 
  font-size: 0.6rem; 
  color: #546E7A; 
  margin-bottom: 4px; 
  font-weight: 700; 
  text-transform: uppercase; 
  display: block; /* Asegura bloque */
}

/* --- QUITAR FLECHAS DE INPUT NUMBER PARA CENTRAR --- */
.input-cupo-mini::-webkit-outer-spin-button,
.input-cupo-mini::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input-cupo-mini {
  width: 70%; 
  text-align: center; 
  border: 1px solid #ccc; 
  border-radius: 4px; 
  padding: 3px;
  font-size: 1rem; 
  font-weight: 700; 
  color: #333; 
  display: block; 
  margin: 0 auto; 
}
.input-cupo-mini:focus { border-color: #546E7A; outline: none; }
.placeholder-dash { color: #eee; font-size: 1.5rem; font-weight: 300; }

/* BOTONES FOOTER */
.form-footer { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.2rem; border-top: 1px solid #f0f0f0; align-items: center; }
.btn-texto { background: none; border: none; font-size: 0.9rem; color: #666; font-weight: 600; cursor: pointer; padding: 0.5rem 1rem; }
.btn-texto:hover { color: #333; text-decoration: underline; }

/* Botón SLATE */
.btn-slate-guardar {
  background-color: #37474F; 
  color: white; border: none; padding: 0.7rem 2rem; border-radius: 6px;
  font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: background 0.2s;
  box-shadow: 0 3px 8px rgba(0,0,0,0.15);
}
.btn-slate-guardar:hover { background-color: #263238; transform: translateY(-1px); }

/* Animación Expandir SUAVE */
.smooth-expand-enter-active,
.smooth-expand-leave-active {
  transition: all 0.4s ease;
  max-height: 600px;
  opacity: 1;
  overflow: hidden;
}
.smooth-expand-enter-from,
.smooth-expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* ================= RESPONSIVE ================= */

/* Tablet y Desktop pequeño */
@media (max-width: 900px) {
  .vista-flex { flex-direction: column; align-items: flex-start; gap: 1.5rem; padding: 1.2rem; }
  .bloque-id-centrado { border-right: none; border-bottom: 1px solid #eee; padding-bottom: 1rem; width: 100%; }
  .bloque-datos { flex-direction: column; align-items: flex-start; gap: 1rem; width: 100%; }
  .bloque-acciones { width: 100%; justify-content: flex-end; }
  
  .form-footer { flex-direction: column-reverse; gap: 1rem; }
  .btn-slate-guardar, .btn-texto { width: 100%; }
}

/* === CELULARES (Layout Específico) === */
@media (max-width: 600px) {
  /* Header Edición: Se apila y se distribuye mejor */
  .header-edit-layout { 
    flex-direction: column; 
    gap: 1.5rem; 
    align-items: stretch; /* Ocupar ancho completo */
  }
  
  /* Input Grupo Full Width */
  .col-input-grupo { width: 100%; }
  .input-num { width: 100%; } 

  /* Horarios en Grid para alinear bien Inicio y Fin */
  .col-input-hora {
    display: grid;
    grid-template-columns: 1fr auto 1fr; /* Inicio - Sep - Fin */
    align-items: end;
    gap: 0.5rem;
    width: 100%;
  }
  
  .hora-box { width: 100%; min-width: 0; } /* Asegura que no se desborden */
  .input-clean.time { width: 100%; min-width: 0; text-align: center; }
  
  /* Centrar separador verticalmente */
  .separador-container { 
    display: flex; justify-content: center; padding-bottom: 0.8rem; 
  }

  /* Grid Días: 2 Columnas Estrictas */
  .grid-dias-compacto { 
    grid-template-columns: repeat(2, 1fr); 
  }
}
</style>