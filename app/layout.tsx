import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GeneralLayout from "@/core/layout/general.layout";
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
        <GeneralLayout>
          <SiteShell>{children}</SiteShell>
        </GeneralLayout>
      </body>
    </html>
  );
}
