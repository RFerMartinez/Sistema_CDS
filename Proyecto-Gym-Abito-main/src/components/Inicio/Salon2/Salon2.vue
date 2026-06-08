<template>
  <section id="clases-grupales" class="content-limit wide-limit section-spacing z-5 force-relative">
    
    <div class="header-group reveal-on-scroll">
      <span class="brand-tag">SALON 2</span>
      <h2 class="brand-title">CLASES GRUPALES</h2>
      <div class="title-decoration"></div>
      <p class="brand-subtitle">
        DINÁMICA, RESISTENCIA Y <br>
        TRABAJO EN EQUIPO
    </p>
    </div>

    <div class="clases-container">
      <TarjetaClase
        v-for="(clase, index) in clases"
        :key="index"
        :titulo="clase.titulo"
        :intensidad="clase.intensidad"
        :dias="clase.dias"
        :horarios="clase.horarios"
        :descripcion="clase.descripcion"
        :imagen="clase.imagen"
        :badge="clase.badge"
        :style="{ transitionDelay: `${index * 150}ms` }"
        class="animate-target"
      />
    </div>

    <div class="contacto-wrapper reveal-on-scroll" style="margin-top: 60px; text-align: center;">
      <button class="btn-consultar" @click="mostrarModal = true">
        CONSULTAR DISPONIBILIDAD
      </button>
    </div>

    <Teleport to="body">
      <ModalDisponibilidad 
        v-if="mostrarModal" 
        sala="sala2"
        @cerrar="mostrarModal = false" 
      />
    </Teleport>

  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TarjetaClase from './TarjetaClase.vue'
import ModalDisponibilidad from '../ModalDisponibilidad.vue'

const mostrarModal = ref(false)

const clases = ref([
  {
    titulo: 'CARDIO FIT',
    badge: 'ENFOQUE // CARDIO',
    intensidad: 'Moderada',
    dias: 'Lunes y Miércoles',
    horarios: process.env.VUE_APP_SALA2_HORARIO_CARDIO,
    imagen: '/data/ImagenesSalon2/CardioFit.jpg', 
    descripcion: 'Combinación de ejercicios aeróbicos con ejercicios de fortalecimiento muscular, usando peso del propio cuerpo y/o pesas livianas. El objetivo es <strong>maximizar la oxidación de grasa</strong> y el gasto calórico. Son clases similares a las de Funcional, pero enfocadas en mejorar la resistencia cardiovascular.'
  },
  {
    titulo: 'FUNCIONAL',
    badge: 'ENFOQUE // FUERZA',
    intensidad: 'Alta',
    dias: 'Martes y Jueves',
    horarios: process.env.VUE_APP_SALA2_HORARIO_FUNCIONAL,
    imagen: '/data/ImagenesSalon2/Funcional.jpg',
    descripcion: 'Series dinámicas, con ejercicios que resultan funcionales para la vida cotidiana o el deporte, y que mejoran todas las cualidades físicas (fuerza, resistencia, flexibilidad, movilidad, coordinación, equilibrio, agilidad). Se trabaja el <strong>cuerpo completo</strong>, adaptado a los diferentes niveles de condición física.'
  }
])

let observer = null

onMounted(() => {
  const options = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      } else {
        entry.target.classList.remove('is-visible')
      }
    })
  }, options)

  document.querySelectorAll('.animate-target, .reveal-on-scroll').forEach(el => observer.observe(el))
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
/* 1. Modificaciones específicas de la sección */
#clases-grupales {
  padding-top: 40px !important;
}

.clases-container { 
  display: flex; 
  flex-direction: column; 
  gap: 50px; 
  width: 100%;
}

/* 2. Botones */
.btn-consultar {
  background: transparent;
  color: #fff;
  border: 2px solid #e50914;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-consultar:hover { 
  background: #e50914; 
  box-shadow: 0 0 20px rgba(229, 9, 20, 0.4); 
  transform: translateY(-3px); 
}

/* 3. Clases base y Títulos (PC) */
.force-relative { position: relative; z-index: 2; }
.reveal-on-scroll { opacity: 0; transform: translateY(50px); transition: all 0.8s cubic-bezier(0.215, 0.610, 0.355, 1); }
.reveal-on-scroll.is-visible { opacity: 1; transform: translateY(0); }

.header-group { text-align: center; margin-bottom: 80px; display: flex; flex-direction: column; align-items: center; }
.brand-tag { color: #e50914; font-size: 0.8rem; font-weight: 700; letter-spacing: 3px; margin-bottom: 10px; text-transform: uppercase; }

/* Aquí está el 4rem que estaba pisando al móvil */
.brand-title { font-size: 4rem; font-weight: 800; letter-spacing: -2px; color: #fff; margin: 0; text-transform: uppercase; line-height: 1; }

.title-decoration { width: 80px; height: 4px; background-color: #e50914; margin-top: 20px; }
.brand-subtitle { font-size: 1rem; color: #aaa; letter-spacing: 4px; text-transform: uppercase; margin-top: 15px; font-weight: 600; }


/* 4. RESPONSIVE MÓVIL (SIEMPRE AL FINAL) */
@media (max-width: 900px) {
  #clases-grupales {
    padding-top: 20px !important; 
  }
  
  /* Ahora sí va a tomar este 2.5rem para que sea idéntico a Metodologías */
  .brand-title { 
    font-size: 2.5rem; 
  }
  
  .clases-container { 
    gap: 40px; 
  } 
  .section-spacing { 
    padding: 60px 0 !important; 
  }
}
</style>