import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/ProductsView.vue')
    },
    {
      path: '/product/:id',
      component: () => import('../views/ProductView.vue')
    },
    {
      path: '/products',
      component: () => import('../views/ProductsView.vue')
    }
  ]
})

export default router
