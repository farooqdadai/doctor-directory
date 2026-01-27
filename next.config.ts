import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Handle native modules (better-sqlite3)
  serverExternalPackages: ['better-sqlite3'],

  // Empty turbopack config to enable turbopack (default in Next 16)
  turbopack: {},
};

export default nextConfig;
