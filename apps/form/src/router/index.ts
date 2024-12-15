import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/auth.vue'),
    },
    {
      path: '/home',
      name: 'home',
      // @ts-ignore
      component: () => import('../views/home.vue'),
    },
  ],
})

export default router
