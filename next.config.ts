import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    staleTimes: {
      // Reuse dynamic page segments on return navigation; server actions clear stale results.
      dynamic: 300,
    },
  },
  images: {
    qualities: [75, 80, 85],
  },
};

export default nextConfig;
