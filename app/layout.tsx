import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { FavoritesProvider } from "@/lib/context/FavoritesContext";
import { OrdersProvider } from "@/lib/context/OrdersContext";
import { QueryProvider } from "@/components/providers/QueryProvider";
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
        <QueryProvider>
          <AuthProvider>
            <FavoritesProvider>
              <OrdersProvider>
                <CartProvider>
                  <SiteHeader />
                  <main className="flex-1 max-w-full overflow-x-hidden">{children}</main>
                  <Footer />
                </CartProvider>
              </OrdersProvider>
            </FavoritesProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
