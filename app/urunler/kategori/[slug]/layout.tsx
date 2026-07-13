import type { Metadata } from "next";
import { absoluteSiteUrl } from "@/core/constant/site.constant";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    title: title || "Kategori",
    description: `${title || "Kategori"} ürünlerini Code Blonde mağazasında keşfedin.`,
    alternates: {
      canonical: absoluteSiteUrl(`/urunler/kategori/${slug}`),
    },
  };
}

export default function KategoriLayout({ children }: { children: React.ReactNode }) {
  return children;
}
