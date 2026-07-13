import type { Metadata } from "next";
import {
  SITE_CONTACT,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOGO,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_SLOGAN,
  absoluteSiteUrl,
  getSiteUrl,
} from "@/core/constant/site.constant";

const siteUrl = getSiteUrl();
const pageUrl = absoluteSiteUrl("/hakkimizda");
const ogImageUrl = absoluteSiteUrl(SITE_OG_IMAGE);
const logoUrl = absoluteSiteUrl(SITE_LOGO);

const aboutDescription = `Code Blonde hakkında bilgi edinin. ${SITE_DESCRIPTION}`;

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: aboutDescription,
  keywords: [...SITE_KEYWORDS, "hakkımızda", "marka hikayesi"],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    title: `Hakkımızda | ${SITE_NAME}`,
    description: aboutDescription,
    url: pageUrl,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_SLOGAN}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Hakkımızda | ${SITE_NAME}`,
    description: aboutDescription,
    images: [ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: `Hakkımızda – ${SITE_NAME}`,
      description: aboutDescription,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
      },
      about: { "@id": `${siteUrl}/#organization` },
      mainEntity: { "@id": `${siteUrl}/#organization` },
      inLanguage: "tr-TR",
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: SITE_NAME,
      legalName: SITE_NAME,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
      image: ogImageUrl,
      description: SITE_DESCRIPTION,
      slogan: SITE_SLOGAN,
      email: SITE_CONTACT.email,
      telephone: SITE_CONTACT.phone,
      sameAs: [SITE_CONTACT.instagram],
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE_CONTACT.locality,
        addressCountry: SITE_CONTACT.country,
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: SITE_CONTACT.email,
          telephone: SITE_CONTACT.phone,
          availableLanguage: ["Turkish", "tr"],
          areaServed: "TR",
        },
      ],
      knowsAbout: [...SITE_KEYWORDS],
    },
  ],
};

export default function HakkimizdaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        id="schema-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {children}
    </>
  );
}
