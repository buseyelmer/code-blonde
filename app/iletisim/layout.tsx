import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codeblonde.com';

export const metadata: Metadata = {
  title: 'İletişim',
  description:
    'Code Blonde ile iletişime geçin. Sorularınız, önerileriniz ve destek talepleriniz için bize ulaşın.',
  alternates: {
    canonical: `${siteUrl}/iletisim`,
  },
  openGraph: {
    title: 'İletişim | Code Blonde',
    description:
      'Code Blonde ile iletişime geçin. Sorularınız, önerileriniz ve destek talepleriniz için bize ulaşın.',
    url: `${siteUrl}/iletisim`,
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'İletişim – Code Blonde',
  url: `${siteUrl}/iletisim`,
  description: 'Code Blonde iletişim sayfası. Sorularınız için bize ulaşın.',
  mainEntity: {
    '@type': 'Store',
    name: 'Code Blonde',
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
