import { resolve } from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
export default defineConfig({
  // plugins: [
  //   nodePolyfills({
  //     include: ["fs", "stream", "buffer", "process"],
  //     protocolImports: true,
  //   }),
  // ],
  build: {
    lib: {
      entry: resolve(__dirname, "./api/index.ts"),
      name: "api",
      fileName: "api",
    },
  },
});
