import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://buluticgiyim.com';

export const metadata: Metadata = {
  title: 'Blog & Rehber | Code Blonde',
  description:
    'Nude makyaj, cilt bakımı ve kozmetik rehberleri. Code Blonde blog yazılarıyla ton seçimi ve ürün bakımı hakkında bilgi edinin.',
  keywords: ['kozmetik blog', 'nude makyaj', 'cilt bakımı', 'ruj rehberi', 'Code Blonde'],
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Blog & Rehber | Code Blonde',
    description:
      'Nude makyaj, cilt bakımı ve kozmetik rehberleri. Code Blonde blog yazılarını keşfedin.',
    url: `${siteUrl}/blog`,
    type: 'website',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
