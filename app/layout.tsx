import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import GeneralLayout from "@/core/layout/general.layout";
import SiteChrome from "@/core/layout/site.chrome";
import MetaPixel from "@/core/component/meta.pixel";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_SLOGAN,
  getSiteUrl,
} from "@/core/constant/site.constant";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: "/code-blonde-icon.svg", type: "image/svg+xml" }],
    apple: "/code-blonde-icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_SLOGAN}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className='min-h-full flex flex-col'>
        <MetaPixel />
        <Suspense
          fallback={
            <div className="flex min-h-screen flex-col bg-[#F8F1E9]">
              <div className="h-[8rem] border-b border-[#D9C5B0]/30 lg:h-[9.25rem]" />
              <main className="flex-1 pt-[8rem] lg:pt-[9.25rem]" />
            </div>
          }
        >
          <GeneralLayout>
            <SiteChrome>{children}</SiteChrome>
          </GeneralLayout>
        </Suspense>
      </body>
    </html>
  );
}
