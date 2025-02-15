// import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
    ],
    domains: ['challenges.cloudflare.com'],
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
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // React 相关核心包
          'react-vendor': {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|@tanstack\/react-query)[\\/]/,
            name: 'react-vendor',
            priority: 30,
            chunks: 'all',
          },

          // UI 组件相关
          'ui-vendor': {
            test: /[\\/]node_modules[\\/](@radix-ui.*|@hookform.*|class-variance-authority|tailwind-merge)[\\/]/,
            name: 'ui-vendor',
            priority: 20,
            chunks: 'all',
          },

          // 图表相关
          'chart-vendor': {
            test: /[\\/]node_modules[\\/](recharts|d3-.*|react-smooth|victory.*)[\\/]/,
            name: 'chart-vendor',
            priority: 20,
            chunks: 'all',
          },

          // 编辑器相关
          'editor-vendor': {
            test: /[\\/]node_modules[\\/](@tiptap.*|prosemirror.*|@hocuspocus.*)[\\/]/,
            name: 'editor-vendor',
            priority: 20,
            chunks: 'all',
          },

          // 工具库
          'utils-vendor': {
            test: /[\\/]node_modules[\\/](dayjs|date-fns|lodash.*|crypto-js|zod)[\\/]/,
            name: 'utils-vendor',
            priority: 15,
            chunks: 'all',
          },

          // 其他第三方库
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },

  // 生产环境移除 console 和 debugger
  compiler: {
    removeConsole: true,
  },

  experimental: {
    // 开启 Next.js 的实验性优化特性
    optimizeCss: true, // 优化 CSS
    scrollRestoration: true, // 滚动位置恢复
    reactCompiler: true,
  },
};

// 添加打包分析工具
export default nextConfig;
