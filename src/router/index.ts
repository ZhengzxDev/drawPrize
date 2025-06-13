import { createRouter, createWebHistory } from 'vue-router'
import DrawView from '../views/DrawView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DrawView,
    },
  ],
})

export default router
