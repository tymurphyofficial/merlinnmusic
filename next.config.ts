import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    middlewareClientMaxBodySize: "50mb",
  },
};

export default nextConfig;
