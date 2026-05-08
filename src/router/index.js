import { createRouter, createWebHistory } from 'vue-router'
import TourViewerPage from '@/public/pages/TourViewerPage.vue'
import ProjectsPage from '@/public/pages/ProjectsPage.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: ProjectsPage
    },
    {
        path: '/projects',
        name: 'projects-list',
        component: ProjectsPage
    },
    {
        path: '/tours/:projectId',
        name: 'tours',
        component: TourViewerPage,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router