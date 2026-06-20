import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://buluticgiyim.com';

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description:
    '2010 yılından bu yana kadın giyiminde öncü olan Bulut İç Giyim hakkında daha fazla bilgi edinin. Misyon, vizyon ve değerlerimizi keşfedin.',
  alternates: {
    canonical: `${siteUrl}/hakkimizda`,
  },
  openGraph: {
    title: 'Hakkımızda | Bulut İç Giyim',
    description:
      '2010 yılından bu yana kadın giyiminde öncü olan Bulut İç Giyim hakkında daha fazla bilgi edinin.',
    url: `${siteUrl}/hakkimizda`,
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Hakkımızda – Bulut İç Giyim',
  url: `${siteUrl}/hakkimizda`,
  description:
    '2010 yılında kurulan Bulut İç Giyim, İstanbul merkezli bir kadın giyim markasıdır. Kalite, konfor ve stil odaklı koleksiyonlarıyla öne çıkmaktadır.',
  mainEntity: {
    '@type': 'ClothingStore',
    name: 'Bulut İç Giyim',
    url: siteUrl,
    foundingDate: '2010',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'İstanbul',
      addressCountry: 'TR',
    },
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 10,
    },
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
