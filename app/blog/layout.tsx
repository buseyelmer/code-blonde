import type { Metadata } from "next";
import { getSiteUrl } from "@/core/util/blog";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Blog & Rehber | Code Blonde",
  description:
    "Nude makyaj, cilt bakımı ve kozmetik rehberleri. Code Blonde blog yazılarıyla ton seçimi ve ürün bakımı hakkında bilgi edinin.",
  keywords: ["kozmetik blog", "nude makyaj", "cilt bakımı", "ruj rehberi", "Code Blonde"],
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "Blog & Rehber | Code Blonde",
    description:
      "Nude makyaj, cilt bakımı ve kozmetik rehberleri. Code Blonde blog yazılarını keşfedin.",
    url: `${siteUrl}/blog`,
    type: "website",
    siteName: "Code Blonde",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Rehber | Code Blonde",
    description:
      "Nude makyaj, cilt bakımı ve kozmetik rehberleri. Code Blonde blog yazılarını keşfedin.",
  },
};

function BlogListJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Code Blonde Blog & Rehber",
    description:
      "Nude makyaj, cilt bakımı ve kozmetik rehberleri. Code Blonde blog yazıları.",
    url: `${siteUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Code Blonde",
      url: siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogListJsonLd />
      {children}
    </>
  );
}
