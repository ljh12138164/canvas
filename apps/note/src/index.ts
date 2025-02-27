import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query';
import { createApp } from 'vue';
// import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
// import 'vue3-toastify/dist/index.css';
import App from './App.vue';
import './assets/index.css';
import { routers } from './router';
import pinia from './store';
// Vuetify
// import 'vuetify/styles';
// import { createVuetify } from 'vuetify';
// import * as components from 'vuetify/components';
// import * as directives from 'vuetify/directives';
// const vuetify = createVuetify({
//   components,
//   directives,
// });
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
  // .use(Vue3Toastify, {
  //   autoClose: 3000,
  //   // ...
  // } as ToastContainerOptions)
  .use(VueQueryPlugin, vueQueryPluginOptions);
// .use(autoAnimatePlugin);
// .use(vuetify);
// 挂载
app.mount('#root');
