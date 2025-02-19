import { URL, fileURLToPath } from 'node:url';
import { preloadAnalyzerPlugin } from '@ljh/lib';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
// import autoprefixer from 'autoprefixer';
// import tailwind from 'tailwindcss';
import { type PluginOption, defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
// import vueDevTools from 'vite-plugin-vue-devtools';
// import { visualizer } from 'rollup-plugin-visualizer';
// import pluginPurgeCss from '@mojojoejo/vite-plugin-purgecss';
// import viteImagemin from 'vite-plugin-imagemin';
const plugins: PluginOption[] = [
  vue(),
  // pluginPurgeCss({
  //   content: ['**/*.vue', '**/*.js', '**/*.ts'],
  //   css: ['**/*.css'],
  //   safelist: ['body'],
  // }),
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
  // @ts-ignore
  preloadAnalyzerPlugin(),
  tailwindcss(),
];
if (process.env.NODE_ENV === 'test') {
  plugins.push();
}
// https://vite.dev/config/
export default defineConfig({
  plugins: plugins,
  css: {
    postcss: {
      plugins: [],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (
              id.includes('nanoid') ||
              id.includes('dayjs') ||
              id.includes('zod') ||
              id.includes('hono') ||
              id.includes('clsx') ||
              id.includes('vuetify') ||
              id.includes('@floating-ui')
            ) {
              return 'vendors-common';
            }
            // ui-libs
            if (id.includes('vue')) {
              return 'ui-libs';
            }
            // excel
            if (id.includes('exceljs')) {
              return 'exceljs';
            }
            // console.log(id);
            if (
              id.includes('supabase') ||
              id.includes('internationalized') ||
              id.includes('tanstack')
            ) {
              return 'supabase';
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
