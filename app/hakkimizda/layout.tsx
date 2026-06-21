import type { Metadata } from 'next';
import Script from 'next/script';
import { SITE_SLOGAN } from '@/core/constant/site.constant';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://buluticgiyim.com';

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: `Code Blonde hakkında daha fazla bilgi edinin. ${SITE_SLOGAN}`,
  alternates: {
    canonical: `${siteUrl}/hakkimizda`,
  },
  openGraph: {
    title: 'Hakkımızda | Code Blonde',
    description: SITE_SLOGAN,
    url: `${siteUrl}/hakkimizda`,
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Hakkımızda – Code Blonde',
  url: `${siteUrl}/hakkimizda`,
  description: SITE_SLOGAN,
  mainEntity: {
    '@type': 'Organization',
    name: 'Code Blonde',
    url: siteUrl,
  },
};

export default function HakkimizdaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {children}
    </>
  );
}
