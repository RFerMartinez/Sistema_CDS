<template>
  <section id="inicio" class="hero-section">
    <NavBar />
    
    <div ref="carouselElement" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators d-none">
        <button 
          v-for="(image, index) in carouselImages" 
          :key="'original-' + index"
          type="button" 
          data-bs-target="#heroCarousel" 
          :data-bs-slide-to="index"
          :class="{ active: index === 0 }"
          :aria-label="`Slide ${index + 1}`"
        ></button>
      </div>

      <div class="carousel-inner">
        <div 
          v-for="(image, index) in carouselImages" 
          :key="index"
          class="carousel-item"
          :class="{ active: index === 0 }"
          :data-slide-index="index"
        >
          <img :src="image" class="d-block w-100 carousel-image" :alt="`Imagen ${index + 1}`">
          <div class="carousel-overlay"></div>
          
          <div v-if="isFondoImage(image)" class="carousel-caption" :class="{ 'animate-in': showText, 'animate-out': !showText }">
            <h1 class="hero-title">
              <span class="title-fragment">GIMNASIO ABITO</span>
              <span class="title-fragment"> Y BUENA VIDA...</span>
            </h1>
            <p class="hero-subtitle">Transforma tu cuerpo, transforma tu vida</p>
          </div>
        </div>
      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>

      <div class="carousel-indicators-custom">
        <button 
          v-for="(image, index) in carouselImages" 
          :key="'custom-' + index"
          type="button" 
          @click="goToSlide(index)"
          :class="{ active: currentSlide === index }"
          class="indicator-dot"
        >
        </button>
      </div>
    </div>

    <div class="bottom-gradient"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Carousel } from 'bootstrap'
import NavBar from '@/components/Inicio/NavBar.vue'

const carouselElement = ref(null)
const carouselImages = ref([])
const currentSlide = ref(0)
const showText = ref(true) // Controla si mostrar el texto
let carouselInstance = null

// Verificar si es la imagen fondo.jpg
const isFondoImage = (imageUrl) => {
  return imageUrl.includes('fondo.jpg') || 
         imageUrl.includes('fondo.JPG') ||
         imageUrl.toLowerCase().includes('fondo.jpg')
}

// Ir a slide específico
const goToSlide = (index) => {
  if (carouselInstance) {
    currentSlide.value = index // ACTUALIZAR INMEDIATAMENTE
    carouselInstance.to(index)
  }
}

// Controlar la animación del texto
const handleSlideChange = (toIndex) => {
  const isFondo = carouselImages.value[toIndex] && isFondoImage(carouselImages.value[toIndex])
  
  if (isFondo) {
    // Si vamos a la imagen fondo, mostrar texto con animación
    showText.value = true
  } else {
    // Si salimos de fondo, ocultar texto con animación
    showText.value = false
  }
}

// Cargar las imágenes desde el JSON
const loadImagesFromJSON = async () => {
  try {
    const response = await fetch('/data/ImagenesInicio.json')
    
    if (!response.ok) {
      throw new Error(`Error cargando JSON: ${response.status}`)
    }
    
    const data = await response.json()
    carouselImages.value = data.images || []
    
    if (carouselImages.value.length === 0) {
      console.warn('No se encontraron imágenes en el JSON')
    } else {
      console.log('Imágenes cargadas:', carouselImages.value.length)
    }
  } catch (error) {
    console.error('Error cargando imágenes:', error)
  }
}

// Inicializar carrusel Bootstrap
const initializeCarousel = () => {
  if (carouselElement.value && carouselImages.value.length > 0) {
    // Agregar ID al elemento para que Bootstrap lo reconozca
    carouselElement.value.id = 'heroCarousel'
    
    // Destruir instancia anterior si existe
    if (carouselInstance) {
      carouselInstance.dispose()
    }
    
    // Inicializar carrusel con TODAS las imágenes
    carouselInstance = new Carousel(carouselElement.value, {
      interval: 5000,
      ride: 'carousel',
      wrap: true
    })

    // Escuchar eventos de INICIO de transición (instantáneo)
    carouselElement.value.addEventListener('slide.bs.carousel', (event) => {
      currentSlide.value = event.to
      handleSlideChange(event.to)
    })

    // También escuchar el evento de fin por si acaso
    carouselElement.value.addEventListener('slid.bs.carousel', (event) => {
      currentSlide.value = event.to
    })
  }
}

// Observar cambios en currentSlide para controlar animaciones
watch(currentSlide, (newIndex) => {
  handleSlideChange(newIndex)
})

onMounted(async () => {
  await loadImagesFromJSON()
  
  // Esperar a que Vue renderice el DOM con TODAS las imágenes
  nextTick(() => {
    initializeCarousel()
  })
})

onUnmounted(() => {
  if (carouselInstance) {
    carouselInstance.dispose()
  }
})
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

/* Carrusel Bootstrap personalizado */
.carousel {
  height: 100%;
}

.carousel-inner {
  height: 100%;
}

.carousel-item {
  height: 100%;
}

.carousel-image {
  height: 100%;
  object-fit: cover;
  object-position: center;
  width: 100%;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

/* DEGRADADO MUY BAJO Y SUTIL - CASI IMPERCEPTIBLE */
.bottom-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px; /* Aumentamos la altura para un efecto más gradual */
  background: linear-gradient(to top, 
    rgba(0, 0, 0, 0.7) 0%, 
    rgba(0, 0, 0, 0.4) 40%,
    rgba(0, 0, 0, 0.15) 70%,
    transparent 100%);
  z-index: 3;
  pointer-events: none;
}

/* INDICADORES PERSONALIZADOS INSTANTÁNEOS */
.carousel-indicators-custom {
  position: absolute;
  bottom: 25px; /* Volvemos a la posición original */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 5;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.indicator-dot:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: scale(1.2);
}

.indicator-dot.active {
  background: #e50914;
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
}

/* Controles personalizados */
.carousel-control-prev,
.carousel-control-next {
  width: 50px;
  height: 50px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  margin: 0 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  z-index: 5;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.carousel-control-prev:hover,
.carousel-control-next:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-50%) scale(1.1);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  width: 20px;
  height: 20px;
}

/* Contenido del hero con ANIMACIONES PROFESIONALES */
.carousel-caption {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  width: 100%;
  padding: 0 20px;
  z-index: 4;
  opacity: 0;
  visibility: hidden;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Estilos base para fragmentos del título */
.title-fragment {
  display: inline; /* Por defecto en una línea (PC) */
}

/* Animación de entrada - Elegante y sutil */
.carousel-caption.animate-in {
  opacity: 1;
  visibility: visible;
  animation: textSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/* Animación de salida - Suave y profesional */
.carousel-caption.animate-out {
  opacity: 0;
  visibility: hidden;
  animation: textSlideOut 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}

/* Animación de entrada: los elementos entran desde abajo con fade */
@keyframes textSlideIn {
  0% {
    opacity: 0;
    transform: translate(-50%, calc(-50% + 30px));
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

/* Animación de salida: los elementos salen hacia arriba con fade */
@keyframes textSlideOut {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, calc(-50% - 30px));
  }
}

/* Animaciones escalonadas para título y subtítulo */
.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation-delay: 0.1s;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  animation-delay: 0.2s;
}

/* Aplicar animaciones escalonadas cuando está activo */
.carousel-caption.animate-in .hero-title {
  animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both;
}

.carousel-caption.animate-in .hero-subtitle {
  animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  /* CAMBIO: Configuracion para separar el título en dos líneas */
  .title-fragment {
    display: block; /* Fuerza el salto de línea */
    line-height: 1.2;
  }

  .hero-title {
    font-size: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .carousel-control-prev,
  .carousel-control-next {
    width: 45px;
    height: 45px;
    margin: 0 15px;
  }
  
  .bottom-gradient {
    height: 50px;
  }
  
  /* Ajustar animaciones para móvil */
  @keyframes textSlideIn {
    0% {
      opacity: 0;
      transform: translate(-50%, calc(-50% + 20px));
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
  
  @keyframes textSlideOut {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, calc(-50% - 20px));
    }
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .carousel-control-prev,
  .carousel-control-next {
    width: 40px;
    height: 40px;
    margin: 0 10px;
  }
  
  .indicator-dot {
    width: 6px;
    height: 6px;
  }
  
  .bottom-gradient {
    height: 40px;
  }
}
</style>