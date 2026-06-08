<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-left">
        <img src="@/assets/logo.png" alt="Logo" class="footer-logo" />
      </div>

      <div class="footer-center">
        <p>© Copyright {{anio}} | Todos los derechos reservados</p>
      </div>

      <div class="footer-right">
        <a href="https://www.instagram.com/gymabito/" target="_blank"><i class="fab fa-instagram"></i></a>
      </div>
    </div>
  </footer>
</template>


<script setup>
import { obtenerAnioActual } from '@/utils/formatters';

// 2. Ejecutamos la función para obtener el año y lo guardamos en una variable
const anio = obtenerAnioActual();
</script>

<style scoped>
.footer {
  background-color: #000;
  color: white;
  padding: 22px 0;
  font-family: 'Poppins', sans-serif;
  border-top: 1px solid #222;
}

.footer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}
@media (max-width: 767px) {
  .footer-container {
    flex-direction: column;   /* ✅ apila verticalmente */
    text-align: center;
    gap: 15px; /* espacio entre los bloques */
  }

  .footer-left,
  .footer-center,
  .footer-right {
    justify-content: center; /* centramos cada bloque */
    min-width: auto; /* quitamos ancho mínimo */
  }
}
.footer-left,
.footer-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px; /* o el mismo valor en ambos lados */
}

.footer-center {
  flex: 2;
  text-align: center;
}

.footer-logo {
  height: 100%; /* ocupa toda la altura disponible */
  max-height: 60px; /* o lo que prefieras */
  object-fit: contain;
}

.footer-right a {
  color: white;
  font-size: 1.4rem;
  transition: color 0.3s;
}

.footer-right a:hover {
  color: #e50914;
}

</style>
