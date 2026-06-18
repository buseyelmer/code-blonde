import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "cdn.bonero.tr",
        pathname: "/bonero/**",
      },
      {
        protocol: "https",
        hostname: "cdn.bonero.tr",
        pathname: "/bonero/**",
      },
    ],
  },
};

export default nextConfig;
