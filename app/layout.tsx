import React from "react";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { SectionFooter } from "@/theme/section/section.footer";
import { SectionLayoutSiteHeader } from "@/theme/section/section.layout.site.header";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { FavoritesProvider } from "@/lib/context/FavoritesContext";
import { OrdersProvider } from "@/lib/context/OrdersContext";
import { ProviderQuery } from "@/theme/provider/provider.query";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Code Blonde | Doğanın Işıltısı",
    template: "%s | Code Blonde",
  },
  description:
    "Code Blonde vücut peeling ve bakım ürünleri. Sakız, çilek ve mango aromalı peeling serisi ile cildinize iyilik yapın.",
  keywords: [
    "Code Blonde",
    "vücut peeling",
    "cilt bakımı",
    "vücut bakımı",
    "peeling",
  ],
  openGraph: {
    title: "Code Blonde | Doğanın Işıltısı",
    description:
      "Minimalist bakım ritüelleri. Vücut peeling serisi ile cildinize iyilik yapın.",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col overflow-x-hidden bg-cream text-foreground"
        suppressHydrationWarning
      >
        <ProviderQuery>
          <AuthProvider>
            <FavoritesProvider>
              <OrdersProvider>
                <CartProvider>
                  <SectionLayoutSiteHeader />
                  <main className="flex-1 max-w-full overflow-x-hidden">{children}</main>
                  <SectionFooter />
                </CartProvider>
              </OrdersProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ProviderQuery>
      </body>
    </html>
  );
}
