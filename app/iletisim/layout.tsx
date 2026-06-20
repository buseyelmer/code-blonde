import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://buluticgiyim.com';

export const metadata: Metadata = {
  title: 'İletişim',
  description:
    'Bulut İç Giyim ile iletişime geçin. Sorularınız, önerileriniz ve destek talepleriniz için bize ulaşın.',
  alternates: {
    canonical: `${siteUrl}/iletisim`,
  },
  openGraph: {
    title: 'İletişim | Bulut İç Giyim',
    description:
      'Bulut İç Giyim ile iletişime geçin. Sorularınız, önerileriniz ve destek talepleriniz için bize ulaşın.',
    url: `${siteUrl}/iletisim`,
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'İletişim – Bulut İç Giyim',
  url: `${siteUrl}/iletisim`,
  description: 'Bulut İç Giyim iletişim sayfası. Sorularınız için bize ulaşın.',
  mainEntity: {
    '@type': 'ClothingStore',
    name: 'Bulut İç Giyim',
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'İstanbul',
      addressCountry: 'TR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Turkish',
    },
  },
};

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}
