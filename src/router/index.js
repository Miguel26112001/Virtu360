import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/public/pages/HomePage.vue'

const routes = [
    { path: '/', name: 'home', component: HomePage }
]

export default createRouter({
    history: createWebHistory(),
    routes
})