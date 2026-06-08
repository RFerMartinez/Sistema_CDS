<template>
  <div class="horario-alumno-container">
    <div v-if="!horarios || horarios.length === 0" class="sin-horarios">
      <div class="icono-vacio">
        <i class="fas fa-calendar-times"></i>
      </div>
      <p>Aún no tienes horarios asignados.</p>
    </div>
    
    <div v-else class="lista-horarios">
      <ListaHorarioAlumno 
        v-for="(item, index) in horarios" 
        :key="index" 
        :horario="item" 
      />
    </div>
  </div>
</template>

<script setup>
import ListaHorarioAlumno from './ListaHorarioAlumno.vue';

const props = defineProps({
  horarios: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script>

<style scoped>
.horario-alumno-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.lista-horarios {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sin-horarios {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.icono-vacio {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.sin-horarios p {
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}
</style>