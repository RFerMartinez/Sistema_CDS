<template>
  <div class="auth-background">
    <div class="background-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthBackground'
}
</script>

<style scoped>
.auth-background {
  position: relative;
  min-height: 100vh;
  background: 
    linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.background-content {
  width: 100%;
  max-width: 500px;
}

/* Responsive */
@media (max-width: 768px) {
  .auth-background {
    padding: 1rem 0.5rem;
  }
}
</style>