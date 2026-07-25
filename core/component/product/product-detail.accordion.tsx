"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function ProductDetailAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-[#D9C5B0]/50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="group flex w-full items-center justify-between gap-4 py-4 text-left transition hover:text-[#A17E65]"
        aria-expanded={open}
      >
        <span className="text-[10px] tracking-[0.32em] uppercase text-[#A17E65]">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#8B6B57] transition-transform duration-200 group-hover:text-[#A17E65] ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>
      {open && <div className="-mt-1 pb-4 text-sm leading-relaxed text-[#8B6B57]">{children}</div>}
    </div>
  );
}
