<script>
import { eventBus } from '@/shared/services/eventBus';
import { createViewer, toggleGallery, initMarkerEvents } from '@/public/services/viewer.service'

export default {
  name: 'PanoramaViewer',

  props: {
    projectId: {
      type: String,
      required: true
    },
    startNodeId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      viewerInstance: null,
      isLoading: true,
      hasError: false,
      selectedMarker: null,
      showModal: false
    }
  },

  async mounted() {
    try {
      this.initViewer();
    } catch (error) {
      console.error("Error al inicializar el tour virtual:", error);
      this.hasError = true;
      this.isLoading = false;
      this.$toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo conectar con el servidor 360.'
      });
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
      this.viewerInstance = createViewer(
          this.$refs.viewerContainer,
          this.projectId,
          this.startNodeId
      );

      this.viewerInstance.addEventListener('ready', () => {
        this.isLoading = false;
      }, { once: true });

      initMarkerEvents(this.viewerInstance, (markerData) => {
        this.openDetailModal(markerData);
      });
    },

    openDetailModal(data) {
      this.selectedMarker = data;
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      setTimeout(() => { this.selectedMarker = null; }, 300);
    }
  }
}
</script>

<template>
  <div class="viewer-wrapper">

    <div v-if="isLoading" class="overlay loader bg-black-alpha-90 text-white">
      <ProgressSpinner strokeWidth="4" />
      <p class="mt-3 font-bold">Cargando experiencia 360...</p>
    </div>

    <div v-if="hasError" class="overlay error bg-red-900 text-white p-4">
      <i class="pi pi-exclamation-triangle text-4xl mb-3"></i>
      <p>No se pudo cargar el recorrido virtual.</p>
      <Button label="Volver" icon="pi pi-arrow-left" class="mt-3 p-button-text text-white" @click="$router.push('/')" />
    </div>

    <Dialog
        v-model:visible="showModal"
        :header="selectedMarker?.title || 'Información'"
        modal
        :style="{ width: '90vw', maxWidth: '500px' }"
        :draggable="false"
        :dismissableMask="true"
    >
      <div v-if="selectedMarker" class="p-1">
        <div v-if="selectedMarker.type === 'VIDEO'" class="mb-3 border-round overflow-hidden">
          <iframe v-if="selectedMarker.videoUrl" width="100%" height="250" :src="selectedMarker.videoUrl" frameborder="0" allowfullscreen></iframe>
        </div>

        <p class="line-height-3 text-700 m-0">
          {{ selectedMarker.description || selectedMarker.content || 'Sin descripción disponible.' }}
        </p>
      </div>
      <template #footer>
        <Button label="Cerrar" icon="pi pi-check" @click="closeModal" autofocus />
      </template>
    </Dialog>

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
  min-height: 500px;
  background: #000;
}

.viewer {
  width: 100%;
  height: 100%;
  background: #000;
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
  z-index: 100;
}
</style>