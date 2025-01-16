import './assets/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18next from 'i18next'
import { z } from 'zod'
import translation from './lib/error.json'
import { zodI18nMap } from 'zod-i18n-map'
import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false, // you must set `false` to use the Composition API
  locale: 'zh-CN', // set default locale
  availableLocales: ['zh-CN', 'en'],
})
const pinia = createPinia()
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
}
const app = createApp(App)
i18next.init({
  lng: 'zh-CN',
  resources: {
    zh: {
      zod: translation,
    },
  },
})
z.setErrorMap(zodI18nMap)

app
  .use(router)
  .use(i18n)
  .use(VueQueryPlugin, vueQueryPluginOptions)
  .use(autoAnimatePlugin)
  .use(pinia)
  .mount('#app')
