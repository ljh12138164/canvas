import { resolve } from "path";
import { defineConfig } from "vite";
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./src/hono/index.ts"),
      name: "api",
      fileName: "api",
    },
  },
});
