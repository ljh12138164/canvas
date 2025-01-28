import { routerCheckLogin } from '@/lib';
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/pages/home/index.vue'),
  },
  {
    path: '/workspace',
    component: () => import('@/pages/workspace/index.vue'),
    redirect: '/workspace/home',
    beforeEnter: routerCheckLogin,
    children: [
      {
        path: 'home',
        component: () => import('@/pages/workspace/home.vue'),
        beforeEnter: routerCheckLogin,
      },
      {
        path: ':workspaceId',
        component: () => import('@/pages/workspace/workspaceItem.vue'),
        beforeEnter: routerCheckLogin,
      },
      {
        path: ':workspaceId/member',
        component: () => import('@/pages/workspace/member.vue'),
        beforeEnter: routerCheckLogin,
      },
      {
        path: ':workspaceId/detail/:folderId',
        component: () => import('@/pages/workspace/detail.vue'),
        beforeEnter: routerCheckLogin,
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/pages/login/index.vue'),
    beforeEnter: routerCheckLogin,
  },

  {
    path: '/workspace/:workspaceId/',
    component: () => import('../pages/edit/index.vue'),
    beforeEnter: routerCheckLogin,
    children: [
      {
        path: 'folders/:folderId',
        component: () => import('@/pages/edit/Home.vue'),
        beforeEnter: routerCheckLogin,
      },
      {
        path: 'folders/:folderId/files/:fileId',
        component: () => import('@/pages/edit/Home.vue'),
        beforeEnter: routerCheckLogin,
      },
      {
        path: 'folders/:folderId/:fileId',
        component: () => import('@/pages/edit/Home.vue'),
        beforeEnter: routerCheckLogin,
      },
      {
        path: 'edit/home',
        component: () => import('@/pages/workspace/member.vue'),
        beforeEnter: routerCheckLogin,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

export const routers = createRouter({
  history: createWebHistory(),
  routes,
});
