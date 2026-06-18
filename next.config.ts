import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
