import './assets/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueQueryPlugin, VueQueryPluginOptions } from '@tanstack/vue-query'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
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

app.use(router).use(VueQueryPlugin, vueQueryPluginOptions).use(autoAnimatePlugin).mount('#app')
