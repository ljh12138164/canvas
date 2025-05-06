import { URL, fileURLToPath } from 'node:url';
import { preloadAnalyzerPlugin } from '@ljh/lib';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { type PluginOption, defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import VitePluginSitemap from 'vite-plugin-sitemap';

// @ts-ignore
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
  // @ts-ignore
  tailwindcss(),
  createHtmlPlugin({
    minify: true,
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
    hostname: 'https://form.ljhboard.cn',
    dynamicRoutes: [
      '/', // 首页
      '/workspace', // 工作区主页
      '/workspace/board', // 看板
      '/workspace/form', // 表单列表
      '/workspace/form/detail/:id', // 表单详情
      '/workspace/form/edit/:id', // 表单编辑
      '/workspace/create', // 创建表单
      '/workspace/create/:id', // 根据ID创建表单
      '/workspace/create/preview/:id', // 预览创建的表单
      '/workspace/preview', // 预览表单
      '/workspace/sum', // 提交总结
      '/workspace/sum/:id', // 特定提交总结
      '/workspace/sum/:id/:detail', // 提交详情
      '/workspace/submit', // 表单总结
      '/workspace/my-submit', // 我的提交
      '/workspace/my-submit/:id', // 我的特定提交
      '/workspace/submit/:inviteCode', // 提交特定表单
      '/workspace/table', // 表单管理
    ],
    exclude: [
      '/404', // 排除404页面
      '/:pathMatch(.*)*', // 排除所有未匹配路径
    ],
    // 更新频率设置
    lastmod: new Date(),
    changefreq: {
      '/': 'daily',
      '/workspace': 'daily',
      '/workspace/board': 'daily',
      '/workspace/form': 'hourly',
      '/workspace/submit/*': 'always',
      '/workspace/my-submit/*': 'hourly',
      '/workspace/sum/*': 'hourly',
      default: 'weekly',
    },
    priority: {
      '/': 1.0,
      '/workspace': 0.9,
      '/workspace/board': 0.8,
      '/workspace/form': 0.8,
      '/workspace/create': 0.7,
      '/workspace/submit/*': 0.6,
      '/workspace/sum/*': 0.6,
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
  plugins.push();
}
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
        chunkFileNames: 'static/js/[name].[hash].js',
        entryFileNames: 'static/js/[name].[hash].js',
        assetFileNames: 'static/[ext]/[name].[hash].[ext]',
      },
    },
    minify: 'terser',
    // 生成 manifest.json
    // 生成 manifest.json
    manifest: true,
    // 指定静态资源目录
    assetsDir: 'static',
    // 是否生成 sourcemap
    sourcemap: false,
    // 是否清空输出目录
    emptyOutDir: true,
    cssMinify: 'lightningcss',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
