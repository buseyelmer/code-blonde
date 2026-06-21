import Image from "next/image";
import type { Article, MediaRelated } from "@raxonltd/raxon-core/interface/prisma.interface";
import first from "lodash/first";

export function resolveArticleCoverUrl(article: Article | null | undefined): string | null {
  if (!article) return null;

  const mobileCover = article.mediaRelateds?.find((it: MediaRelated) => it.tag && it.tag.includes("mobile"))
    ?.media?.relativePath;
  const webCover = article.mediaRelateds?.find((it: MediaRelated) => it.tag && it.tag.includes("web"))?.media
    ?.relativePath;
  const defaultCover = mobileCover ?? webCover ?? first(article.mediaRelateds)?.media?.relativePath;

  return defaultCover ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${defaultCover}` : null;
}

type BlogCoverProps = {
  src: string | null | undefined;
  alt: string;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
};

export default function BlogCover({
  src,
  alt,
  sizes = "100vw",
  className = "",
  imageClassName = "object-cover",
  priority,
  loading,
}: BlogCoverProps) {
  if (!src) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br from-[#E8D5C4] via-[#D9C5B0] to-[#C4A484] ${className}`}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={imageClassName}
      priority={priority}
      loading={loading}
    />
  );
}
