<script>
export default {
  name: 'App',
  data() {
    return {
      // Puedes manejar estados globales aquí si es necesario
    };
  },
  computed: {
    isViewerMode() {
      return this.$route.name === 'tours';
    }
  },
  methods: {
    confirmExit() {
      this.$confirm.require({
        message: '¿Estás seguro de que quieres salir del tour?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.$router.push({ name: 'home' });
        }
      });
    }
  },
  mounted() {
    console.log("App principal montada");
  }
}
</script>

<template>
  <Toast />

  <ConfirmDialog />

  <div :class="['app-container', { 'full-screen': isViewerMode }]">

    <header v-if="!isViewerMode" class="surface-card p-4 shadow-1 flex align-items-center justify-content-between">
      <div class="flex align-items-center gap-3">
        <i class="pi pi-compass text-primary text-3xl"></i>
        <span class="text-2xl font-black text-900">Virtu360</span>
      </div>
      <nav>
        <Button label="Explorar" variant="text" @click="$router.push('/')" />
      </nav>
    </header>

    <main :class="['main-content', { 'p-0': isViewerMode, 'p-4 md:p-6': !isViewerMode }]">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

  </div>
</template>

<style>
/* Estilos Globales y Reset */
:root {
  --app-bg: var(--p-surface-50);
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--app-bg);
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.full-screen {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

.p-0 { padding: 0 !important; }
</style>