<script>
import { eventBus } from '@/shared/services/eventBus';

export default {
  name: "HeaderSection",
  methods: {
    toggleGallery() {
      eventBus.galleryToggleTicket++;
    }
  }
}
</script>

<template>
  <header class="header">
    <h1>Tour Virtual 360°</h1>
    <nav>
      <button @click="toggleGallery" class="btn-gallery">
        🖼️ Ver Galería
      </button>
    </nav>
    <p>Explora espacios interactivos desde tu navegador</p>
  </header>
</template>

<style scoped>
.header {
  background: #111;
  color: white;
  text-align: center;
  padding: 30px;
}

.header h1 {
  margin: 0;
  font-size: 36px;
}

.btn-gallery {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid white;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}
</style>