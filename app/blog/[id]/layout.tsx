import type { Metadata } from "next";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/core/constant/blog.constant";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buluticgiyim.com";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ id: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = getBlogPostBySlug(id);

  if (!post) {
    return { title: "Blog Yazısı | Code Blonde" };
  }

  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.metaKeywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: post.coverUrl, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.coverUrl],
    },
  };
}

function BlogJsonLd({ slug }: { slug: string }) {
  const post = getBlogPostBySlug(slug);
  if (!post) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: post.coverUrl,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Code Blonde",
    },
    publisher: {
      "@type": "Organization",
      name: "Code Blonde",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    keywords: post.metaKeywords.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function BlogDetailLayout({ params, children }: Props) {
  const { id } = await params;

  return (
    <>
      <BlogJsonLd slug={id} />
      {children}
    </>
  );
}
