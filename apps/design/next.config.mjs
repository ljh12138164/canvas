/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["joxicbgouobvvfdxavbc.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
