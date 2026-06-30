import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray lockfile in a parent directory
  // doesn't get auto-selected (silences the multiple-lockfiles warning).
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
