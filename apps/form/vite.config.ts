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
  viteCompression({
    verbose: true, // 是否在控制台输出压缩结果
    disable: false, // 默认 false, 设置为 true 来禁用压缩
    threshold: 10240, // 只处理大于此大小的资源（单位：字节）。默认值为 0。
    algorithm: 'gzip', // 使用 gzip 压缩
    ext: '.gz', // 输出文件的扩展名
    deleteOriginFile: false,
  }),
  viteCompression({
    verbose: true, // 是否在控制台输出压缩结果
    disable: false, // 默认 false, 设置为 true 来禁用压缩
    threshold: 10240, // 只处理大于此大小的资源（单位：字节）。默认值为 0。
    algorithm: 'brotliCompress', // 使用 brotli 压缩
    ext: '.br', // 输出文件的扩展名
    deleteOriginFile: false,
  }),
  // visualizer({
  //   open: true,
  // }),
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
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // ui-libs
            if (
              id.includes('vue') ||
              id.includes('radix-vue') ||
              id.includes('vuetify') ||
              id.includes('@floating-ui')
            ) {
              return 'ui-libs';
            }
            // excel
            if (id.includes('exceljs')) {
              return 'exceljs';
            }
            return 'vendors';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    minify: 'terser',
    cssMinify: 'lightningcss',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // sourcemap: true,
    chunkSizeWarningLimit: 935,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
