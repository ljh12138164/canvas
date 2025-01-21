import './assets/index.css';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query';
import i18next from 'i18next';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import App from './App.vue';
import translation from './lib/error.json';
import router from './router';

const i18n = createI18n({
  legacy: false, // you must set `false` to use the Composition API
  locale: 'zh-CN', // set default locale
  availableLocales: ['zh-CN', 'en'],
});
const pinia = createPinia();
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
  enableDevtoolsV6Plugin: true,
};
const app = createApp(App);
i18next.init({
  lng: 'zh-CN',
  resources: {
    zh: {
      zod: translation,
    },
  },
});
z.setErrorMap(zodI18nMap);

app.use(router).use(i18n).use(VueQueryPlugin, vueQueryPluginOptions).use(autoAnimatePlugin).use(pinia).mount('#app');
