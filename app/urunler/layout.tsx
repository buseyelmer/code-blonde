import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "Code Blonde ürün koleksiyonunu keşfedin",
};

export default function UrunlerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
