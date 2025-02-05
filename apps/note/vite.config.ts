import { URL, fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
// import viteImagemin from 'vite-plugin-imagemin';
import vueDevTools from 'vite-plugin-vue-devtools';
const plugins = [
  vue(),
  // 打包后压缩图片
  // viteImagemin({
  //   gifsicle: {
  //     optimizationLevel: 7,
  //     interlaced: false,
  //   },
  //   optipng: {
  //     optimizationLevel: 7,
  //   },
  //   mozjpeg: {
  //     quality: 20,
  //   },
  //   pngquant: {
  //     quality: [0.8, 0.9],
  //     speed: 4,
  //   },
  //   svgo: {
  //     plugins: [
  //       {
  //         name: 'removeViewBox',
  //       },
  //       {
  //         name: 'removeEmptyAttrs',
  //         active: false,
  //       },
  //     ],
  //   },
  // }),
  vueDevTools(),
  // 打包后压缩
  viteCompression(),
];
if (process.env.NODE_ENV === 'test') {
  plugins.push(
    visualizer({
      // 打包完成后自动打开浏览器，显示产物体积报告
      open: true,
    }),
  );
}
// https://vite.dev/config/
export default defineConfig({
  plugins: plugins,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
