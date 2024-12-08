import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.css';
// toast
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import {
  VueQueryPlugin,
  type VueQueryPluginOptions,
} from '@tanstack/vue-query';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import { routers } from './router';
import pinia from './store';
import 'vue3-toastify/dist/index.css';
// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
// 定义 UserMetadata 接口

// 在 User 接口中使用 UserMetadata

// Components
const vuetify = createVuetify({
  components,
  directives,
});
const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000 * 5,
        retry: 3,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        refetchInterval: 60 * 1000 * 5,
        refetchIntervalInBackground: true,
      },
    },
  },
};
const app = createApp(App);
// 使用路由 和 vuetify 和 toast
app
  .use(routers)
  .use(pinia)
  .use(Vue3Toastify, {
    autoClose: 3000,
    // ...
  } as ToastContainerOptions)
  .use(VueQueryPlugin, vueQueryPluginOptions)
  .use(autoAnimatePlugin)
  .use(vuetify);
// 挂载
app.mount('#root');
