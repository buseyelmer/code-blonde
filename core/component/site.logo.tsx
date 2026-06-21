"use client";

import { useRaxon } from "@raxonltd/raxon-core";
import Image from "next/image";

type SiteLogoProps = {
  className?: string;
  priority?: boolean;
  variant?: "default" | "onDark";
};

export default function SiteLogo({
  className = "relative h-10 w-32",
  priority = false,
  variant = "default",
}: SiteLogoProps) {
  const { branch } = useRaxon();
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL?.replace(/\/$/, "");
  const logoPath = branch?.logoMedia?.relativePath;
  const logoUrl = storageUrl && logoPath ? `${storageUrl}/${logoPath}` : null;

  const imageClassName =
    variant === "onDark"
      ? "object-contain object-left brightness-0 invert opacity-90"
      : "object-contain object-left";

  return (
    <div className={className}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt="Code Blonde"
          fill
          className={imageClassName}
          priority={priority}
        />
      ) : (
        <Image
          src="/code-blonde-logo.svg"
          alt="Code Blonde"
          fill
          className={imageClassName}
          priority={priority}
        />
      )}
    </div>
  );
}
