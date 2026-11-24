import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Keep Turbopack rooted on this package so the parent wayalabs lockfile
  // does not steal resolution when both exist in the monorepo checkout.
  turbopack: {
    root,
  },
};

export default nextConfig;
