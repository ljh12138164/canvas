// import withBundleAnalyzer from '@next/bundle-analyzer';
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nodeEnv = process.env.ENV as 'TAURI' | undefined;

// 创建bundle-analyzer包装器
// const withBundleAnalyzerWrapper = withBundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true',
// });

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

    output: 'standalone',
    eslint: {
      ignoreDuringBuilds: true,
    },

    // 自定义webpack配置
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // 优化模块ID生成方式
        config.optimization.moduleIds = 'deterministic';

        // 增强代码拆分配置
        config.optimization.splitChunks = {
          chunks: 'all',
          minSize: 20000,
          maxSize: 240000, // 降低最大块大小以更好地分割代码
          // cacheGroups: {
          //   // React 相关核心包
          //   'react-vendor': {
          //     test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|@tanstack|supabase)[\\/]/,
          //     name: 'react-vendor',
          //     priority: 40,
          //     enforce: true,
          //     reuseExistingChunk: true,
          //   },
          //   // UI 组件相关
          //   'ui-vendor': {
          //     test: /[\\/]node_modules[\\/](@radix-ui.*|@hookform.*|class-variance-authority|tailwind-merge|dayjs|date-fns|lodash-es.*|crypto-js|zod|react-icons)[\\/]/,
          //     name: 'ui-vendor',
          //     priority: 30,
          //     chunks: 'async',
          //     reuseExistingChunk: true,
          //   },
          //   // 图表相关
          //   'chart-vendor': {
          //     test: /[\\/]node_modules[\\/](recharts|d3-.*|react-smooth|victory.*|react-day-picker)[\\/]/,
          //     name: 'chart-vendor',
          //     chunks: 'async',
          //     minChunks: 2,
          //     reuseExistingChunk: true,
          //   },
          //   // Mermaid图表相关 - 添加专门的分块配置
          //   'mermaid-vendor': {
          //     test: /[\\/]node_modules[\\/](mermaid|d3|dagre|cytoscape|khroma|internmap)[\\/]/,
          //     name: 'mermaid-vendor',
          //     priority: 25,
          //     chunks: 'async',
          //     reuseExistingChunk: true,
          //   },
          //   // 编辑器相关
          //   'editor-vendor': {
          //     test: /[\\/]node_modules[\\/](@tiptap.*|prosemirror.*|@hocuspocus.*)[\\/]/,
          //     name: 'editor-vendor',
          //     priority: 20,
          //     chunks: 'async',
          //     reuseExistingChunk: true,
          //   },
          //   'fabric-vendor': {
          //     test: /[\\/]node_modules[\\/](fabric.*)[\\/]/,
          //     name: 'fabric-vendor',
          //     priority: 20,
          //     chunks: 'async',
          //     reuseExistingChunk: true,
          //   },
          //   // 将quill单独打包
          //   'quill-vendor': {
          //     test: /[\\/]node_modules[\\/](quill.*|react-quill.*)[\\/]/,
          //     name: 'quill-vendor',
          //     priority: 20,
          //     chunks: 'async',
          //     reuseExistingChunk: true,
          //   },
          //   // react-markdown-editor-lite
          //   'refactor-vendor': {
          //     test: /[\\/]node_modules[\\/](@refactor.*|react-markdown|localforage)[\\/]/,
          //     name: 'refactor-vendor',
          //     priority: 20,
          //     chunks: 'async',
          //     reuseExistingChunk: true,
          //   },
          //   'loader-pdf': {
          //     test: /[\\/]node_modules[\\/](pdf.*)[\\/]/,
          //     name: 'loader-pdf',
          //     priority: 20,
          //     chunks: 'async',
          //     reuseExistingChunk: true,
          //   },
          //   // 其他第三方库
          //   vendors: {
          //     test: /[\\/]node_modules[\\/]/,
          //     name: 'vendors',
          //     priority: 10,
          //     chunks: 'async',
          //     minChunks: 2,
          //     reuseExistingChunk: true,
          //   },
          // },
        };

        // 添加路由优化
        config.optimization.runtimeChunk = 'single';

        // 优化tree-shaking
        if (isProd) {
          config.optimization.usedExports = true;
          config.optimization.sideEffects = true;
        }
      }
      return config;
    },

    // 生产环境移除 console
    compiler: {
      removeConsole: isProd,
    },

    // 实验性功能
    experimental: {
      // 开启 Next.js 的实验性优化特性
      optimizeCss: true, // 优化 CSS
      scrollRestoration: true, // 滚动位置恢复
      reactCompiler: true,
      // 使用 lightningcss 优化 CSS
      mdxRs: true, // 使用 Rust 编译 MDX
    },
    headers: async () => {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: isProd
                ? 'public, max-age=31536000, immutable' // 生产环境使用更积极的缓存策略
                : 'public, max-age=0, must-revalidate',
            },
          ],
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
