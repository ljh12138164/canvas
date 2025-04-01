// import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nodeEnv = process.env.ENV as 'TAURI' | undefined;

let nextConfig: NextConfig;

const isProd = process.env.NODE_ENV === 'production';
const internalHost = process.env.TAURI_DEV_HOST || 'localhost';

if (nodeEnv !== 'TAURI') {
  nextConfig = {
    // 图片配置
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'joxicbgouobvvfdxavbc.supabase.co',
        },
        {
          protocol: 'https',
          hostname: 'osdawghfaoyysblfsexp.supabase.co',
        },
        {
          protocol: 'https',
          hostname: 'challenges.cloudflare.com',
        },
      ],
      minimumCacheTTL: 60,
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    eslint: {
      ignoreDuringBuilds: true,
    },

    // 自定义webpack配置
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.optimization.splitChunks = {
          minSize: 20000,
          maxSize: 240000,
          chunks: 'all',
          cacheGroups: {
            // React 相关核心包
            'react-vendor': {
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|@tanstack|supabase)[\\/]/,
              name: 'react-vendor',
              priority: 40,
              enforce: true,
            },
            // UI 组件相关
            'ui-vendor': {
              test: /[\\/]node_modules[\\/](@radix-ui.*|@hookform.*|class-variance-authority|tailwind-merge|dayjs|date-fns|lodash-es.*|crypto-js|zod|react-icons)[\\/]/,
              name: 'ui-vendor',
              priority: 30,
              chunks: 'async', // 改为异步加载
            },
            // 图表相关
            'chart-vendor': {
              test: /[\\/]node_modules[\\/](recharts|d3-.*|react-smooth|victory.*|react-day-picker)[\\/]/,
              name: 'chart-vendor',
              chunks: 'async', // 改为异步加载
              minChunks: 2, // 至少被引用2次才会被打包
            },
            // 编辑器相关
            'editor-vendor': {
              test: /[\\/]node_modules[\\/](@tiptap.*|prosemirror.*|@hocuspocus.*)[\\/]/,
              name: 'editor-vendor',
              priority: 20,
              chunks: 'async',
            },
            'fabric-vendor': {
              test: /[\\/]node_modules[\\/](fabric.*|quill.*)[\\/]/,
              name: 'fabric-vendor',
              priority: 20,
              chunks: 'async',
            },
            // react-markdown-editor-lite
            'refactor-vendor': {
              test: /[\\/]node_modules[\\/](@refactor.* | react-markdown | localforage)[\\/]/,
              name: 'refactor-vendor',
              priority: 20,
              chunks: 'async',
            },
            // 其他第三方库
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              chunks: 'async', // 改为异步加载
              minChunks: 2, // 至少被引用2次才会被打包
            },
          },
        };
      }
      return config;
    },

    // 生产环境移除 console
    compiler: {
      // removeConsole: true,
    },

    // 实验性功能
    experimental: {
      // 开启 Next.js 的实验性优化特性
      optimizeCss: true, // 优化 CSS
      scrollRestoration: true, // 滚动位置恢复
      reactCompiler: true,
      // 使用 lightningcss 优化 CSS
      mdxRs: true, // 使用 Rust 编译 MDX
      // 使用 lightningcss 优化 CSS
      // useLightningcss: true,
      // 启用早期提示
      // enableEarlyHints: true,
    },
    headers: async () => {
      return [
        {
          source: '/(.*)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
        },
      ];
    },
  };
} else {
  // 桌面端配置
  nextConfig = {
    output: 'export',
    eslint: {
      ignoreDuringBuilds: true,
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.optimization.splitChunks = {
          minSize: 20000,
          maxSize: 240000,
          chunks: 'all',
        };
      }
      return config;
    },
    distDir: 'dist-desktop',
    // 添加这个配置来处理动态路由
    // exportPathMap: async () => {
    //   return {
    //     '/': { page: '/' },
    //     '/board': { page: '/board' },
    //     '/sign-in': { page: '/sign-in' },
    //     '/admin': { page: '/admin' },
    //     '/adminlogin': { page: '/adminlogin' },
    //     '/board/template': { page: '/board/template' },
    //     // 为动态路由添加默认路径
    //     '/board/ai/default': { page: '/board/ai/[id]', query: { id: 'default' } },
    //     '/board/formue/default': { page: '/board/formue/[id]', query: { id: 'default' } },
    //     '/Edit/default': { page: '/Edit/[Id]', query: { Id: 'default' } },
    //     '/EditTemplate/default': { page: '/EditTemplate/[Id]', query: { Id: 'default' } },
    //     '/try/Edit/default': { page: '/try/Edit/[id]', query: { id: 'default' } },
    //     '/user/default': { page: '/user/[id]', query: { id: 'default' } },
    //   };
    // },
    images: {
      unoptimized: true,
    },
    assetPrefix: isProd ? undefined : `http://${internalHost}:8400`,

    // 实验性功能
    experimental: {
      scrollRestoration: true, // 滚动位置恢复
      reactCompiler: true,
      mdxRs: true, // 使用 Rust 编译 MDX
    },
  };
}

// 添加打包分析工具
export default nextConfig;
