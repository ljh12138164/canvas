import { createApp } from "vue";
import { routers } from "./router";
import App from "./App.vue";
// toast
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
const vuetify = createVuetify({
  components,
  directives,
});
const app = createApp(App);
// 使用路由 和 vuetify 和 toast
app
  .use(routers)
  .use(vuetify)
  .use(Vue3Toastify, {
    autoClose: 3000,
    // ...
  } as ToastContainerOptions);
// 挂载
app.mount("#root");
