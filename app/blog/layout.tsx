import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://buluticgiyim.com';

export const metadata: Metadata = {
  title: 'Blog & Rehber',
  description:
    'Ürün bakımı, moda trendleri ve alışveriş rehberi. Bulut İç Giyim blog yazılarıyla daha bilinçli alışveriş yapın.',
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Blog & Rehber | Bulut İç Giyim',
    description:
      'Ürün bakımı, moda trendleri ve alışveriş rehberi. Bulut İç Giyim blog yazılarını keşfedin.',
    url: `${siteUrl}/blog`,
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
