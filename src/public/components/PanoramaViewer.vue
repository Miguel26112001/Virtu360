<script>
import { eventBus } from '@/shared/services/eventBus';
import { createViewer, toggleGallery, initMarkerEvents } from '@/public/services/viewer.service'

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
      hasError: false,
      selectedMarker: null
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
    }
  },

  watch: {
    'eventBus.galleryToggleTicket'() {
      if (this.viewerInstance) {
        toggleGallery(this.viewerInstance);
      }
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

      initMarkerEvents(this.viewerInstance, (markerData) => {
        this.openDetailModal(markerData);
      });
    },

    openDetailModal(data) {
      this.selectedMarker = data;
    },

    closeModal() {
      this.selectedMarker = null;
    }
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

    <!-- Modal de Detalle (Se activa cuando selectedMarker tiene datos) -->
    <Transition name="fade">
      <div v-if="selectedMarker" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="close-btn" @click="closeModal">&times;</button>

          <h2>{{ selectedMarker.title }}</h2>
          <div class="modal-body">
            <p>{{ selectedMarker.description }}</p>
          </div>

          <div class="modal-footer">
            <button class="primary-btn" @click="closeModal">Entendido</button>
          </div>
        </div>
      </div>
    </Transition>

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
}

.is-hidden {
  opacity: 0;
}

/* Estilos para el Modal */
.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  margin: 1.5rem 0;
  color: #4a5568;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.primary-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

/* Transiciones */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Spinner y otros estilos existentes... */
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>