import { URL, fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
// import { visualizer } from 'rollup-plugin-visualizer';
import tailwind from 'tailwindcss';
import { defineConfig } from 'vite';
// import vueDevTools from 'vite-plugin-vue-devtools';
import viteCompression from 'vite-plugin-compression';
// import viteImagemin from 'vite-plugin-imagemin';
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
  // vueDevTools(),
  // visualizer({
  //   // 打包完成后自动打开浏览器，显示产物体积报告
  //   open: true,
  // }),
  // 打包后压缩
  // viteCompression(),
];
if (process.env.NODE_ENV === 'test') {
  plugins.push();
}
// https://vite.dev/config/
export default defineConfig({
  plugins: plugins,
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'excel-vendor': ['exceljs'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    target: 'es2015',
    cssTarget: 'chrome80',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // sourcemap: true,
    chunkSizeWarningLimit: 1500,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
