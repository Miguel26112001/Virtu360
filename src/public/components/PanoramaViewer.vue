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
      showModal: false,
      galleriaResponsiveOptions: [
        { breakpoint: '1024px', numVisible: 5 },
        { breakpoint: '768px', numVisible: 3 },
        { breakpoint: '560px', numVisible: 1 }
      ]
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
    },

    formatVideoUrl(url) {
      if (!url) return '';

      let videoId = '';

      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      else if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      }
      else if (url.includes('embed/')) {
        return url;
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
      }

      return url;
    },

    onModalHide() {
      this.selectedMarker = null;
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
        modal
        :draggable="false"
        :dismissableMask="true"
        class="premium-dialog"
        @hide="onModalHide"
        :style="{ width: '90vw', maxWidth: '800px' }"
    >
      <template #header>
        <div class="dialog-header">
          <span class="category-tag">{{ selectedMarker?.type }}</span>
          <h2 class="dialog-title">{{ selectedMarker?.title || 'Detalles' }}</h2>
        </div>
      </template>

      <div v-if="selectedMarker" class="dialog-body">

        <div v-if="selectedMarker.type === 'VIDEO'" class="visual-container shadow-4">
          <iframe
              :src="formatVideoUrl(selectedMarker.videoUrl)"
              width="100%"
              height="100%"
              frameborder="0"
          ></iframe>
        </div>

        <div v-if="selectedMarker.type === 'GALLERY' && selectedMarker.imageUrls?.length" class="visual-container shadow-4">
          <Galleria
              :value="selectedMarker.imageUrls"
              :responsiveOptions="galleriaResponsiveOptions"
              :numVisible="5"
              containerStyle="width: 100%"
              :showThumbnails="selectedMarker.imageUrls.length > 1"
              :showItemNavigators="true"
              :showItemNavigatorsOnHover="false"
              :circular="true"
              :autoPlay="true"
              :transitionInterval="4000"
          >
            <template #item="slotProps">
              <img :src="slotProps.item" style="width: 100%; display: block; aspect-ratio: 16/9; object-fit: cover;" />
            </template>
            <template #thumbnail="slotProps">
              <img :src="slotProps.item" style="width: 50px; display: block; border-radius: 4px;" />
            </template>
          </Galleria>
        </div>

        <div class="content-container mt-4">
          <div v-if="selectedMarker.summary" class="summary-box">
            <p>{{ selectedMarker.summary }}</p>
          </div>
        </div>
      </div>
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

.info-tooltip-container .psv-tooltip-content {
  padding: 0; /* Quitamos el padding por defecto para controlar el diseño */
  max-width: 250px;
}

.custom-tooltip {
  padding: 12px;
  font-family: sans-serif;
  color: #333;
}

.custom-tooltip h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #007bff;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

.custom-tooltip .summary {
  font-size: 13px;
  margin-bottom: 6px;
}

.custom-tooltip .content {
  font-size: 12px;
  line-height: 1.4;
  color: #555;
}

.custom-tooltip .desc {
  font-size: 11px;
  font-style: italic;
  color: #888;
  margin-top: 8px;
}

:deep(.non-clickable-marker) {
  cursor: default !important;
}

:deep(.non-clickable-marker) {
  cursor: default !important;
}

:deep(.psv-marker:not(.non-clickable-marker)) {
  cursor: pointer !important;
}

.description-section {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 10px;
}

:deep(.p-galleria) {
  border: none;
}

:deep(.p-galleria-item-wrapper) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.p-galleria-thumbnail-container) {
  background: rgba(0, 0, 0, 0.03);
  padding: 1rem;
  border-radius: 0 0 12px 12px;
}

:deep(.p-galleria-item-prev),
:deep(.p-galleria-item-next) {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  transition: background-color 0.3s;
}

:deep(.p-galleria-item-prev:hover),
:deep(.p-galleria-item-next:hover) {
  background-color: rgba(255, 255, 255, 0.5);
}

:deep(.premium-dialog .p-dialog-content) {
  padding-bottom: 2rem;
}

.visual-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.visual-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.summary-box {
  border-left: 4px solid #3b82f6;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.summary-box p {
  font-size: 1.1rem;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}

.dialog-body {
  padding-top: 1rem;
}
</style>