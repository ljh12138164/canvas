import { routerCheckLogin } from '@/lib'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index.vue'),
      redirect: '/board',
      beforeEnter: routerCheckLogin,
      children: [
        {
          path: '/board',
          name: 'board',
          component: () => import('../views/board/index.vue'),
          meta: {
            title: '看板',
          },
        },
        {
          path: '/form',
          name: 'form',
          component: () => import('../views/table/index.vue'),
          meta: {
            title: '表单',
          },
        },
        {
          path: '/create',
          name: 'create',
          component: () => import('../views/create/index.vue'),
          meta: {
            title: '创建表单',
          },
        },
        {
          path: '/create/:id',
          name: 'createById',
          component: () => import('../views/create/id.vue'),
          meta: {
            title: '创建表单',
          },
        },
        {
          path: '/preview',
          name: 'preview',
          component: () => import('../views/preview/index.vue'),
          meta: {
            title: '预览表单',
          },
        },
        {
          path: '/preview/:id',
          name: 'previewById',
          component: () => import('../views/preview/id.vue'),
          meta: {
            title: '预览表单',
          },
        },
        {
          path: '/table',
          name: 'table',
          component: () => import('../views/table/index.vue'),
          meta: {
            title: '表单管理',
          },
        },
      ],
    },
    {
      path: '/auth',
      name: 'auth',
      beforeEnter: routerCheckLogin,
      component: () => import('../views/auth/index.vue'),
      meta: {
        title: '登录',
      },
    },
  ],
})

export default router
