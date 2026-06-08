<template>
  <div class="modal-overlay" @click.self="$emit('cerrar')" @wheel.prevent @touchmove.prevent>
    <div class="modal-content fade-in">
      <button class="close-btn" @click="$emit('cerrar')"><i class="fas fa-times"></i></button>
      
      <span class="brand-tag">CONTACTO</span>
      <p class="modal-text">Consulta disponibilidad de cupos, precios o cualquier duda directamente con nosotros.</p>

      <div v-if="sala === 'sala1'" class="double-contact-container">
        <div class="contact-section">
          <span class="shift-label">TURNO MAÑANA</span>
          <div class="contact-info mini">
            <i class="fab fa-whatsapp whatsapp-icon"></i>
            <span>{{ telefonos.maniana }}</span>
          </div>
          <a :href="generarLink(telefonos.maniana, 'mañana')" target="_blank" class="action-btn">
            CONSULTAR
          </a>
        </div>

        <div class="section-divider"></div>

        <div class="contact-section">
          <span class="shift-label">TURNO TARDE</span>
          <div class="contact-info mini">
            <i class="fab fa-whatsapp whatsapp-icon"></i>
            <span>{{ telefonos.sala1 }}</span>
          </div>
          <a :href="generarLink(telefonos.sala1, 'tarde')" target="_blank" class="action-btn">
            CONSULTAR
          </a>
        </div>
      </div>

      <div v-else class="single-contact-container">
        <div class="contact-info">
          <i class="fab fa-whatsapp whatsapp-icon"></i>
          <span>{{ telefonos.sala2 }}</span>
        </div>
        <a :href="generarLink(telefonos.sala2, 'Sala 02')" target="_blank" class="action-btn">
          ENVIAR MENSAJE
        </a>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, defineProps } from 'vue'

const props = defineProps({
  sala: {
    type: String,
    default: 'sala1'
  }
})

// Mapeo de todos los números desde el .env
const telefonos = {
  sala1: process.env.VUE_APP_SALA1_TELEFONO || "+54 9 3731 40-7828",
  sala2: process.env.VUE_APP_SALA2_TELEFONO || "+54 9 3731 58-1521",
  maniana: process.env.VUE_APP_MANIANA_TELEFONO || "+54 9 3731 51-0702"
}

// Función para limpiar número y generar link de WhatsApp
const generarLink = (numero, turno) => {
  const limpio = numero.replace(/\D/g, '')
  const texto = props.sala === 'sala1' 
    ? `Hola, quiero consultar por cupos disponibles del turno ${turno}` 
    : `Hola, quiero consultar por las Clases Grupales`;
  return `https://wa.me/${limpio}?text=${encodeURIComponent(texto)}`
}

onMounted(() => {
  document.body.style.setProperty('overflow', 'hidden', 'important')
  document.documentElement.style.setProperty('overflow', 'hidden', 'important')
})

onUnmounted(() => {
  document.body.style.removeProperty('overflow')
  document.documentElement.style.removeProperty('overflow')
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 99999; 
}

.modal-content {
  background: #111;
  border: 1px solid #e50914;
  padding: 40px;
  border-radius: 8px;
  width: 90%; max-width: 500px; /* Un poco más ancho para el diseño doble */
  text-align: center;
  position: relative;
  box-shadow: 0 25px 60px rgba(0,0,0,0.9);
}

.fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.close-btn { position: absolute; top: 15px; right: 15px; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; transition: 0.3s; }
.close-btn:hover { color: #e50914; transform: rotate(90deg); }

.brand-tag { color: #e50914; font-size: 0.8rem; font-weight: 700; letter-spacing: 3px; margin-bottom: 15px; display: block; }

.modal-text { 
  color: #ccc; 
  margin-bottom: 30px; 
  line-height: 1.4; 
  font-size: 1.2rem; 
  font-weight: 500;
}

/* Estilos Doble Contacto */
.double-contact-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
}

.shift-label {
  color: #e50914;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
}

.section-divider {
  height: 1px;
  width: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
}

/* Estilos Info e Iconos */
.contact-info { display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1.5rem; color: #fff; font-weight: bold; margin-bottom: 25px; }
.contact-info.mini { font-size: 1.2rem; margin-bottom: 5px; }

.whatsapp-icon { color: #25D366; font-size: 2rem; }
.mini .whatsapp-icon { font-size: 1.4rem; }

.action-btn { 
  display: inline-block; 
  background: #e50914; 
  color: #fff; 
  text-decoration: none; 
  padding: 12px 25px; 
  font-weight: 800; 
  border-radius: 4px; 
  letter-spacing: 1px; 
  transition: 0.3s; 
  width: 100%;
  max-width: 280px;
  font-size: 0.9rem;
}
.action-btn:hover { background: #b0060f; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(229, 9, 20, 0.3); }

@media (max-width: 500px) {
  .modal-content { padding: 30px 20px; }
  .modal-text { font-size: 1.1rem; }
}
</style>