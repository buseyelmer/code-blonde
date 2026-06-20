"use client";

import { useState, type ReactNode } from "react";

type ItemProductDetailAccordionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function ItemProductDetailAccordion({
  title,
  children,
  defaultOpen = true,
}: ItemProductDetailAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-stone/60">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between py-5 text-left text-sm font-bold uppercase tracking-[0.12em] text-charcoal"
        aria-expanded={open}
      >
        {title}
        <span className="text-lg leading-none text-muted">{open ? "−" : "+"}</span>
      </button>
      {open ? <div className="pb-5">{children}</div> : null}
    </div>
  );
}
