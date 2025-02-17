import path from 'node:path';
import react from '@vitejs/plugin-react';
// import reactCompiler from '@vitejs/plugin-react-swc';
// import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import removeConsole from 'vite-plugin-remove-console';
// import viteImagemin from 'vite-plugin-imagemin';

const plugins = [
  react({
    babel: {
      plugins: [['babel-plugin-react-compiler', { targe: 19 }]],
    },
    // fastRefresh: true,
  }), // 打包后压缩图片
  // reactCompiler(),
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
  //   open: true,
  // }),
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
          if (id.includes('node_modules')) {
            // React 核心和路由
            if (
              id.includes('react/') ||
              id.includes('react-dom/') ||
              id.includes('react-router') ||
              id.includes('prosemirror')
            ) {
              return 'react-core';
            }

            // UI 组件和工具
            if (
              id.includes('@radix-ui') ||
              id.includes('lucide-react') ||
              id.includes('react-icons') ||
              id.includes('class-variance-authority') ||
              id.includes('clsx') ||
              id.includes('tailwind-merge') ||
              id.includes('framer-motion') ||
              id.includes('react-query') ||
              id.includes('react-hook-form') ||
              id.includes('@hookform/resolvers') ||
              id.includes('tanstack')
            ) {
              return 'static-libs';
            }

            // 功能型库 (编辑器、图表、日历等)
            if (
              id.includes('echarts') ||
              id.includes('react-big-calendar') ||
              id.includes('react-day-picker')
            ) {
              return 'features-libs';
            }

            // 工具库和状态管理
            if (
              id.includes('date-fns') ||
              id.includes('dayjs') ||
              id.includes('mobx') ||
              id.includes('zod') ||
              id.includes('nanoid') ||
              id.includes('socket.io') ||
              id.includes('supabase') ||
              id.includes('tiptap') ||
              id.includes('quill') ||
              id.includes('lodash')
            ) {
              return 'utils-libs';
            }
            // 剩余的 node_modules 依赖
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
