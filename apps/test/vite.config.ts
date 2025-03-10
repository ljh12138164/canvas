import path from 'node:path';
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react-swc';
import { type PluginOption, defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
// import { visualizer } from 'rollup-plugin-visualizer';
const plugins: PluginOption = [
  // visualizer({ open: true }) as PluginOption,
  mdx(),
  react(), // 打包后压缩
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
];
// https://vite.dev/config/
export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 静态资源分类打包,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 让每个 node_modules 中的包单独打包

            if (id.includes('react')) {
              return 'react-vendor';
            }
            if (id.includes('autoform')) {
              return 'autoform-vendor';
            }

            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
    chunkSizeWarningLimit: 60000,
  },
  // 设置最小警告的值
});
