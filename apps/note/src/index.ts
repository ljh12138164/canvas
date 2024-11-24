import { createApp } from "vue";
import { routers } from "./router";
import App from "./App.vue";
const app = createApp(App);
app.use(routers);
app.mount("#root");
