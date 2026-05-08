<script>
import { ProjectService } from "@/public/services/project.service.js";

export default {
  name: "ProjectsPage",
  data() {
    return {
      projectService: new ProjectService(),
      projects: [],
      loading: false
    };
  },
  methods: {
    async fetchPublishedProjects() {
      this.loading = true;
      try {
        this.projects = await this.projectService.getPublishedProjects();
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error de conexión',
          detail: 'No se pudieron cargar los tours. Intente más tarde.',
          life: 5000
        });
      } finally {
        this.loading = false;
      }
    },
    navigateToTour(project) {
      this.$router.push({
        name: 'tours',
        params: {
          projectId: project.id
        },
        query: {
          start: project.startingNodeId
        }
      });
    }
  },
  mounted() {
    this.fetchPublishedProjects();
  }
}
</script>

<template>
  <div class="p-4 md:p-6 min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-300">

    <div class="flex flex-column align-items-center mb-6 text-center">
      <h1 class="text-5xl font-black text-900 dark:text-0 mb-2">Explora el Mundo</h1>
      <p class="text-xl text-600 dark:text-400 max-w-30rem">
        Selecciona un tour virtual y comienza tu viaje inmersivo en 360 grados.
      </p>
      <Divider class="w-6rem border-top-3 border-primary" />
    </div>

    <div v-if="loading" class="flex flex-column align-items-center justify-content-center py-8">
      <ProgressSpinner strokeWidth="4" />
      <span class="mt-4 text-primary font-bold">Buscando experiencias...</span>
    </div>

    <div v-else-if="projects.length > 0" class="grid px-2 md:px-4">
      <div v-for="project in projects" :key="project.id" class="col-12 sm:col-6 lg:col-4 xl:col-3 p-3">

        <Card class="h-full border-none shadow-2 hover:shadow-6 transition-all transition-duration-300 overflow-hidden cursor-pointer flex flex-column"
              @click="navigateToTour(project)">
          <template #header>
            <div class="relative overflow-hidden">
              <img alt="thumbnail"
                   src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800"
                   class="w-full h-12rem object-cover transition-transform transition-duration-500 hover:scale-110" />
              <div class="absolute top-0 left-0 m-2">
                <Tag severity="secondary" :value="`${project.totalNodes} puntos`" class="bg-black-alpha-60 backdrop-blur-sm" />
              </div>
            </div>
          </template>

          <template #title>
            <div class="text-xl font-bold text-900 line-height-2">{{ project.title }}</div>
          </template>

          <template #content>
            <p class="m-0 text-600 line-height-3 line-clamp-3">
              {{ project.description || 'Explora este increíble recorrido virtual con tecnología de 360 grados.' }}
            </p>
          </template>

          <template #footer>
            <div class="flex align-items-center justify-content-between mt-auto pt-3 border-top-1 border-100">
              <span class="text-sm font-medium text-primary">Comenzar Tour</span>
              <i class="pi pi-arrow-right text-primary"></i>
            </div>
          </template>
        </Card>

      </div>
    </div>

    <div v-else class="flex flex-column align-items-center py-8 text-center">
      <div class="w-8rem h-8rem bg-surface-200 border-circle flex align-items-center justify-content-center mb-4">
        <i class="pi pi-map-marker text-5xl text-500"></i>
      </div>
      <h3 class="text-2xl font-bold text-700">No hay tours disponibles</h3>
      <p class="text-500 max-w-20rem">Parece que aún no se han publicado recorridos virtuales en esta sección.</p>
    </div>

  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>