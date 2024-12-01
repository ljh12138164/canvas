import { routerCheckLogin, routerLoginAfter } from "@/lib";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("@/pages/home/index.vue") },
  {
    path: "/login",
    component: () => import("@/pages/login/index.vue"),
    beforeEnter: routerLoginAfter,
  },
  {
    path: "/edit/:id",
    component: () => import("@/pages/edit/index.vue"),
    beforeEnter: routerCheckLogin,
    props: true,
  },
  {
    path: "/board",
    component: () => import("@/pages/board/index.vue"),
    beforeEnter: routerCheckLogin,
  },
];

export const routers = createRouter({
  history: createWebHistory(),
  routes,
});
