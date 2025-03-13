import type { NextConfig } from 'next';
import nextra from 'nextra';

const nextConfig: NextConfig = {
  compress: true,

  // 图片优化配置
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端代码分割配置
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // React 相关
          'react-vendor': {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            priority: 30,
            chunks: 'async', // 改为异步加载
            minChunks: 2, // 至少被引用2次才会被打包
          },

          // Nextra 相关
          'nextra-vendor': {
            test: /[\\/]node_modules[\\/](nextra|nextra-theme-docs)[\\/]/,
            name: 'nextra-vendor',
            priority: 20,
            chunks: 'async', // 改为异步加载
            minChunks: 2, // 至少被引用2次才会被打包
          },

          // MDX 相关
          'mdx-vendor': {
            test: /[\\/]node_modules[\\/](@mdx-js|remark|rehype|unified|mdast|hast)[\\/]/,
            name: 'mdx-vendor',
            priority: 15,
            chunks: 'async', // 改为异步加载
            minChunks: 2, // 至少被引用2次才会被打包
          },

          // 其他依赖
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
            chunks: 'async', // 改为异步加载
            minChunks: 2, // 至少被引用2次才会被打包
          },
        },
      };
    }
    return config;
  },

  // 实验性功能
  experimental: {
    optimizeCss: true, // CSS 优化
    mdxRs: true, // 使用 Rust 编译 MDX
    reactCompiler: true, // 使用 React 编译器
  },
};
const withNextra = nextra({
  // 使用next的Image图片优化
  staticImage: true,
});

export default withNextra(nextConfig);
