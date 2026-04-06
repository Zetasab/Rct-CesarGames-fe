import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["primereact"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 604800,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "media.rawg.io",
      },
    ],
  },
};

export default nextConfig;
