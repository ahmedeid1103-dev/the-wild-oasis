import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Reuse a route shell instead of prefetching every individual cabin page.
  partialPrefetching: true,
  images: {
    qualities: [75, 80, 85],
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [new URL("/storage/v1/object/public/**", process.env.NEXT_PUBLIC_SUPABASE_URL)]
      : [],
  },
};

export default nextConfig;
