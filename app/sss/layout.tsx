import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://buluticgiyim.com';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description:
    'Code Blonde hakkında merak ettiğiniz tüm soruların yanıtları. Kargo, iade, ödeme ve daha fazlası hakkında bilgi alın.',
  alternates: {
    canonical: `${siteUrl}/sss`,
  },
  openGraph: {
    title: 'Sıkça Sorulan Sorular | Code Blonde',
    description:
      'Code Blonde hakkında merak ettiğiniz tüm soruların yanıtları. Kargo, iade ve ödeme bilgileri.',
    url: `${siteUrl}/sss`,
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: 'Sıkça Sorulan Sorular – Code Blonde',
  url: `${siteUrl}/sss`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Kargo süresi ne kadar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Siparişleriniz genellikle 1-3 iş günü içinde kargoya verilmektedir.',
      },
    },
    {
      '@type': 'Question',
      name: 'İade koşulları nelerdir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ürünü teslim aldıktan sonra 30 gün içinde koşulsuz iade hakkınız bulunmaktadır.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ödeme yöntemleri nelerdir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz.',
      },
    },
  ],
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
