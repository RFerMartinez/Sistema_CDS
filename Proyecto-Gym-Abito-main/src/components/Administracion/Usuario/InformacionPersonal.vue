<template>
  <div class="contenedor">
    
    <div class="wrapper-detalle-persona">
      <DetallePersona :datos="alumno" />
    </div>

    

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import DetallePersona from '../Admin/DetallePersona.vue';

// Imports de servicios y storage
import { obtenerDataCurrentUser } from '@/api/services/alumnoService';
import { getMiPerfilPersona } from '@/api/services/personaService'; 
import { getUser } from '@/api/storage/userStorage';

// Estado reactivo
const alumno = ref({});
const cargando = ref(true);
const errorCarga = ref(null);

// Función para cargar los datos según el rol
const cargarDatos = async () => {
  cargando.value = true;
  errorCarga.value = null;
  
  try {
    // 1. Obtenemos el usuario del storage para ver sus roles
    const user = getUser();
    let response;

    // 2. Decidimos qué servicio llamar
    if (user && user.esAlumno) {
      response = await obtenerDataCurrentUser();
    } else {
      // Este servicio llama a /personas/mi-perfil
      response = await getMiPerfilPersona();
    }

    // 3. Asignamos la respuesta
    if (response) {
      alumno.value = response;
    } else {
      throw new Error("La respuesta del servidor está vacía.");
    }

  } catch (error) {
    console.error('Error al obtener los datos del perfil:', error);
    errorCarga.value = 'No se pudo cargar la información del perfil.';
  } finally {
    cargando.value = false;
  }
};

onMounted(cargarDatos);

</script>

<style scoped>
.contenedor {
padding: 2rem; 
background-color: rgba(255, 255, 255, 0.85); /* Fondo translúcido */
border-radius: 20px;
box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
overflow: hidden; 
width: 100%;
}

/* 5. Estilo para el wrapper de DetallePersona */
.wrapper-detalle-persona {
background: #ffffff; /* Fondo blanco sólido */
border-radius: 12px;
box-shadow: 0 4px 15px rgba(0,0,0,0.05);
overflow: hidden; /* Para que los bordes redondeados se apliquen */
}


/* Media query para dispositivos móviles */
@media (max-width: 768px) {
.contenedor {
width: 100%;
padding: 1.5rem;
margin: 0;
box-sizing: border-box;
}
}

@media (max-width: 480px) {
.contenedor {
padding: 1rem;
}
}
</style>