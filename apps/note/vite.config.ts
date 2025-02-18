import { URL, fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
// import { visualizer } from 'rollup-plugin-visualizer';
import { type PluginOption, defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import removeConsole from 'vite-plugin-remove-console';
// import pluginPurgeCss from '@mojojoejo/vite-plugin-purgecss';

// import viteImagemin from 'vite-plugin-imagemin';
// import vueDevTools from 'vite-plugin-vue-devtools';
const plugins: PluginOption[] = [
  vue(),
  // pluginPurgeCss(),
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
  // 打包后压缩
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
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Vue 相关依赖单独打包
            if (id.includes('vue') || id.includes('@vue')) {
              return 'vue-vendor';
            }

            // 工具库打包
            if (id.includes('tiptap') || id.includes('prosemirror') || id.includes('tanstack')) {
              return 'editor-vendor';
            }
            // 其他依赖打包
            return 'vendors';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
});
