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
  <header class="flex align-items-center justify-content-between px-4 py-3 md:px-6">
    <div class="flex align-items-center gap-2">
      <i class="pi pi-compass text-2xl md:text-3xl"></i>
      <h1 class="m-0 text-xl md:text-2xl font-black uppercase tracking-tight">Virtu360</h1>
    </div>

    <nav class="flex gap-2">
      <Button
          label="Ver Galería"
          icon="pi pi-images"
          rounded
          outlined
          severity="secondary"
          @click="toggleGallery"
          class="border-white text-white hover:bg-white-alpha-20"
      />
    </nav>
  </header>
</template>

<style scoped>
header {
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
</style>