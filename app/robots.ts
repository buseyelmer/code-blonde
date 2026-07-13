import type { MetadataRoute } from "next";
import { absoluteSiteUrl, getSiteUrl } from "@/core/constant/site.constant";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/hesabim",
          "/hesabim/",
          "/guvenlik/",
          "/sepet/odeme",
          "/theme/",
        ],
      },
    ],
    sitemap: absoluteSiteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
