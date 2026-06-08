<template>
  <div class="main-wrapper" ref="mainContainer">
    
    <div class="bg-pattern-fixed"></div>

    <div class="hero-container">
      <!-- El parallax del Hero (fondo) lo dejamos, ese está bien -->
      <div class="hero-parallax-layer" :style="{ transform: `translateY(${scrollY * 0.5}px)` }">
        <FondoInicio />
      </div>
      <div class="hero-gradient-overlay bottom"></div>
    </div>

    <section id="metodologias" class="section-container methods-section pattern-bg z-5">
      <div class="methods-top-gradient"></div>

      <div class="content-limit force-relative">
        <div class="header-group reveal-on-scroll">
          <span class="brand-tag">NUESTRO SISTEMA</span>
          <h2 class="brand-title">METODOLOGIAS</h2>
          <div class="title-decoration"></div>
        </div>
        
        <div class="staggered-grid">
          <div class="column-left">
             <Metodologia
              v-for="(item, index) in metodologiasPares"
              :key="item.id || index"
              :metodo="item"
              :index="(index * 2) + 1" 
              class="reveal-on-scroll card-spacer"
            />
          </div>
          
          <!-- CORRECCIÓN AQUÍ: Eliminé el :style con el transform -->
          <div class="column-right">
             <Metodologia
              v-for="(item, index) in metodologiasImpares"
              :key="item.id || index"
              :metodo="item"
              :index="(index * 2) + 2" 
              class="reveal-on-scroll card-spacer"
            />
          </div>
        </div>
      </div>
      <div class="contacto-wrapper reveal-on-scroll">
      <button class="btn-consultar" @click="mostrarModal = true">
        CONSULTAR DISPONIBILIDAD
      </button>
      </div>

      <Teleport to="body">
        <ModalDisponibilidad 
          v-if="mostrarModal" 
          sala="sala1" 
          @cerrar="mostrarModal = false" 
        />
      </Teleport>
    </section>
    <section id="salon2" class="section-container pattern-bg z-5">
      <Salon2 />
    </section>
    <div class="prices-layer-wrapper z-10 pattern-bg">
      
      <div class="double-marquee-container">
        <div class="marquee-row">
          <div class="track-left">
            <div class="content">START NOW • NO EXCUSES • PURE GRIND • START NOW • NO EXCUSES • PURE GRIND •</div>
            <div class="content" aria-hidden="true">START NOW • NO EXCUSES • PURE GRIND • START NOW • NO EXCUSES • PURE GRIND •</div>
          </div>
        </div>
        <div class="marquee-row">
          <div class="track-right">
            <div class="content outline-text">YOUR BODY • YOUR RULES • LEVEL UP • YOUR BODY • YOUR RULES • LEVEL UP •</div>
            <div class="content outline-text" aria-hidden="true">YOUR BODY • YOUR RULES • LEVEL UP • YOUR BODY • YOUR RULES • LEVEL UP •</div>
          </div>
        </div>
      </div>

      <section id="historia" class="content-limit wide-limit section-spacing">
        <div class="header-group reveal-on-scroll">
          <span class="brand-tag">NUESTRA</span>
          <h2 class="brand-title">HISTORIA</h2>
          <div class="title-decoration"></div>
          <p class="brand-subtitle">SIEMPRE CON VOS</p>
        </div>

        <div class="history-layout">
          <div class="history-top reveal-on-scroll">
            <p class="history-p">Todo comenzó en 1988, impulsado por una firme vocación: transmitir nuestra pasión por el entrenamiento y la vida sana. Lo que inició con clases de aeróbica en pequeños espacios, creció rápidamente gracias a la confianza de la gente. En 1992, con el título de profesores bajo el brazo, ese deseo individual se transformó en un proyecto de vida compartido.</p>
          </div>

          <div class="history-middle reveal-on-scroll">
            <div class="middle-text">
              <p class="history-p">Fue una etapa de inmenso esfuerzo y dedicación. Sin grandes capitales, pero con una visión clara, construimos nuestro primer equipamiento con nuestras propias manos.</p>
              <p class="history-p">Fueron años de trabajo artesanal, soldando hierros y sueños por igual. Nosotros mismos fabricamos cada una de nuestras máquinas, invirtiendo cada recurso de nuestro trabajo de docentes para dar forma, pieza por pieza, a lo que sería el corazón de nuestro gimnasio.</p>
              <p class="history-p">El camino tuvo varios desafíos. Durante la década del 90 atravesamos la difícil etapa de los alquileres, mudándonos y adaptándonos a distintas realidades económicas.</p>
            </div>
            
            <div class="middle-video">
              <div class="video-frame">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/yAjhXNZxuaU?si=GymAbitoPromo" 
                  title="Video Institucional Gimnasio Abito" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerpolicy="strict-origin-when-cross-origin" 
                  allowfullscreen>
                </iframe>
              </div>
              <div class="video-decoration"></div>
            </div>
          </div>

          <div class="history-bottom reveal-on-scroll">
            <p class="history-p">Hubo momentos de repliegue estratégico para poder ahorrar, pero nunca perdimos el norte: queríamos dejar de ser inquilinos para construir un hogar deportivo propio. Ese esfuerzo incansable dio sus frutos en 1998, nuestro gran hito: inauguramos finalmente el gimnasio en su casa definitiva.</p>
            <p class="history-p">Hoy, al ver nuestras instalaciones llenas de energía, seguimos manteniendo intacta la esencia familiar que nos vio nacer. Llevamos ya 37 años haciendo lo mejor para tu salud y dedicando nuestra vida al bienestar de nuestra gente.</p>
          </div>
        </div>
      </section>

      <div class="marquee-wrapper">
        <div class="marquee-track">
          <div class="marquee-content">
              NO LIMITS /// TRAIN HARD /// RESULTS /// DISCIPLINE /// POWER /// PERFORMANCE ///
              NO LIMITS /// TRAIN HARD /// RESULTS /// DISCIPLINE /// POWER /// PERFORMANCE ///
          </div>
          <div class="marquee-content" aria-hidden="true">
              NO LIMITS /// TRAIN HARD /// RESULTS /// DISCIPLINE /// POWER /// PERFORMANCE ///
              NO LIMITS /// TRAIN HARD /// RESULTS /// DISCIPLINE /// POWER /// PERFORMANCE ///
          </div>
        </div>
      </div>

      <section id="precios" class="content-limit wide-limit prices-content">
        <div class="header-group reveal-on-scroll">
          <span class="brand-tag">MEMBRESÍAS</span>
          <h2 class="brand-title">PLANES</h2>
          <div class="title-decoration"></div>
          <p class="brand-subtitle">ELIGE TU NIVEL</p>
        </div>

        <div class="pricing-flex">
          <Precio
            v-for="(item, index) in precios"
            :key="index"
            :precio="item"
            class="pricing-item reveal-on-scroll"
            :style="{ transitionDelay: `${index * 100}ms` }"
          />
        </div>
      </section>

      <div class="rhythm-marquee">
        <div class="marquee-track">
          <div class="marquee-content">
            <span class="solid">FOCUS</span> <span class="separator">///</span>
            <span class="outline">STRENGTH</span> <span class="separator">///</span>
            <span class="solid">PASSION</span> <span class="separator">///</span>
            <span class="outline">ENERGY</span> <span class="separator">///</span>
            <span class="solid">LIMITLESS</span> <span class="separator">///</span>
            <span class="outline">POWER</span> <span class="separator">///</span>
          </div>
          <div class="marquee-content" aria-hidden="true">
            <span class="solid">FOCUS</span> <span class="separator">///</span>
            <span class="outline">STRENGTH</span> <span class="separator">///</span>
            <span class="solid">PASSION</span> <span class="separator">///</span>
            <span class="outline">ENERGY</span> <span class="separator">///</span>
            <span class="solid">LIMITLESS</span> <span class="separator">///</span>
            <span class="outline">POWER</span> <span class="separator">///</span>
          </div>
        </div>
      </div>
      
      <section id="ubicacion" class="content-limit wide-limit section-spacing">
        <div class="location-grid">
          
          <div class="location-text reveal-on-scroll">
            <div class="header-align-left">
              <span class="brand-tag-left">UBICACIÓN</span>
              <h2 class="brand-title-left">DONDE ESTAMOS?</h2>
              <div class="title-decoration-left"></div>
            </div>
            
            <p class="location-description">
              Estamos ubicados en <strong>Calle 9 de Julio 1355</strong>, un punto estratégico para tu entrenamiento. 
              Nos encontramos a tan solo <strong>5 cuadras de la Avenida Principal Gral. Jones</strong> y a media cuadra de la Avenida Urquiza 
            </p>
            
            <div class="location-details">
              <div class="detail-item">
                <i class="fas fa-clock"></i>
                <div>
                  <h4>Horarios</h4>
                  <span>Lunes a Viernes: 07:00 - 22:30</span>
                </div>
              </div>
              <div class="detail-item">
                <i class="fas fa-phone-alt"></i>
                <div>
                  <h4>Contacto</h4>
                  <span>+54 9 3731 407828</span>
                </div>
              </div>
            </div>
          </div>

          <div class="location-map reveal-on-scroll">
             <MapaUbicacion />
          </div>

        </div>
      </section>

      <Footer />
      
    </div>
  </div>
</template>

<script setup>
import Footer from '../components/Inicio/Footer.vue'
import FondoInicio from '@/components/Inicio/FondoInicio.vue'
import Metodologia from '../components/Inicio/Metodologias.vue'
import Precio from '../components/Inicio/Precio.vue'
import MapaUbicacion from '@/components/Inicio/MapaUbicacion.vue'
import Salon2 from '@/components/Inicio/Salon2/Salon2.vue'
import ModalDisponibilidad from '@/components/Inicio/ModalDisponibilidad.vue'

import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { obtenerTrabajos } from '@/api/services/trabajoService.js'
import { obtenerSuscripciones } from '@/api/services/suscripcionesService'
const mostrarModal = ref(false)
const metodologias = ref([])
const precios = ref([])
const scrollY = ref(0) 

const metodologiasPares = computed(() => metodologias.value.filter((_, i) => i % 2 === 0));
const metodologiasImpares = computed(() => metodologias.value.filter((_, i) => i % 2 !== 0));

let observer = null
let mobileObserver = null

const handleScroll = () => {
  requestAnimationFrame(() => {
    scrollY.value = window.scrollY;
  });
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  
  // 1. Iniciamos el observer para el contenido estático (Historia, Títulos)
  setTimeout(initObserver, 300);

  try { 
    metodologias.value = await obtenerTrabajos();
  } catch (e) { console.error(e) }

  try { 
    precios.value = await obtenerSuscripciones();
    
    // 2. CRUCIAL: Esperamos a que Vue renderice los nuevos elementos de la API
    await nextTick();
    
    // 3. Volvemos a llamar al observer para que detecte los nuevos elementos cargados
    initObserver();
    initMobileObserver();
    
  } catch (e) { console.error(e) }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (observer) observer.disconnect();
  if (mobileObserver) mobileObserver.disconnect();
})

const initObserver = () => {
  // Verificamos si ya existe para no crearlo dos veces
  if (!observer) {
    const options = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, options)
  }

  // Buscamos SOLO los elementos que aún no son visibles para observarlos
  document.querySelectorAll('.reveal-on-scroll:not(.is-visible)').forEach(el => observer.observe(el))
}

const initMobileObserver = () => {
  if (window.innerWidth > 900) return;
  
  // Aquí sí reiniciamos el mobileObserver porque su lógica es diferente (active/inactive)
  if (mobileObserver) mobileObserver.disconnect();

  const options = { 
    threshold: 0.6, 
    rootMargin: "-20% 0px -20% 0px" 
  }
  
  mobileObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-mobile')
      } else {
        entry.target.classList.remove('active-mobile')
      }
    })
  }, options)
  
  // 1. Historia
  document.querySelectorAll('.history-p').forEach(el => mobileObserver.observe(el))

  // 2. Metodologías
  document.querySelectorAll('.card-spacer').forEach(el => mobileObserver.observe(el))

  // 3. Precios
  document.querySelectorAll('.pricing-item').forEach(el => mobileObserver.observe(el))
}
</script>

<style scoped>
.contacto-wrapper {
  margin-top: 30px; /* Espacio generoso después de las tarjetas */
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* El botón con el estilo de Abito */
.btn-consultar {
  background-color: #e50914; /* Rojo Abito */
  color: white;
  border: none;
  padding: 18px 40px;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  text-transform: uppercase;
}

.btn-consultar:hover {
  background-color: #b0060f;
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(229, 9, 20, 0.4);
}

/* Clase para la animación si usas ScrollReveal o similar */
.reveal-on-scroll {
  opacity: 1; /* Asegúrate de que sea visible si no usas librería de scroll */
}
/* =========================================
   BASE & LAYOUT
   ========================================= */
.main-wrapper { 
  background-color: #050505; 
  color: #fff; 
  font-family: 'Poppins', sans-serif; 
  overflow: visible; 
  position: relative; 
}
.content-limit { max-width: 1200px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 2; }
.wide-limit { max-width: 1400px; }
.z-5 { z-index: 5; }
.z-10 { z-index: 10; }
.force-relative { position: relative; z-index: 2; }
.section-spacing { padding: 120px 0; }

/* =========================================
   HERO
   ========================================= */
.hero-container { position: relative; width: 100%; height: 100vh; overflow: hidden; z-index: 1; background-color: #050505; }
.hero-parallax-layer { width: 100%; height: 120%; position: absolute; top: 0; left: 0; will-change: transform; }
.hero-gradient-overlay.bottom { position: absolute; bottom: 0; left: 0; width: 100%; height: 150px; background: linear-gradient(to bottom, transparent 0%, #050505 100%); pointer-events: none; z-index: 3; }

/* =========================================
   PATRONES & ESTILOS GENERALES
   ========================================= */
.pattern-bg { background-color: #050505; background-image: radial-gradient(#2a2a2a 1px, transparent 1px); background-size: 30px 30px; }
.header-group { text-align: center; margin-bottom: 80px; display: flex; flex-direction: column; align-items: center; }
.brand-tag { color: #e50914; font-size: 0.8rem; font-weight: 700; letter-spacing: 3px; margin-bottom: 10px; text-transform: uppercase; }
.brand-title { font-size: 4rem; font-weight: 800; letter-spacing: -2px; color: #fff; margin: 0; text-transform: uppercase; line-height: 1; }
.title-decoration { width: 80px; height: 4px; background-color: #e50914; margin-top: 20px; }
.brand-subtitle { font-size: 1rem; color: #aaa; letter-spacing: 4px; text-transform: uppercase; margin-top: 15px; font-weight: 600; }

/* =========================================
   METODOLOGÍAS
   ========================================= */
.methods-section { position: relative; padding-top: 150px; padding-bottom: 150px; z-index: 5; }
.methods-top-gradient { position: absolute; top: 0; left: 0; width: 100%; height: 200px; background: linear-gradient(to bottom, #050505 0%, transparent 100%);   pointer-events: none; z-index: 1; }
.staggered-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
.card-spacer { margin-bottom: 40px; transition: all 0.3s ease; }
.column-right { margin-top: 100px; will-change: transform; }

/* =========================================
   HISTORIA (LÓGICA PC vs MÓVIL)
   ========================================= */
.history-layout { display: flex; flex-direction: column; gap: 25px; }

/* Estilo base Párrafos */
.history-layout p { 
  font-size: 1.1rem; 
  line-height: 1.8; 
  color: #ccc; 
  margin-bottom: 15px; 
  padding: 15px 20px; 
  border-left: 3px solid transparent; 
  transition: all 0.5s ease; 
  background: transparent; 
}

/* SOLO PC: Efecto Hover (El scroll no afecta aquí) */
@media (min-width: 901px) {
  .history-layout p:hover { 
    border-left-color: #e50914; 
    color: #fff; 
    background: linear-gradient(90deg, rgba(229, 9, 20, 0.05) 0%, transparent 100%); 
  }
}

.history-middle { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; }
.video-frame { width: 100%; aspect-ratio: 16 / 9; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.6); border-radius: 4px; overflow: hidden; position: relative; z-index: 2; background: #000; }
.video-decoration { position: absolute; top: -10px; right: -10px; width: 60px; height: 60px; border-top: 3px solid #e50914; border-right: 3px solid #e50914; z-index: 1; opacity: 0.6; }
.middle-video { position: relative; }

/* =========================================
   UBICACIÓN
   ========================================= */
.location-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; width: 100%; }
.location-text { text-align: left; }
.header-align-left { align-items: flex-start; text-align: left; display: flex; flex-direction: column; margin-bottom: 20px; }
.brand-tag-left { color: #e50914; font-size: 0.8rem; font-weight: 700; letter-spacing: 3px; margin-bottom: 10px; text-transform: uppercase; }
.brand-title-left { font-size: 3.5rem; font-weight: 800; letter-spacing: -2px; color: #fff; margin: 0; text-transform: uppercase; line-height: 1; }
.title-decoration-left { width: 80px; height: 4px; background-color: #e50914; margin-top: 20px; }
.location-description { font-size: 1.1rem; color: #ccc; line-height: 1.8; margin-bottom: 40px; max-width: 95%; }
.location-description strong { color: #fff; font-weight: 600; }

.location-details { display: flex; flex-direction: column; gap: 25px; margin-bottom: 40px; }
.detail-item { display: flex; align-items: flex-start; gap: 15px; }
.detail-item i { color: #e50914; font-size: 1.5rem; margin-top: 5px; min-width: 25px; }
.detail-item h4 { margin: 0 0 5px; font-size: 1rem; text-transform: uppercase; color: #fff; letter-spacing: 1px; }
.detail-item span { display: block; font-size: 0.95rem; color: #999; }

.location-map { width: 100%; height: 100%; min-height: 400px; display: flex; justify-content: center; align-items: center; position: relative; z-index: 5; }

/* =========================================
   MARQUEES & PRECIOS
   ========================================= */
.prices-layer-wrapper { position: relative; display: flex; flex-direction: column; min-height: 100vh; }
.double-marquee-container { padding: 60px 0; overflow: hidden; display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 2; }
.marquee-row { display: flex; width: 100%; overflow: hidden; white-space: nowrap; }
.track-left { display: flex; animation: scrollLeft 35s linear infinite; }
.track-right { display: flex; animation: scrollRight 35s linear infinite; }
.content { font-size: 4rem; font-weight: 900; text-transform: uppercase; color: #fff; padding-right: 40px; line-height: 1; }
.outline-text { color: transparent; -webkit-text-stroke: 2px #333; transition: -webkit-text-stroke 0.3s ease; }
.double-marquee-container:hover .outline-text { -webkit-text-stroke: 2px #e50914; }
.rhythm-marquee { border-top: 1px solid rgba(255, 255, 255, 0.1); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 25px 0; overflow: hidden; position: relative; z-index: 2; margin: 80px 0; }
.solid { font-size: 2.5rem; font-weight: 900; color: #fff; line-height: 1; }
.outline { font-size: 2.5rem; font-weight: 900; color: transparent; -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5); line-height: 1; }
.separator { color: #e50914; font-size: 1.5rem; font-weight: 300; opacity: 0.8; margin: 0 20px; }
.marquee-wrapper { background: #e50914; padding: 20px 0; transform: skewY(-2deg); width: 100%; overflow: hidden; border-top: 2px solid #fff; border-bottom: 2px solid #fff; margin-bottom: 80px; position: relative; z-index: 11; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.marquee-track { display: flex; width: fit-content; animation: scroll 30s linear infinite; }
.marquee-content { white-space: nowrap; font-size: 1.4rem; font-weight: 900; color: #000; letter-spacing: 2px; padding-right: 50px; }

@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes scrollRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

.prices-content { padding-top: 50px; padding-bottom: 150px; }
.pricing-flex { display: flex; flex-wrap: wrap; justify-content: center; gap: 30px; }
.pricing-item { flex: 1 1 280px; max-width: 340px; min-width: 260px; }

.reveal-on-scroll { opacity: 0; transform: translateY(50px); transition: all 0.8s cubic-bezier(0.215, 0.610, 0.355, 1); }
.reveal-on-scroll.is-visible { opacity: 1; transform: translateY(0); }

/* =========================================
   RESPONSIVE (MÓVIL)
   ========================================= */
@media (max-width: 900px) {
  .hero-container { height: 100dvh; min-height: 600px; }
  .brand-title { font-size: 2.5rem; }
  .brand-title-left { font-size: 2.2rem; }
  
  /* METODOLOGÍAS */
  .staggered-grid { display: flex; flex-direction: column; align-items: center; gap: 30px; }
  .column-left, .column-right { width: 100%; display: flex; flex-direction: column; align-items: center; }
  .column-right { margin-top: 0; transform: none !important; }
  .card-spacer { width: 100% !important; max-width: 340px !important; }

  /* HISTORIA: Resaltado por Scroll */
  .history-layout p.active-mobile { 
    border-left-color: #e50914; 
    color: #fff; 
    background: linear-gradient(90deg, rgba(229, 9, 20, 0.05) 0%, transparent 100%); 
  }

  /* --- REORDENAMIENTO DE HISTORIA (VIDEO AL FINAL) --- */
  /* Hacemos que el contenedor del medio "desaparezca" para que sus hijos sean hermanos directos de flex */
  .history-middle { 
    display: contents; 
  }
  
  /* Ahora reordenamos todo con 'order' */
  .history-top { order: 1; }
  .middle-text { order: 2; }
  .history-bottom { order: 3; }
  
  /* Video al final de todo */
  .middle-video { 
    order: 4; 
    margin-top: 40px; 
    width: 100%;
  }
  /* ------------------------------------------------ */
  
  .location-grid { display: flex; flex-direction: column; gap: 40px; }
  .location-text { order: 1; width: 100%; padding: 0 15px; text-align: center; display: flex; flex-direction: column; align-items: center; } 
  .header-align-left { align-items: center; text-align: center; width: 100%; }
  
  .location-details { width: 100%; align-items: center; }
  .detail-item { width: 100%; max-width: 280px; justify-content: flex-start; text-align: left; }
  
  .location-map { order: 2; width: 100%; height: 350px !important; min-height: 350px; padding: 0 20px; box-sizing: border-box; }
  
  .content { font-size: 2.5rem; }
  .solid, .outline { font-size: 2rem; }
  .double-marquee-container { padding: 40px 0; }
}
</style>