import path from 'node:path';
import react from '@vitejs/plugin-react';
import reactCompiler from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
// import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import removeConsole from 'vite-plugin-remove-console';
// import viteImagemin from 'vite-plugin-imagemin';

const plugins = [
  react({
    // fastRefresh: true,
  }), // 打包后压缩图片
  reactCompiler(),
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
  viteCompression(),
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
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
          ],
          'utils-vendor': ['date-fns', 'zod', 'styled-components', 'tailwind-merge'],
          'query-vendor': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'dnd-vendor': ['@dnd-kit/core', '@dnd-kit/modifiers'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
});
