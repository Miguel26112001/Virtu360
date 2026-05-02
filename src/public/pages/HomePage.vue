<script>
import HeaderSection from '@/shared/components/HeaderSection.vue'
import FooterSection from '@/shared/components/FooterSection.vue'
import PanoramaViewer from '@/public/components/PanoramaViewer.vue'

export default {
  name: 'HomePage',
  components: {
    HeaderSection,
    FooterSection,
    PanoramaViewer
  }
}
</script>

<template>
  <div class="page-container">
    <HeaderSection class="overlay-header" />

    <main class="main-content">
      <!-- Sección Inmersiva -->
      <section class="viewer-section">
        <PanoramaViewer startNodeId="1" class="main-viewer" />

        <!-- Texto flotante sobre el visor -->
        <div class="viewer-content">
          <h2 class="hero-title">Explora el Futuro</h2>
          <p class="hero-subtitle">
            Recorrido virtual inmersivo de alta resolución.
          </p>
        </div>
      </section>

      <!-- Sección informativa secundaria -->
      <section class="info-section">
        <div class="info-text">
          <h2>Vive la experiencia 360°</h2>
          <p>Utiliza las flechas para navegar entre ambientes y los marcadores para obtener más información.</p>
        </div>
      </section>
    </main>

    <FooterSection />
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
}

.overlay-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
  color: white;
}

.main-content {
  flex: 1;
}

.viewer-section {
  position: relative;
  height: 85vh;
  width: 100%;
  overflow: hidden;
}

.main-viewer {
  height: 100% !important;
  width: 100% !important;
  max-width: 100% !important;
}

.viewer-content {
  position: absolute;
  bottom: 10%;
  left: 5%;
  z-index: 10;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
  pointer-events: none;
  max-width: 90%;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
}

.info-section {
  padding: 4rem 2rem;
  background: white;
  text-align: center;
}

.info-text {
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .hero-title { font-size: 2rem; }
  .viewer-section { height: 60vh; }
}
</style>