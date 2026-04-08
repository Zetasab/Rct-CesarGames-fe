import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
const resolvedBasePath =
  envBasePath ?? (isGithubActions && repoName ? `/${repoName}` : "");
const normalizedBasePath =
  resolvedBasePath && resolvedBasePath !== "/"
    ? resolvedBasePath.replace(/\/$/, "")
    : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: normalizedBasePath || undefined,
  assetPrefix: normalizedBasePath ? `${normalizedBasePath}/` : undefined,
  experimental: {
    optimizePackageImports: ["primereact"],
  },
  images: {
    unoptimized: true,
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
