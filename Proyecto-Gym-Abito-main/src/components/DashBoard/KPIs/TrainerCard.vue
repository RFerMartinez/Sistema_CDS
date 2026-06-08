<template>
  <div class="trainer-card">
    <div class="profile-section">
      <div class="avatar-circle">
        <i class="fas fa-user"></i>
      </div>
      <div class="profile-info">
        <h4 class="name">{{ entrenador.nombre }} {{ entrenador.apellido }}</h4>
        <p class="role">{{ entrenador.rol }}</p>
        <span class="dni-badge">DNI: {{ entrenador.dni }}</span>
      </div>
    </div>

    <div class="metrics-grid">
      
      <div class="metric-item">
        <div class="metric-icon blue">
          <i class="fas fa-users"></i>
        </div>
        <div class="metric-data">
          <span class="label">Alumnos a Cargo</span>
          <span class="value">{{ entrenador.alumnos_a_cargo }}</span>
        </div>
      </div>

      <div class="metric-item">
        <div class="metric-icon green">
          <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="metric-data">
          <span class="label">Recaudado (Mes)</span>
          <span class="value">{{ formatoMoneda(entrenador.monto_recaudado_mes) }}</span>
        </div>
      </div>

      <div class="metric-item">
        <div class="metric-icon red">
          <i class="fas fa-clock"></i>
        </div>
        <div class="metric-data">
          <span class="label">Cuotas Pendientes</span>
          <span class="value">{{ entrenador.cuotas_pendientes }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  entrenador: {
    type: Object,
    required: true
  }
});

const formatoMoneda = (valor) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(valor);
};
</script>

<style scoped>
.trainer-card {
  display: flex;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.05);
  align-items: center;
  gap: 2rem;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%; /* Ocupa todo el ancho */
}

.trainer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

/* Perfil */
.profile-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 250px;
  border-right: 1px solid #eee;
  padding-right: 1.5rem;
}

.avatar-circle {
  width: 60px;
  height: 60px;
  background: #f0f2f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  font-size: 1.5rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

.role {
  margin: 0;
  font-size: 0.9rem;
  color: #718096;
}

.dni-badge {
  margin-top: 4px;
  font-size: 0.8rem;
  background: #edf2f7;
  padding: 2px 6px;
  border-radius: 4px;
  color: #4a5568;
  width: fit-content;
}

/* Métricas */
.metrics-grid {
  display: flex;
  flex: 1;
  justify-content: space-around;
  gap: 1rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.metric-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.metric-icon.blue { background: #ebf8ff; color: #3182ce; }
.metric-icon.green { background: #f0fff4; color: #38a169; }
.metric-icon.red { background: #fff5f5; color: #e53e3e; }

.metric-data {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 500;
}

.value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

/* Responsive */
@media (max-width: 1024px) {
  .trainer-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .profile-section {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 1rem;
    width: 100%;
  }
  
  .metrics-grid {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 600px) {
  .metrics-grid {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>