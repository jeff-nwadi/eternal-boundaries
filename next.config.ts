import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Turbopack ignores stray
  // lockfiles in parent directories.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
