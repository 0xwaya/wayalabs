import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prototype uses mutable in-memory orchestrator state — keep caching off.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
