import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://buluticgiyim.com';

export const metadata: Metadata = {
  title: 'Koleksiyonlar',
  description:
    "Bulut İç Giyim'in özel koleksiyonlarını keşfedin. Her sezon yeni ve taze tasarımlarla gardırobunuzu tamamlayın.",
  alternates: {
    canonical: `${siteUrl}/koleksiyon`,
  },
  openGraph: {
    title: 'Koleksiyonlar | Bulut İç Giyim',
    description:
      "Bulut İç Giyim'in özel koleksiyonlarını keşfedin. Her sezon yeni tasarımlar.",
    url: `${siteUrl}/koleksiyon`,
  },
};

export default function KoleksiyonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
