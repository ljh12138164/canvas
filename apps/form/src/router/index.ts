import { routerCheckLogin } from '@/lib'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue'),
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: () => import('../views/index.vue'),
      beforeEnter: routerCheckLogin,
      children: [
        {
          path: '/workspace/board',
          name: 'board',
          component: () => import('../views/board/index.vue'),
          meta: {
            title: '看板',
          },
        },
        {
          path: '/workspace/form',
          name: 'form',
          component: () => import('../views/table/index.vue'),
          meta: {
            title: '表单',
          },
        },
        {
          path: '/workspace/create',
          name: 'create',
          component: () => import('../views/create/index.vue'),
          meta: {
            title: '创建表单',
          },
        },
        {
          path: '/workspace/create/:id',
          name: 'createById',
          component: () => import('../views/create/id.vue'),
          meta: {
            title: '创建表单',
          },
        },
        {
          path: '/workspace/preview',
          name: 'preview',
          component: () => import('../views/preview/index.vue'),
          meta: {
            title: '预览表单',
          },
        },
        {
          path: '/workspace/preview/:id',
          name: 'previewById',
          component: () => import('../views/preview/id.vue'),
          meta: {
            title: '预览表单',
          },
        },
        {
          path: '/workspace/table',
          name: 'table',
          component: () => import('../views/table/index.vue'),
          meta: {
            title: '表单管理',
          },
        },
        {
          path: '/workspace/demo',
          name: 'demo',
          component: () => import('../views/demo/index.vue'),
          meta: {
            title: 'demo',
          },
        },
      ],
      meta: {
        title: '看板',
      },
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
    {
      path: '/demo',
      name: 'demo',
      component: () => import('../views/demo/index.vue'),
      meta: {
        title: 'demo',
      },
    },
  ],
})

export default router
