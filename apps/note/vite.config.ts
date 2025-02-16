import { URL, fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
// import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import removeConsole from 'vite-plugin-remove-console';
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
  removeConsole(),
  // visualizer({
  //   // 打包完成后自动打开浏览器，显示产物体积报告
  //   open: true,
  // }),
];
if (process.env.NODE_ENV === 'test') {
  plugins.push(
    // visualizer({
    //   // 打包完成后自动打开浏览器，显示产物体积报告
    //   open: true,
    // }),
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
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 核心库
          'vue-vendor': ['vue', 'vue-router', 'pinia'],

          // UI 组件库
          'ui-vendor': ['radix-vue', 'vaul-vue', 'vuetify', 'v-calendar', 'vue3-toastify'],

          // 编辑器相关
          'editor-vendor': [
            '@tiptap/vue-3',
            '@tiptap/starter-kit',
            '@tiptap/extension-link',
            '@tiptap/extension-image',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-typography',
            '@tiptap/extension-underline',
            '@tiptap/extension-text-style',
            '@tiptap/extension-text-align',
            '@tiptap/extension-subscript',
            '@tiptap/extension-superscript',
            '@tiptap/extension-table',
            '@tiptap/extension-table-cell',
            '@tiptap/extension-table-header',
            '@tiptap/extension-table-row',
            '@tiptap/extension-task-item',
            '@tiptap/extension-task-list',
          ],

          // 协同编辑相关
          'collab-vendor': ['yjs', 'y-indexeddb', 'y-prosemirror', '@hocuspocus/provider'],

          // 数据处理相关
          'data-vendor': ['@tanstack/vue-query', '@tanstack/vue-table', '@unovis/vue'],

          // 工具库
          'utils-vendor': [
            'lodash-es',
            'dayjs',
            'date-fns',
            'nanoid',
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
          ],

          // 表单验证相关
          'form-vendor': ['vee-validate', '@vee-validate/zod', 'zod'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
});
