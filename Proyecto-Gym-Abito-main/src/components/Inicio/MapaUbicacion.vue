<template>
  <div class="map-wrapper">
    <div id="google-map" class="map-canvas"></div>
    <div class="map-overlay-shadow"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// TU CLAVE REAL (La que comprobamos que funciona en el HTML)
const apiKey = process.env.VUE_APP_GOOGLEAPIKEY;

const initMap = () => {
  // Verificamos si Google Maps ya está cargado para no romper nada
  if (window.google && window.google.maps) {
    crearMapa();
    return;
  }

  // Si no está cargado, creamos la etiqueta <script> manualmente
  // (Exactamente igual que en el archivo HTML que funcionó)
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps,marker&v=weekly`;
  script.async = true;
  script.defer = true;
  
  // Cuando el script termine de bajar, arrancamos el mapa
  script.onload = () => {
    crearMapa();
  };

  // Agregamos el script al encabezado de tu página
  document.head.appendChild(script);
};

const crearMapa = async () => {
  try {
    // Usamos la variable global 'google' que el script acaba de cargar
    const { Map } = await google.maps.importLibrary("maps");
    const { Marker } = await google.maps.importLibrary("marker");

    const position = { lat: -27.094061, lng: -61.084762 };

    const darkStyle = [
      { elementType: "geometry", stylers: [{ color: "#212121" }] },
      { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
      { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
      { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
      { featureType: "poi", stylers: [{ visibility: "off" }] },
      { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
      { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] }
    ];

    const map = new Map(document.getElementById("google-map"), {
      center: position,
      zoom: 16,
      styles: darkStyle,
      disableDefaultUI: true,
      zoomControl: true,
      backgroundColor: "#050505",
      mapId: "DEMO_MAP_ID" // Necesario para marcadores avanzados
    });

    new Marker({
      position: position,
      map: map,
      title: "Gimnasio Abito",
    });

  } catch (error) {
    console.error("Error al iniciar el mapa:", error);
  }
};

onMounted(() => {
  initMap();
});
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
  min-height: 500px; /* Altura por defecto para PC */
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #333;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  background-color: #111;
  transition: min-height 0.3s ease;
}

.map-canvas { 
  width: 100%; 
  height: 100%; 
  min-height: 500px; 
}

.map-overlay-shadow {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  box-shadow: inset 0 0 30px rgba(0,0,0,0.8);
  pointer-events: none;
  z-index: 2;
}

/* =========================================
   RESPONSIVE MAPA
   ========================================= */
@media (max-width: 900px) {
  .map-wrapper {
    min-height: 350px; /* Reducimos la altura en móvil */
    border-radius: 0; /* Opcional: bordes rectos en móvil si ocupa todo el ancho */
    border-left: none;
    border-right: none;
  }
  
  .map-canvas {
    min-height: 350px;
  }
}
</style>