"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Facebook, Link2, Share2 } from "lucide-react";

type BlogShareButtonsProps = {
  url: string;
  title: string;
};

export default function BlogShareButtons({ url, title }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const buttonClass =
    "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#D9C5B0] px-4 text-[11px] uppercase tracking-[0.16em] text-[#5C4638] transition hover:border-[#5C4638] hover:bg-[#F5EDE4]";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#A17E65]">
        <Share2 size={14} />
        Paylaş
      </span>
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        WhatsApp
      </a>
      <a href={facebookHref} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        <Facebook size={14} />
        Facebook
      </a>
      <a href={xHref} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        X
      </a>
      <button type="button" onClick={() => void copyLink()} className={buttonClass}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Kopyalandı" : "Linki kopyala"}
        <Link2 size={14} className="opacity-50" />
      </button>
    </div>
  );
}
