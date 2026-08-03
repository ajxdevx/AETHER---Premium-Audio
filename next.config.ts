import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bundleAnalyzer from "@next/bundle-analyzer";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** Keep Turbopack dev RAM bounded on long sessions (bytes). ~1.5 GB */
const TURBOPACK_DEV_MEMORY_LIMIT = 1.5 * 1024 * 1024 * 1024;

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.6", "localhost"],
  experimental: {
    turbopackMemoryLimit: TURBOPACK_DEV_MEMORY_LIMIT,
    turbopackFileSystemCacheForDev: true,
    turbopackPluginRuntimeStrategy: "childProcesses",
  },
  turbopack: {
    root: projectRoot,
  },
  images: {
    qualities: [75, 90, 100],
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      { pathname: "/brand/**" },
      { pathname: "/avatars/**" },
      { pathname: "/marketing/**" },
      { pathname: "/payments/**" },
      { pathname: "/products/**" },
      { pathname: "/**", search: "" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.dummyjson.com" },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
