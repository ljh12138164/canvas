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
    path: "/workspace",
    component: () => import("@/pages/workspace/index.vue"),
    beforeEnter: routerCheckLogin,
  },
  {
    path: "/workspace/:worskpaceId/",
    component: () => import("@/pages/edit/index.vue"),
    beforeEnter: routerCheckLogin,
    children: [
      {
        path: "",
        component: () => import("@/pages/edit/Home.vue"),
        beforeEnter: routerCheckLogin,
      },
      {
        path: ":folderId",
        component: () => import("@/pages/edit/Edit.vue"),
        beforeEnter: routerCheckLogin,
      },
      {
        path: "setting",
        component: () => import("@/pages/edit/Setting.vue"),
      },
      {
        path: "trash",
        component: () => import("@/pages/edit/Trash.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

export const routers = createRouter({
  history: createWebHistory(),
  routes,
});
