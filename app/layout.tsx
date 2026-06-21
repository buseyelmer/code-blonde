import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GeneralLayout from "@/core/layout/general.layout";
import SiteHeader from "@/core/layout/site.header";
import SiteShell from "@/core/layout/site.shell";
import { SITE_SLOGAN } from "@/core/constant/site.constant";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Code Blonde",
    template: "%s | Code Blonde",
  },
  description: SITE_SLOGAN,
  icons: {
    icon: [{ url: "/code-blonde-icon.svg", type: "image/svg+xml" }],
    apple: "/code-blonde-icon.svg",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='tr' className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col'>
        <Suspense
          fallback={
            <div className="flex min-h-screen flex-col bg-[#F8F1E9]">
              <div className="h-[8rem] border-b border-[#D9C5B0]/30 lg:h-[9.25rem]" />
              <main className="flex-1 pt-[8rem] lg:pt-[9.25rem]" />
            </div>
          }
        >
          <GeneralLayout>
            <SiteHeader />
            <SiteShell>{children}</SiteShell>
          </GeneralLayout>
        </Suspense>
      </body>
    </html>
  );
}
