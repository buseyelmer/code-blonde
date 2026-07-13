import type { Metadata } from "next";
import { Status, type Article } from "@raxonltd/raxon-core/interface/prisma.interface";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/core/constant/blog.constant";
import { getSiteUrl, isArticleCurrentlyVisible, resolveAuthorName } from "@/core/util/blog";
import { resolveArticleCoverUrl } from "@/core/component/blog.cover";

const siteUrl = getSiteUrl();

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (!apiUrl || !apiKey || !slug) return null;

  try {
    const response = await fetch(`${apiUrl}/customer/article/${encodeURIComponent(slug)}`, {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 120 },
    });
    if (!response.ok) return null;
    const json = await response.json();
    const article = (json?.data ?? json) as Article | null;
    if (!article || typeof article !== "object" || !("id" in article)) return null;
    return article;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ id: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const local = getBlogPostBySlug(id);

  if (local) {
    const url = `${siteUrl}/blog/${local.slug}`;
    return {
      title: local.metaTitle,
      description: local.metaDescription,
      keywords: local.metaKeywords,
      alternates: { canonical: url },
      openGraph: {
        title: local.metaTitle,
        description: local.metaDescription,
        url,
        type: "article",
        publishedTime: local.publishedAt,
        images: [{ url: local.coverUrl, alt: local.title }],
        siteName: "Code Blonde",
      },
      twitter: {
        card: "summary_large_image",
        title: local.metaTitle,
        description: local.metaDescription,
        images: [local.coverUrl],
      },
    };
  }

  const article = await fetchArticleBySlug(id);
  if (!article) {
    return { title: "Blog Yazısı | Code Blonde" };
  }

  const slug = article.slug ?? article.id;
  const url = `${siteUrl}/blog/${slug}`;
  const title = article.metaTitle || article.title || "Blog Yazısı | Code Blonde";
  const description =
    article.metaDescription ||
    article.shortDescription ||
    "Code Blonde blog yazısı";
  const cover = resolveArticleCoverUrl(article);

  return {
    title,
    description,
    keywords: article.metaKeywords?.length ? article.metaKeywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.createdAt,
      images: cover ? [{ url: cover, alt: article.title ?? "Blog" }] : undefined,
      siteName: "Code Blonde",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: cover ? [cover] : undefined,
    },
  };
}

function BlogJsonLd({
  slug,
  article,
}: {
  slug: string;
  article: Article | null;
}) {
  const local = getBlogPostBySlug(slug);

  if (local) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: local.title,
      description: local.metaDescription,
      image: local.coverUrl,
      datePublished: local.publishedAt,
      author: {
        "@type": "Organization",
        name: local.authorName ?? "Code Blonde",
      },
      publisher: {
        "@type": "Organization",
        name: "Code Blonde",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteUrl}/blog/${local.slug}`,
      },
      keywords: local.metaKeywords.join(", "),
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    );
  }

  if (!article) return null;
  if (!isArticleCurrentlyVisible(article.status ?? Status.DRAFT, article.startDate, article.endDate)) {
    return null;
  }

  const cover = resolveArticleCoverUrl(article);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title ?? "Blog Yazısı",
    description: article.metaDescription || article.shortDescription || undefined,
    image: cover || undefined,
    datePublished: article.createdAt,
    author: {
      "@type": "Person",
      name: resolveAuthorName(article),
    },
    publisher: {
      "@type": "Organization",
      name: "Code Blonde",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${article.slug ?? article.id}`,
    },
    keywords: article.metaKeywords?.join(", ") || undefined,
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
  const local = getBlogPostBySlug(id);
  const article = local ? null : await fetchArticleBySlug(id);

  return (
    <>
      <BlogJsonLd slug={id} article={article} />
      {children}
    </>
  );
}
