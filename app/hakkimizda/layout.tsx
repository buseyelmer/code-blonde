import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://buluticgiyim.com';

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description:
    'Code Blonde hakkında daha fazla bilgi edinin. Nude tonlarda premium kozmetik markamızın hikayesi, değerleri ve vizyonu.',
  alternates: {
    canonical: `${siteUrl}/hakkimizda`,
  },
  openGraph: {
    title: 'Hakkımızda | Code Blonde',
    description:
      'Code Blonde — doğal güzelliğin kodu. Nude tonlarda premium kozmetik deneyimi.',
    url: `${siteUrl}/hakkimizda`,
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Hakkımızda – Code Blonde',
  url: `${siteUrl}/hakkimizda`,
  description:
    'Code Blonde, nude tonlarda premium kozmetik sunan bir güzellik markasıdır.',
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
