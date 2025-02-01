// import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import nextra from 'nextra';
const nextConfig: NextConfig = {
  compress: true,
};
const withNextra = nextra({
  // 使用next的Image图片优化
  staticImage: true,
});

export default withNextra(nextConfig);
