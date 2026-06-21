import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://buluticgiyim.com';

export const metadata: Metadata = {
  title: 'Blog & Rehber',
  description:
    'Ton seçimi, ürün bakımı ve nude makyaj ipuçları. Code Blonde blog yazılarıyla daha bilinçli alışveriş yapın.',
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Blog & Rehber | Code Blonde',
    description:
      'Ton seçimi, ürün bakımı ve nude makyaj ipuçları. Code Blonde blog yazılarını keşfedin.',
    url: `${siteUrl}/blog`,
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
