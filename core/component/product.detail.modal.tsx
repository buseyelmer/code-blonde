"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Minus, Plus, Star, X } from "lucide-react";
import type { Product, Shade } from "@/core/constant/home.constant";
import ProductVisual from "@/core/component/product.visual";

interface ProductDetailModalProps {
  product: Product;
  currentShade: Shade;
  selectedShadeIndex: number;
  onShadeSelect: (index: number) => void;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
  onBuyNow?: (quantity: number) => void;
  isAdded: boolean;
}

function getMainIngredient(product: Product): string {
  if (product.category === "Bakım") return "Shea yağı, argan, vitamin E";
  if (product.category === "Ruj") return "Doğal pigmentler, nemlendirici balm";
  if (product.category === "Fondöten") return "Hafif mineral pigment, SPF 15";
  return "Vegan formül, paraben içermez";
}

function getUsageHint(product: Product): string {
  const hints: Record<string, string> = {
    Ruj: "Dudaklara doğrudan veya fırça ile eşit şekilde uygulayın.",
    Fondöten: "Temiz cilde parmak uçları veya süngerle ince bir tabaka halinde yayın.",
    Allık: "Elmacık kemiklerine hafifçe dokundurarak doğal bir flush elde edin.",
    "Göz Farı": "Göz kapağına parmak veya fırça ile katmanlayarak uygulayın.",
    Highlighter: "Yüzün en yüksek noktalarına hafif dokunuşlarla yerleştirin.",
    Bakım: "İhtiyaç duydukça veya makyaj öncesi ince bir tabaka sürün.",
  };
  return hints[product.category] ?? "Günlük rutininize nazikçe entegre edin.";
}

function AccordionItem({
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
        className="flex w-full items-center justify-between gap-4 py-3 text-left transition hover:text-[#A17E65]"
        aria-expanded={open}
      >
        <span className="text-[10px] tracking-[0.32em] uppercase text-[#A17E65]">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#8B6B57] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>
      {open && <div className="-mt-0.5 pb-3 text-sm leading-snug text-[#8B6B57]">{children}</div>}
    </div>
  );
}

export default function ProductDetailModal({
  product,
  currentShade,
  selectedShadeIndex,
  onShadeSelect,
  onClose,
  onAddToCart,
  onBuyNow,
  isAdded,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  const formattedPrice = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(product.price);

  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQuantity = () => setQuantity((q) => Math.min(10, q + 1));

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(quantity);
      return;
    }
    onAddToCart(quantity);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[#5C4638]/60 p-0 sm:items-center sm:p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <div
        className="relative flex h-[96dvh] w-full max-w-5xl flex-col overflow-hidden bg-[#F8F1E9] shadow-2xl sm:h-[92dvh] md:h-[88dvh] md:grid md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center border border-[#D9C5B0]/80 bg-[#F8F1E9]/95 text-[#5C4638] transition hover:border-[#5C4638]"
          aria-label="Kapat"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div
          className="relative flex h-[36dvh] shrink-0 items-center justify-center md:h-full"
          style={{ background: "linear-gradient(165deg, #F8F1E9 0%, #F5EDE4 45%, #EDE0D1 100%)" }}
        >
          <div className="scale-[1.2] sm:scale-[1.4] md:scale-[1.65]">
            <ProductVisual shadeHex={currentShade.hex} volume={product.volume} />
          </div>
          {product.badge && (
            <span className="absolute left-5 top-5 border border-[#5C4638] bg-[#5C4638] px-3 py-1 text-[10px] tracking-[0.25em] uppercase text-[#F8F1E9]">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col border-t border-[#D9C5B0]/50 md:border-l md:border-t-0">
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#A17E65]">{product.category}</p>
            <h2
              id="product-detail-title"
              className="mt-1.5 font-serif text-3xl font-light leading-tight tracking-tight text-[#5C4638] sm:text-[2.1rem]"
            >
              {product.name}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="font-serif text-2xl tabular-nums text-[#A17E65]">{formattedPrice}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#A17E65] text-[#A17E65]" strokeWidth={0} />
                ))}
                <span className="ml-1 text-xs text-[#8B6B57]">4.9</span>
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {["100% Vegan", "Cruelty Free"].map((badge) => (
                <span
                  key={badge}
                  className="border border-[#D9C5B0] px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase text-[#8B6B57]"
                >
                  {badge}
                </span>
              ))}
            </div>

            <p className="mt-4 text-[14px] leading-[1.55] text-[#8B6B57]">{product.description}</p>

            <div className="mt-5 space-y-2.5 border-t border-[#D9C5B0]/50 pt-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] tracking-[0.32em] uppercase text-[#A17E65]">Ton Seçimi</p>
                <p className="text-xs tracking-[0.12em] text-[#5C4638]">{currentShade.name}</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.shades.map((shade, index) => (
                  <button
                    key={shade.name}
                    type="button"
                    onClick={() => onShadeSelect(index)}
                    className={`h-9 w-9 rounded-full border-2 transition-all ${
                      selectedShadeIndex === index
                        ? "border-[#5C4638] scale-110 ring-2 ring-[#5C4638]/15 ring-offset-2 ring-offset-[#F8F1E9]"
                        : "border-white/90 hover:scale-105 hover:border-[#A17E65]"
                    }`}
                    style={{ backgroundColor: shade.hex }}
                    title={shade.name}
                    aria-label={shade.name}
                    aria-pressed={selectedShadeIndex === index}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <AccordionItem title="Ana İçerik" defaultOpen>
                <div className="space-y-2">
                  <p>{getMainIngredient(product)}</p>
                  <p className="text-[#5C4638]">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#A17E65]">Hacim / Gramaj · </span>
                    {product.volume}
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem title="İçerik">
                <p>{product.details}</p>
              </AccordionItem>
              <AccordionItem title="Kullanım">
                <p>{getUsageHint(product)}</p>
              </AccordionItem>
            </div>
          </div>

          <div className="shrink-0 border-t border-[#D9C5B0]/60 bg-[#F8F1E9]/95 px-5 py-3.5 backdrop-blur-sm sm:px-7 lg:px-8">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-[10px] tracking-[0.32em] uppercase text-[#A17E65]">Adet</p>
              <div className="inline-flex items-center border border-[#D9C5B0] bg-white/50">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center text-[#5C4638] transition hover:bg-[#F5EDE4] disabled:opacity-40"
                  aria-label="Adedi azalt"
                >
                  <Minus className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <span className="min-w-[2.75rem] border-x border-[#D9C5B0] px-2.5 text-center text-sm font-medium tabular-nums text-[#5C4638]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= 10}
                  className="flex h-10 w-10 items-center justify-center text-[#5C4638] transition hover:bg-[#F5EDE4] disabled:opacity-40"
                  aria-label="Adedi artır"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => onAddToCart(quantity)}
                className={`flex-1 py-3.5 text-[11px] tracking-[0.26em] uppercase transition ${
                  isAdded
                    ? "bg-[#A17E65] text-white"
                    : "bg-[#5C4638] text-[#F8F1E9] hover:bg-[#3F2F25]"
                }`}
              >
                {isAdded ? "Sepete Eklendi" : "Sepete Ekle"}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 border border-[#5C4638] bg-transparent py-3.5 text-[11px] tracking-[0.22em] uppercase text-[#5C4638] transition hover:bg-[#F5EDE4]"
              >
                Hemen Al
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
