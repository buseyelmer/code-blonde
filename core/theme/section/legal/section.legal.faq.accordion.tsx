"use client";

import { useState } from "react";

export type SectionLegalFaqItem = {
  id: string;
  question: string;
  answer: string;
};

type SectionLegalFaqAccordionProps = {
  items: SectionLegalFaqItem[];
};

export function SectionLegalFaqAccordion({ items }: SectionLegalFaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-stone/60 rounded-2xl border border-stone/70 bg-white">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-powder/40 sm:px-6 sm:py-5"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-charcoal sm:text-base">
                {item.question}
              </span>
              <span
                className={`shrink-0 text-lg text-gold transition-transform ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-stone/40 bg-cream/50 px-5 py-4 sm:px-6 sm:py-5">
                <p className="text-sm leading-relaxed text-muted sm:text-base">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
