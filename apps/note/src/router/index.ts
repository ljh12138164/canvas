import { routerCheckLogin, routerLoginAfter } from "@/lib";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/pages/home/index.vue"),
    children: [
      {
        path: "/workspace/",
        component: () => import("@/pages/workspace/index.vue"),
        redirect: "/workspace/home",
        children: [
          {
            path: "home",
            beforeEnter: routerCheckLogin,
            component: () => import("@/pages/workspace/home.vue"),
          },
          {
            path: ":workspaceId",
            beforeEnter: routerCheckLogin,
            component: () => import("@/pages/workspace/workspaceitem.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/pages/login/index.vue"),
    beforeEnter: routerLoginAfter,
  },

  // {
  //   path: "/workspace/:worskpaceId/home",
  //   component: () => import("@/pages/edit/index.vue"),
  //   beforeEnter: routerCheckLogin,
  //   children: [
  //     {
  //       path: "/",
  //       component: () => import("@/pages/edit/Home.vue"),
  //       beforeEnter: routerCheckLogin,
  //     },
  //     {
  //       path: ":folderId",
  //       component: () => import("@/pages/edit/Edit.vue"),
  //       beforeEnter: routerCheckLogin,
  //     },
  //     {
  //       path: "setting",
  //       component: () => import("@/pages/edit/Setting.vue"),
  //     },
  //     {
  //       path: "trash",
  //       component: () => import("@/pages/edit/Trash.vue"),
  //     },
  //   ],
  // },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

export const routers = createRouter({
  history: createWebHistory(),
  routes,
});
