import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Preserve the existing Cache Components prefetch behavior during upgrade.
  partialPrefetching: false,
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
