import { createApp } from "vue";
import { routers } from "./router";
import App from "./App.vue";
import pinia from "./store";
import "./assets/index.css";
// toast
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const app = createApp(App);
// 使用路由 和 vuetify 和 toast
app
  .use(routers)
  .use(pinia)
  .use(Vue3Toastify, {
    autoClose: 3000,
    // ...
  } as ToastContainerOptions);
// 挂载
app.mount("#root");
