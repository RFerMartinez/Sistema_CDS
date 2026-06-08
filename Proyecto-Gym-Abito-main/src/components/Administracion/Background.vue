<template>
  <div class="background">
    <slot />
  </div>
</template>

<style scoped>
.background {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.3)),
              url('../../assets/fondo2.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Media queries simplificados */
@media (max-width: 768px) {
  .background {
    overflow-y: auto;
  }
}
</style>