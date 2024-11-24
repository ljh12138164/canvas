import { createWebHistory, createRouter } from "vue-router";

const routes = [
  { path: "/home", component: () => import("@/pages/home/index.vue") },
  { path: "/edit", component: () => import("@/pages/Edit/index.vue") },
];

export const routers = createRouter({
  history: createWebHistory(),
  routes,
});
