import type { Metadata } from 'next';
import Script from 'next/script';
import { DEFAULT_FAQS } from '@/core/constant/faq.constant';
import { absoluteSiteUrl } from '@/core/constant/site.constant';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description:
    'Code Blonde hakkında merak ettiğiniz tüm soruların yanıtları. Kargo, iade, ödeme ve daha fazlası hakkında bilgi alın.',
  alternates: {
    canonical: absoluteSiteUrl('/sss'),
  },
  openGraph: {
    title: 'Sıkça Sorulan Sorular | Code Blonde',
    description:
      'Code Blonde hakkında merak ettiğiniz tüm soruların yanıtları. Kargo, iade ve ödeme bilgileri.',
    url: absoluteSiteUrl('/sss'),
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: 'Sıkça Sorulan Sorular – Code Blonde',
  url: absoluteSiteUrl('/sss'),
  mainEntity: DEFAULT_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function SssLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
