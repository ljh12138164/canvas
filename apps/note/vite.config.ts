import { URL, fileURLToPath } from 'node:url';
import { preloadAnalyzerPlugin } from '@ljh/lib';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import visualizer from 'rollup-plugin-visualizer';
import { type Plugin, type PluginOption, defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import removeConsole from 'vite-plugin-remove-console';
import VitePluginSitemap from 'vite-plugin-sitemap';
// import UnoCSS from 'unocss/vite';
// function earlyHintsPlugin(): Plugin {
//   return {
//     name: 'vite-plugin-early-hints',
//     configureServer(server) {
//       server.middlewares.use((req, res, next) => {
//         // 收集需要预加载的资源
//         const earlyHintResources = new Set<string>();

//         // 添加关键资源
//         earlyHintResources.add('/src/main.ts');
//         earlyHintResources.add('/src/App.vue');

//         // Vue 相关资源
//         earlyHintResources.add('/node_modules/vue/dist/vue.runtime.esm-bundler.js');

//         // 样式资源
//         earlyHintResources.add('/src/assets/main.css');

//         // 构建 Link header
//         const linkHeaders = Array.from(earlyHintResources).map((resource) => {
//           const type = resource.endsWith('.css') ? 'style' : 'script';
//           return `<${resource}>; rel=preload; as=${type}`;
//         });

//         // 发送 Early Hints
//         if (linkHeaders.length > 0) {
//           res.writeHead(103, {
//             Link: linkHeaders.join(', '),
//           });
//         }

//         next();
//       });
//     },
//   };
// }
// @ts-ignore
const plugins: (PluginOption | Plugin)[] = [
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

  // @ts-ignore
  preloadAnalyzerPlugin(),
  // UnoCSS({
  //   mode: 'global',
  // }),
  // @ts-ignore
  tailwindcss(),
  // @ts-ignore
  removeConsole(),
  // 压缩html
  createHtmlPlugin({
    minify: true,
    /**

     * 在这里配置需要处理的 HTML 文件
     */
    pages: [
      {
        filename: 'index.html',
        template: 'index.html',
        injectOptions: {
          data: {
            title: 'index',
          },
        },
      },
    ],
  }),
  VitePluginSitemap({
    hostname: 'https://note.ljhboard.cn',
    dynamicRoutes: [
      '/', // 首页
      '/workspace', // 工作区
      '/workspace/home', // 工作区首页
      '/workspace/:workspaceId', // 特定工作区
      '/workspace/:workspaceId/member', // 工作区成员
      '/workspace/:workspaceId/detail/:folderId', // 文件夹详情
      '/workspace/:workspaceId/folders/:folderId', // 文件夹
      '/workspace/:workspaceId/folders/:folderId/files/:fileId', // 文件详情
    ],
    exclude: [],
    lastmod: new Date(),
    changefreq: {
      '/': 'daily',
      '/workspace': 'daily',
      '/workspace/home': 'daily',
      '/workspace/:workspaceId': 'hourly',
      '/workspace/:workspaceId/folders/*': 'always',
      '/workspace/:workspaceId/detail/*': 'hourly',
      default: 'weekly',
    },
    priority: {
      '/': 1.0,
      '/workspace': 0.9,
      '/workspace/home': 0.9,
      '/workspace/:workspaceId': 0.8,
      '/workspace/:workspaceId/folders/*': 0.7,
      '/workspace/:workspaceId/detail/*': 0.6,
      default: 0.5,
    },
    robots: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],

    generateRobotsTxt: true,
  }),
];
if (process.env.NODE_ENV === 'test') {
  plugins.push(
    // @ts-ignore
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
            return 'other-vendors';
          }
        },
        chunkFileNames: 'static/js/[name].[hash].js',
        entryFileNames: 'static/js/[name].[hash].js',
        assetFileNames: 'static/[ext]/[name].[hash].[ext]',
      },
    },

    // 生成 manifest.json
    manifest: true,
    // 指定静态资源目录
    assetsDir: 'static',
    // 是否生成 sourcemap
    sourcemap: false,
    // 是否清空输出目录
    emptyOutDir: true,
  },
});
