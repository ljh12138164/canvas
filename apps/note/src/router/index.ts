import { createMemoryHistory, createRouter } from "vue-router";

const routes = [{ path: "/", component: () => import("../App.vue") }];

export const routers = createRouter({
  history: createMemoryHistory(),
  routes,
});
