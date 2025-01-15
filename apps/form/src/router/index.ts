import { routerCheckLogin } from '@/lib'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter: (to, from, next) => routerCheckLogin(to, from, next, false),
      component: () => import('../views/index.vue'),
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: () => import('../views/workspace/index.vue'),
      beforeEnter: routerCheckLogin,
      children: [
        {
          path: '/workspace/board',
          name: 'board',
          beforeEnter: routerCheckLogin,
          component: () => import('../views/workspace/form/index.vue'),
          meta: {
            title: '看板',
          },
        },
        {
          path: '/workspace/form',
          name: 'form',
          beforeEnter: routerCheckLogin,
          component: () => import('../views/workspace/form/index.vue'),
          meta: {
            title: '表单',
          },
        },
        {
          path: '/workspace/create',
          name: 'create',
          beforeEnter: routerCheckLogin,
          component: () => import('../views/workspace/create/index.vue'),
          meta: {
            title: '创建表单',
          },
        },
        {
          path: '/workspace/create/:id',
          name: 'createById',
          beforeEnter: routerCheckLogin,
          component: () => import('../views/workspace/create/[id].vue'),
          meta: {
            title: '创建表单',
          },
        },
        {
          path: '/workspace/preview',
          name: 'preview',
          beforeEnter: routerCheckLogin,
          component: () => import('../views/workspace/preview/index.vue'),
          meta: {
            title: '预览表单',
          },
        },
        {
          path: '/workspace/preview/:id',
          name: 'previewById',
          beforeEnter: routerCheckLogin,
          component: () => import('../views/workspace/preview/[id].vue'),
          meta: {
            title: '预览表单',
          },
        },
        {
          path: '/workspace/table',
          name: 'table',
          beforeEnter: routerCheckLogin,
          component: () => import('../views/workspace/board/index.vue'),
          meta: {
            title: '表单管理',
          },
        },
        {
          path: '/workspace/demo',
          name: 'demo',
          beforeEnter: routerCheckLogin,
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
