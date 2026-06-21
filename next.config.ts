import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.raxon.tr" },
      { protocol: "https", hostname: "placehold.co" },
    ],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
