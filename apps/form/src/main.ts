import './assets/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

const app = createApp(App)

app
  .use(router)
  .use(VueQueryPlugin, {
    enableDevtoolsV6Plugin: true,
  })
  .use(autoAnimatePlugin)
  .mount('#app')
