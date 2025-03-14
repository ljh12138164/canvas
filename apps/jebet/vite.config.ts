import path from 'node:path';
import { preloadAnalyzerPlugin } from '@ljh/lib';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { type PluginOption, defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import removeConsole from 'vite-plugin-remove-console';
import VitePluginSitemap from 'vite-plugin-sitemap';
// import pluginPurgeCss from '@mojojoejo/vite-plugin-purgecss';
// import { visualizer } from 'rollup-plugin-visualizer';
// import viteImagemin from 'vite-plugin-imagemin';

// @ts-ignore
const plugins: PluginOption[] = [
  react({
    babel: {
      plugins: [['babel-plugin-react-compiler', { targe: 19 }]],
    },
    // fastRefresh: true,
  }), // 打包后压缩图片
  tailwindcss(),
  // viteImagemin({
  //   gifsicle: {
  //     optimizationLevel: 7,
  //     interlaced: false,
  //   },
  //   optipng: {
  //     optimizationLevel:
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
  removeConsole(),
  // pluginPurgeCss(),
  // visualizer({
  //   open: true,
  // }),
  // @ts-ignore
  preloadAnalyzerPlugin(),
  createHtmlPlugin({
    minify: true,
    /**
     * ### 在这里配置需要处理的 HTML 文件
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
    hostname: 'https://jebet.ljhboard.cn',
    dynamicRoutes: [
      '/', // 首页
      '/dashboard', // 仪表盘
      '/dashboard/home', // 仪表盘首页
      '/dashboard/create', // 创建
      '/dashboard/:workspaceId', // 工作区
      '/dashboard/:workspaceId/home', // 工作区首页
      '/dashboard/:workspaceId/setting', // 工作区设置
      '/dashboard/:workspaceId/member', // 工作区成员
      '/dashboard/:workspaceId/chat', // 工作区聊天
      '/dashboard/:workspaceId/storage', // 工作区存储
      '/dashboard/:workspaceId/:projectId/home', // 项目首页
      '/dashboard/:workspaceId/:projectId/setting', // 项目设置
      '/dashboard/:workspaceId/:projectId/home/:taskId', // 项目任务详情
      '/dashboard/:workspaceId/:projectId/:taskId', // 任务页面
    ],
    exclude: ['/admin/*'], // 排除不需要收录的路由
    lastmod: new Date(),
    changefreq: {
      '/': 'daily',
      '/dashboard': 'daily',
      '/dashboard/home': 'daily',
      '/dashboard/:workspaceId/home': 'hourly',
      '/dashboard/:workspaceId/:projectId/home': 'hourly',
      '/dashboard/:workspaceId/:projectId/:taskId': 'always',
      '/dashboard/:workspaceId/chat': 'always',
      default: 'weekly',
    },
    priority: {
      '/': 1.0,
      '/dashboard': 0.9,
      '/dashboard/home': 0.9,
      '/dashboard/:workspaceId/home': 0.8,
      '/dashboard/:workspaceId/:projectId/home': 0.7,
      '/dashboard/:workspaceId/:projectId/:taskId': 0.6,
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
if (process.env.ANYES === 'test') {
  // 打包完成后自动打开浏览器，显示产物体积报告
  plugins.push(
    // visualizer({
    //   open: true,
    // }),
  );
}

export default defineConfig({
  plugins: plugins,

  // 打包完成后自动打开浏览器，显示产物体积报告
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8100,
    host: true,
  },
  build: {
    // 使用 lightningcss 压缩 css1
    cssMinify: 'lightningcss',
    // 使用 terser 压缩 js
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // UI 组件和工具
          if (id.includes('react')) {
            return 'react-components';
          }

          if (
            id.includes('@popperjs') ||
            id.includes('babel') ||
            id.includes('engine.io') ||
            id.includes('stylis') ||
            id.includes('tslib') ||
            id.includes('await-to-js') ||
            id.includes('clsx') ||
            id.includes('tippy')
            // id.includes('react-icons')
          ) {
            return 'popperjs';
          }

          if (
            id.includes('echarts') ||
            id.includes('react-error-boundary') ||
            id.includes('react-hot-toast')
            // id.includes('prosemirror') ||
            // id.includes('lucide-react') ||
            // id.includes('dom-helpers')
          ) {
            return 'ui';
          }

          if (id.includes('node_modules')) {
            if (
              id.includes('date-fns') ||
              id.includes('dayjs') ||
              // id.includes('mobx') ||
              id.includes('nanoid') ||
              id.includes('socket.io') ||
              id.includes('supabase') ||
              id.includes('lodash') ||
              id.includes('zod') ||
              id.includes('ahooks') ||
              id.includes('dnd-kit')
            ) {
              return 'utils-libs';
            }
            if (
              id.includes('react-big-calendar') ||
              id.includes('react-day-picker') ||
              id.includes('react-hook-form') ||
              id.includes('react-icons') ||
              id.includes('react-hot-toast')
            ) {
              return 'react-libs';
            }
            if (
              // id.includes('prosemirror') ||
              id.includes('zrender')
            ) {
              // React 核心和路由
              return 'lib-core';
            }

            // // 工具库和状态管理
            // 剩余的 node_modules 依赖
            return 'vendors';
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
