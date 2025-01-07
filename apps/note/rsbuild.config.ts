import { defineConfig } from "@rsbuild/core";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginVue } from "@rsbuild/plugin-vue";

export default defineConfig({
  plugins: [pluginVue(), pluginSass()],
  html: {
    favicon: "./src/assets/image/favicon.ico",
  },
});
