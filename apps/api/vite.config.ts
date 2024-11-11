import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./api/index.ts"),
      name: "api",
      fileName: "api",
    },
  },
});
