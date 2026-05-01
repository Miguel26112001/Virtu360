<script>
import { eventBus } from '@/shared/services/eventBus';
import { createViewer, toggleGallery } from '@/public/services/viewer.service'

export default {
  name: 'PanoramaViewer',

  props: {
    startNodeId: {
      type: String,
      default: 'lobby'
    }
  },

  data() {
    return {
      viewerInstance: null,
      isLoading: true,
      hasError: false
    }
  },

  async mounted() {
    try {
      this.initViewer();
    } catch (error) {
      console.error("Error al inicializar el tour virtual:", error);
      this.hasError = true;
      this.isLoading = false;
    }
  },

  beforeUnmount() {
    if (this.viewerInstance) {
      this.viewerInstance.destroy();
      console.log("Visor destruido correctamente");
    }
  },

  watch: {
    'eventBus.galleryToggleTicket'() {
      toggleGallery(this.viewerInstance);
    }
  },

  computed: {
    eventBus() {
      return eventBus;
    }
  },

  methods: {
    initViewer() {
      this.viewerInstance = createViewer(this.$refs.viewerContainer, this.startNodeId);

      this.viewerInstance.addEventListener('ready', () => {
        this.isLoading = false;
      }, { once: true });
    },
  }
}
</script>

<template>
  <div class="viewer-wrapper">
    <!-- Overlay de carga -->
    <div v-if="isLoading" class="overlay loader">
      <div class="spinner"></div>
      <p>Cargando entorno 360...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-if="hasError" class="overlay error">
      <p>No se pudo cargar el recorrido. Revisa la conexión al servidor.</p>
    </div>

    <!-- Contenedor del Visor -->
    <div
        ref="viewerContainer"
        class="viewer"
        :class="{ 'is-hidden': isLoading || hasError }"
    ></div>
  </div>
</template>

<style scoped>
.viewer-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.viewer {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  transition: opacity 0.5s ease;
  overflow: hidden;
}

.viewer :deep(canvas) {
  max-width: 100% !important;
}

.is-hidden {
  opacity: 0;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-family: system-ui, -apple-system, sans-serif;
}

.loader {
  background: #f8f9fa;
  color: #333;
}

.error {
  background: #fff5f5;
  color: #c0392b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>