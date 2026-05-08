<script>
import HeaderSection from '@/shared/components/HeaderSection.vue'
import FooterSection from '@/shared/components/FooterSection.vue'
import PanoramaViewer from '@/public/components/PanoramaViewer.vue'

export default {
  name: 'TourViewerPage',
  components: {
    HeaderSection,
    FooterSection,
    PanoramaViewer
  },
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  computed: {
    startNodeId() {
      return this.$route.query.start || null;
    }
  },
}
</script>

<template>
  <div class="page-container flex flex-column h-screen overflow-hidden">
    <HeaderSection class="overlay-header" />

    <main class="flex-grow-1 relative h-full">
      <PanoramaViewer
          v-if="projectId && startNodeId"
          :projectId="projectId"
          :startNodeId="startNodeId"
      />
      <div v-else class="flex align-items-center justify-content-center h-full bg-black">
        <ProgressSpinner />
      </div>
    </main>
  </div>
</template>

<style scoped>
.overlay-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%);
}

img {
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.02);
}
</style>