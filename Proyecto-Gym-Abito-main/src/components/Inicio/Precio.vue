<template>
  <div class="pricing-card">
    <div class="glow-effect"></div>

    <div class="card-top">
      <span class="plan-type">MEMBRESÍA</span>
      <h3 class="plan-name">{{ precio.nombreSuscripcion }}</h3>
      
      <div class="price-container">
        <div class="price-value">
          <span class="currency">$</span>
          <span class="amount">{{ formatNumber(precio.precio) }}</span>
        </div>
        <span class="period">Por Mes</span>
      </div>
      
    </div>

    <div class="features-list">
      <div class="feature-item">
        <i class="fas fa-check-circle"></i>
        <span>Acceso completo</span>
      </div>
      <div class="feature-item">
        <i class="fas fa-check-circle"></i>
        <span>Con restricción horaria</span>
      </div>
      <div class="feature-item highlight">
        <i class="fas fa-star"></i>
        <span>Asistencia con un entrenador </span>
      </div>
    </div>

    <button class="btn-choose" @click="irLogin('login')">
      <span>ELEGIR PLAN</span>
      <i class="fas fa-arrow-right"></i>
    </button>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatters';
import { useRouter } from 'vue-router';

// 2. Definimos la constante router para poder usarla
const router = useRouter();

const props = defineProps({
  precio: Object
})

function irLogin(modo) {
  router.push({ path: '/login', query: { modo } })
}
const formatNumber = (val) => {
  return Number(val).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
</script>

<style scoped>
.pricing-card {
  background: #0f0f0f;
  border: 1px solid #222;
  border-radius: 4px;
  padding: 40px 30px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.4s ease;
  min-height: 480px; 
}

/* Efecto Hover PC o Scroll Móvil */
.pricing-card:hover,
.pricing-card.active-mobile {
  transform: translateY(-10px);
  border-color: #555;
  background: #141414;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

/* Línea roja brillante */
.glow-effect {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 4px;
  background: #e50914;
  transform: scaleX(0);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
}

.pricing-card:hover .glow-effect,
.pricing-card.active-mobile .glow-effect {
  transform: scaleX(1);
}

.card-top {
  text-align: center;
  border-bottom: 1px solid #222;
  padding-bottom: 30px;
  margin-bottom: 30px;
}

.plan-type {
  font-size: 0.75rem;
  letter-spacing: 2px;
  color: #666;
  text-transform: uppercase;
  font-weight: 700;
}

.plan-name {
  font-size: 1.8rem; 
  color: #fff;
  margin: 10px 0 15px;
  text-transform: uppercase;
  font-weight: 800;
  line-height: 1.1;
}

.price-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #e50914;
}

.price-value {
  display: flex;
  align-items: flex-start;
  line-height: 1;
}

.currency {
  font-size: 1.8rem;
  margin-right: 4px;
  font-weight: 600;
  margin-top: 5px; 
}

.amount {
  font-size: 3.8rem; 
  font-weight: 800;
  letter-spacing: -1px;
}

.period {
  color: #666;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 5px;
  font-weight: 600;
}

.features-list {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #aaa;
  font-size: 0.95rem;
}

.feature-item i {
  color: #333;
  transition: color 0.3s;
}

/* Iconos blancos al activar */
.pricing-card:hover .feature-item i,
.pricing-card.active-mobile .feature-item i {
  color: #fff;
}

.feature-item.highlight {
  color: #fff;
}
.feature-item.highlight i {
  color: #e50914;
}

/* Botón de Acción */
.btn-choose {
  width: 100%;
  padding: 15px;
  background: transparent;
  border: 1px solid #333;
  color: #fff;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.9rem;
}

/* El botón mantiene su hover normal ya que es interactivo */
.btn-choose:hover {
  background: #e50914;
  border-color: #e50914;
  box-shadow: 0 5px 15px rgba(229, 9, 20, 0.3);
}

.btn-choose i {
  transition: transform 0.3s;
}

.btn-choose:hover i {
  transform: translateX(5px);
}
</style>