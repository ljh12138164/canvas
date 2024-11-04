import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // 图片配置
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "joxicbgouobvvfdxavbc.supabase.co",
      },
      {
        protocol: "https",
        hostname: "osdawghfaoyysblfsexp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
