<template>
  <div class="titulo-contenedor">
    <h1 class="titulo-principal">{{ texto }}</h1>
    <div class="titulo-decoracion"></div>
  </div>
</template>

<script setup>
defineProps({
  texto: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.titulo-contenedor {
  width: 100%;
  margin-bottom: 2rem;
  text-align: center; 
}

.titulo-principal {
  /* MODIFICADO: Tipo de letra */
  font-family: 'Oswald', 'Poppins', sans-serif; /* Oswald primero, Poppins como alternativa */
  font-size: 2.1rem; /* Ajustado ligeramente para la nueva fuente */
  font-weight: 700; /* Oswald se ve muy bien en 700 */
  color: #111; /* Mantenemos el negro/gris oscuro */
  margin: 0;
  padding: 0;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 2px; /* Mantenemos el espaciado */
}

.titulo-decoracion {
  width: 100px;  
  height: 2px;   
  background-color: #e50914; /* Rojo del logo */
  margin-top: 0.75rem;
  border-radius: 1px;
  margin-left: auto;
  margin-right: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .titulo-principal {
    font-size: 1.7rem; /* Ajustado */
    letter-spacing: 1.5px;
  }
  .titulo-contenedor {
     margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .titulo-principal {
    font-size: 1.5rem;
    letter-spacing: 1px;
  }
  .titulo-decoracion {
     width: 80px;
     margin-top: 0.5rem;
  }
}
</style>