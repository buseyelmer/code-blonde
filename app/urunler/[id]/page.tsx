"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import type { Product, ProductDetail } from "@raxonltd/raxon-core/interface/product.interface";
import ItemListingProduct from "@/core/theme/item/item.listing.product";
import { getProductPriceInfo, mergeProductListPrice } from "@/core/util/product.price";
import { useProductCart } from "@/core/hook/use.product.cart";
import { containsHtmlMarkup, isSameProductText } from "@/core/util/product.html";
import { getDefaultProductUnitId } from "@/core/util/cart.insert";
import { useProductFavorite } from "@/core/hook/use.product.favorite";
import { buildStorageImageUrl } from "@/core/util/basket.enrichment";
import { getProductListingImageUrl } from "@/core/util/product.image";
import "@/core/util/util";

function resolveImageUrl(relativePath?: string | null): string {
  if (!relativePath?.trim()) {
    return "https://placehold.co/800x1000/F5EDE4/8B6B57?text=Code+Blonde";
  }
  if (/^https?:\/\//i.test(relativePath)) return relativePath;
  return buildStorageImageUrl(relativePath) ?? "https://placehold.co/800x1000/F5EDE4/8B6B57?text=Code+Blonde";
}

const TRUST_BADGES = ["100% Vegan", "Cruelty Free", "Parabensiz"];

const PRODUCT_HTML_CLASS =
  "prose prose-sm max-w-none text-[#8B6B57] prose-headings:font-serif prose-headings:text-[#5C4638] prose-p:my-2 prose-p:leading-relaxed prose-strong:text-[#5C4638] prose-ul:my-2 prose-li:my-0.5";

function ProductHtmlContent({ html, className = "" }: { html: string; className?: string }) {
  return (
    <div
      className={`${PRODUCT_HTML_CLASS} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function resolveCategoryName(name: unknown) {
  if (Array.isArray(name)) return name.getName();
  if (typeof name === "string") return name;
  return "";
}

function getUniqueOptions(
  product: Product,
  optionKey: "attributeOption1" | "attributeOption2",
) {
  const seen = new Set<string>();
  return (
    product.variant
      ?.map((v) => v[optionKey])
      .filter((opt) => {
        if (!opt?.id || seen.has(opt.id)) return false;
        seen.add(opt.id);
        return true;
      }) ?? []
  );
}

function isVariantAvailable(product: Product, option1Id?: string, option2Id?: string) {
  return product.variant?.some((v) => {
    const match1 = !option1Id || v.attributeOption1?.id === option1Id;
    const match2 = !option2Id || v.attributeOption2?.id === option2Id;
    return match1 && match2 && v.stock > 0;
  });
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
        className="flex w-full items-center justify-between gap-4 py-4 text-left transition hover:text-[#A17E65]"
        aria-expanded={open}
      >
        <span className="text-[10px] tracking-[0.32em] uppercase text-[#A17E65]">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#8B6B57] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>
      {open && <div className="-mt-1 pb-4 text-sm leading-relaxed text-[#8B6B57]">{children}</div>}
    </div>
  );
}

export default function UrunlerDetayPage() {
  const params = useParams();
  const productId = typeof params.id === "string" ? params.id : "";

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useProduct().detail(productId);
  const { data: relatedProducts } = useProduct().related(productId);
  const { cart, addProduct, setProductQuantity, removeItem, isCartBusy } = useProductCart();

  const needsListPrice = Boolean(product && getProductPriceInfo(product).bestPrice === 0);
  const { data: listFallback } = useProduct().fetch({
    materialType: "product",
    status: Status.PUBLISHED,
    page: 1,
    amount: 120,
    enabled: needsListPrice,
  });

  const enrichedProduct = useMemo((): ProductDetail | null => {
    if (!product) return null;
    const listMatch = listFallback?.data?.find((item) => item.id === product.id);
    return mergeProductListPrice(product, listMatch) as ProductDetail;
  }, [product, listFallback?.data]);

  const { isFavorite, toggle, isPending: isTogglingFavorite } = useProductFavorite(
    productId,
    enrichedProduct?.isFavorite ?? false,
  );

  useEffect(() => {
    setSelectedVariantId(null);
    setActiveImageIndex(0);
    setQuantity(1);
  }, [productId]);

  useEffect(() => {
    if (!enrichedProduct?.variant?.length || selectedVariantId) return;
    const defaultVariant =
      enrichedProduct.variant.find((v) => v.stock > 0) ?? enrichedProduct.variant[0];
    if (defaultVariant) setSelectedVariantId(defaultVariant.id);
  }, [enrichedProduct, selectedVariantId]);

  const selectedVariant = useMemo(() => {
    if (!selectedVariantId || !enrichedProduct?.variant) return null;
    return enrichedProduct.variant.find((v) => v.id === selectedVariantId) ?? null;
  }, [enrichedProduct?.variant, selectedVariantId]);

  const displayImages = useMemo(() => {
    if (!enrichedProduct?.images?.length) return [];
    if (selectedVariantId) {
      const filtered = enrichedProduct.images.filter((img) =>
        img.variantIds?.includes(selectedVariantId),
      );
      if (filtered.length > 0) return filtered;
    }
    return enrichedProduct.images;
  }, [enrichedProduct?.images, selectedVariantId]);

  const activeImage = displayImages[activeImageIndex] ?? displayImages[0];
  const imageUrl = activeImage?.relativePath
    ? resolveImageUrl(activeImage.relativePath)
    : getProductListingImageUrl(enrichedProduct ?? ({} as Product));

  const { price, bestPrice, hasDiscount, stock } = useMemo(
    () => getProductPriceInfo(enrichedProduct ?? ({} as Product), selectedVariantId),
    [enrichedProduct, selectedVariantId],
  );

  const cartItem = useMemo(() => {
    if (!enrichedProduct?.id) return undefined;
    return cart?.items?.find((item) => {
      if (item.productId !== enrichedProduct.id) return false;
      if (selectedVariantId) return item.variant?.id === selectedVariantId;
      return !item.variant?.id;
    });
  }, [cart?.items, enrichedProduct?.id, selectedVariantId]);

  const cartQuantity = cartItem?.quantity ?? 0;
  const isInCart = cartQuantity > 0;
  const maxQuantity = stock > 0 ? stock : 10;

  const hasVariants = Boolean(enrichedProduct?.variant?.length);
  const option1List = hasVariants ? getUniqueOptions(enrichedProduct!, "attributeOption1") : [];
  const option2List = hasVariants ? getUniqueOptions(enrichedProduct!, "attributeOption2") : [];

  const canAddToCart = Boolean(enrichedProduct?.id && bestPrice > 0 && (!hasVariants || selectedVariantId));

  const selectVariant = (optionId: string) => {
    const currentVariant = selectedVariant;
    const matchingVariant = enrichedProduct?.variant?.find((v) => {
      return (
        (v.attributeOption1?.id === optionId || v.attributeOption2?.id === optionId) &&
        (currentVariant
          ? v.attributeOption1?.id === currentVariant.attributeOption1?.id ||
            v.attributeOption2?.id === currentVariant.attributeOption2?.id ||
            v.attributeOption1?.id === optionId ||
            v.attributeOption2?.id === optionId
          : true)
      );
    });
    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
      setActiveImageIndex(0);
    }
  };

  const handleAddToCart = () => {
    if (!enrichedProduct?.id || !canAddToCart || isCartBusy) return;
    const productUnitId = !selectedVariantId ? getDefaultProductUnitId(enrichedProduct) : null;
    void addProduct(enrichedProduct, quantity, {
      variantId: selectedVariantId,
      productUnitId,
      linePay: bestPrice * quantity,
    });
  };

  const handleQuantityChange = (delta: number) => {
    if (!enrichedProduct?.id || isCartBusy || !cartItem) return;
    const newQty = cartQuantity + delta;

    if (newQty < 1) {
      removeItem(cartItem.id);
      return;
    }
    if (newQty > maxQuantity) return;

    const productUnitId = !selectedVariantId ? getDefaultProductUnitId(enrichedProduct) : null;
    void setProductQuantity(enrichedProduct, cartItem, newQty, {
      variantId: selectedVariantId,
      productUnitId,
    });
  };

  if (!productId) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 text-center text-sm text-[#8B6B57]">
        Geçersiz ürün adresi.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F1E9]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
      </div>
    );
  }

  if (isError || !enrichedProduct) {
    return (
      <div className="min-h-[60vh] bg-[#F8F1E9] px-6 py-20 text-center">
        <p className="font-serif text-xl text-[#5C4638]">Ürün bulunamadı</p>
        <p className="mt-3 text-sm text-[#8B6B57]">Aradığınız ürün kaldırılmış veya yayından çıkarılmış olabilir.</p>
        <Link
          href="/urunler"
          className="mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#5C4638] transition hover:text-[#A17E65]"
        >
          Ürünlere dön <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  const productTitle = enrichedProduct.name;
  const shortDescription = enrichedProduct.shortDescription?.trim() ?? "";
  const fullDescription = enrichedProduct.description?.trim() ?? "";
  const richContent = enrichedProduct.richContent?.trim() ?? "";
  const descriptionsDiffer = Boolean(
    shortDescription && fullDescription && !isSameProductText(fullDescription, shortDescription),
  );
  const heroDescription = shortDescription || (fullDescription && !descriptionsDiffer ? fullDescription : "");
  const showDescriptionAccordion = descriptionsDiffer;
  const showRichContentAccordion = Boolean(
    richContent &&
      !isSameProductText(richContent, fullDescription) &&
      !isSameProductText(richContent, shortDescription),
  );
  const categoryName = resolveCategoryName(enrichedProduct.categories?.[0]?.name);

  return (
    <div className="min-h-screen bg-[#F8F1E9]">
      <header className="border-b border-[#D9C5B0]/40 bg-[#F8F1E9]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-[#8B6B57]">
            <Link href="/" className="transition hover:text-[#5C4638]">
              Ana Sayfa
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#D9C5B0]" strokeWidth={1.5} />
            <Link href="/urunler" className="transition hover:text-[#5C4638]">
              Ürünler
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#D9C5B0]" strokeWidth={1.5} />
            <span className="line-clamp-1 text-[#5C4638]">{productTitle}</span>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-16 xl:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden border border-[#D9C5B0]/40 bg-[#FDFAF6] shadow-[0_4px_24px_-8px_rgba(92,70,56,0.12)]">
              <div className="flex items-center justify-center bg-[#F5EDE4]/70 p-4 sm:p-6">
                <Image
                  src={imageUrl}
                  alt={productTitle}
                  width={1200}
                  height={1200}
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="mx-auto block h-auto w-full max-h-[min(72vh,680px)] object-contain object-center"
                />
              </div>
            </div>

            {displayImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {displayImages.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative h-20 w-16 shrink-0 overflow-hidden border-2 bg-[#F5EDE4]/60 transition ${
                      index === activeImageIndex
                        ? "border-[#5C4638]"
                        : "border-transparent opacity-70 hover:border-[#D9C5B0] hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={resolveImageUrl(img.relativePath)}
                      alt=""
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {categoryName && (
              <p className="text-[10px] tracking-[0.38em] uppercase text-[#A17E65]">{categoryName}</p>
            )}

            <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-[#5C4638] sm:text-4xl lg:text-[2.65rem]">
              {productTitle}
            </h1>

            {enrichedProduct.review?.count > 0 && (
              <div className="mt-4 flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(enrichedProduct.review?.rating || 0)
                        ? "fill-[#A17E65] text-[#A17E65]"
                        : "text-[#D9C5B0]"
                    }`}
                    strokeWidth={0}
                  />
                ))}
                <span className="ml-1 text-xs text-[#8B6B57]">
                  {enrichedProduct.review.rating.toFixed(1)} · {enrichedProduct.review.count} değerlendirme
                </span>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {TRUST_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="border border-[#D9C5B0]/70 px-3 py-1 text-[9px] tracking-[0.22em] uppercase text-[#8B6B57]"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-end gap-3 border-y border-[#D9C5B0]/40 py-6">
              {bestPrice > 0 ? (
                <>
                  <span className="font-mono text-3xl tabular-nums tracking-tight text-[#5C4638]">
                    {bestPrice.toTry()}
                  </span>
                  {hasDiscount && (
                    <span className="font-mono text-base tabular-nums text-[#8B6B57]/50 line-through">
                      {price.toTry()}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm tracking-wide text-[#8B6B57]/70">Fiyat bilgisi yok</span>
              )}
            </div>

            {heroDescription && (
              containsHtmlMarkup(heroDescription) ? (
                <ProductHtmlContent html={heroDescription} className="mt-8" />
              ) : (
                <p className="mt-8 text-[15px] leading-[1.7] text-[#8B6B57]">{heroDescription}</p>
              )
            )}

            {hasVariants && (
              <div className="mt-10 space-y-6">
                {option1List.length > 0 && (
                  <div>
                    <p className="mb-3 text-[10px] tracking-[0.32em] uppercase text-[#A17E65]">Seçenek</p>
                    <div className="flex flex-wrap gap-2">
                      {option1List.map((opt) => {
                        const isSelected = selectedVariant?.attributeOption1?.id === opt.id;
                        const isAvailable = isVariantAvailable(
                          enrichedProduct,
                          opt.id,
                          selectedVariant?.attributeOption2?.id,
                        );
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => selectVariant(opt.id)}
                            disabled={!isAvailable}
                            className={`border px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase transition ${
                              isSelected
                                ? "border-[#5C4638] bg-[#5C4638] text-[#F8F1E9]"
                                : isAvailable
                                  ? "border-[#D9C5B0] bg-[#FDFAF6] text-[#5C4638] hover:border-[#A17E65]"
                                  : "cursor-not-allowed border-[#EDE0D1] text-[#D9C5B0]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {option2List.length > 0 && (
                  <div>
                    <p className="mb-3 text-[10px] tracking-[0.32em] uppercase text-[#A17E65]">Boyut</p>
                    <div className="flex flex-wrap gap-2">
                      {option2List.map((opt) => {
                        const isSelected = selectedVariant?.attributeOption2?.id === opt.id;
                        const isAvailable = isVariantAvailable(
                          enrichedProduct,
                          selectedVariant?.attributeOption1?.id,
                          opt.id,
                        );
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => selectVariant(opt.id)}
                            disabled={!isAvailable}
                            className={`border px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase transition ${
                              isSelected
                                ? "border-[#5C4638] bg-[#5C4638] text-[#F8F1E9]"
                                : isAvailable
                                  ? "border-[#D9C5B0] bg-[#FDFAF6] text-[#5C4638] hover:border-[#A17E65]"
                                  : "cursor-not-allowed border-[#EDE0D1] text-[#D9C5B0]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {selectedVariant && stock > 0 && (
                  <p className="text-xs tracking-wide text-[#8B6B57]">Stokta · {stock} adet</p>
                )}
              </div>
            )}

            <div className="mt-10 border-t border-[#D9C5B0]/40 pt-8">
              <div className="space-y-5">
                {isInCart && (
                  <p className="inline-flex items-center gap-2 text-sm text-[#5C4638]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A17E65]/15">
                      <Check className="h-3 w-3 text-[#A17E65]" strokeWidth={2.5} />
                    </span>
                    Bu ürün sepetinizde
                    <Link
                      href="/sepet"
                      className="ml-1 text-[#A17E65] underline-offset-2 transition hover:text-[#5C4638] hover:underline"
                    >
                      Sepete git
                    </Link>
                  </p>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span className="min-w-[3.25rem] text-sm text-[#8B6B57]">Adet</span>
                    <div
                      className="inline-flex items-center overflow-hidden rounded-full border border-[#D9C5B0] bg-white"
                      role="group"
                      aria-label="Ürün adedi"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          isInCart ? handleQuantityChange(-1) : setQuantity((q) => Math.max(1, q - 1))
                        }
                        disabled={isCartBusy || (!isInCart && quantity <= 1)}
                        className="flex h-11 w-11 items-center justify-center text-[#5C4638] transition hover:bg-[#F5EDE4] active:bg-[#EDE0D1] disabled:opacity-30"
                        aria-label="Adedi azalt"
                      >
                        <Minus className="h-4 w-4" strokeWidth={2} />
                      </button>
                      <span className="min-w-[2.5rem] px-1 text-center font-mono text-base tabular-nums text-[#5C4638]">
                        {isCartBusy ? (
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#D9C5B0] border-t-[#5C4638]" />
                        ) : isInCart ? (
                          cartQuantity
                        ) : (
                          quantity
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          isInCart
                            ? handleQuantityChange(1)
                            : setQuantity((q) => Math.min(maxQuantity, q + 1))
                        }
                        disabled={
                          isCartBusy ||
                          (isInCart ? cartQuantity >= maxQuantity : quantity >= maxQuantity)
                        }
                        className="flex h-11 w-11 items-center justify-center text-[#5C4638] transition hover:bg-[#F5EDE4] active:bg-[#EDE0D1] disabled:opacity-30"
                        aria-label="Adedi artır"
                      >
                        <Plus className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-1 gap-2.5 sm:justify-end">
                    {!isInCart && (
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!canAddToCart || isCartBusy}
                        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#5C4638] px-6 text-sm font-medium text-[#F8F1E9] transition hover:bg-[#3F2F25] disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-xs sm:flex-none sm:min-w-[200px]"
                      >
                        {isCartBusy ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <>
                            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                            Sepete Ekle
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggle()}
                      disabled={isTogglingFavorite}
                      aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition ${
                        isFavorite
                          ? "border-[#5C4638] bg-[#5C4638] text-[#F8F1E9]"
                          : "border-[#D9C5B0] bg-white text-[#5C4638] hover:border-[#A17E65]"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              {showDescriptionAccordion && (
                <AccordionItem title="Ürün Açıklaması" defaultOpen>
                  {containsHtmlMarkup(fullDescription) ? (
                    <ProductHtmlContent html={fullDescription} />
                  ) : (
                    <p>{fullDescription}</p>
                  )}
                </AccordionItem>
              )}
              {showRichContentAccordion && (
                <AccordionItem title="Detaylı Bilgi">
                  <ProductHtmlContent html={richContent} />
                </AccordionItem>
              )}
              {enrichedProduct.property?.length > 0 && (
                <AccordionItem title="Özellikler">
                  <ul className="space-y-2">
                    {enrichedProduct.property.map((prop) => (
                      <li key={prop.id}>
                        <span className="text-[#5C4638]">{prop.name}</span>
                        {prop.description && (
                          <span className="text-[#8B6B57]"> — {prop.description}</span>
                        )}
                        {prop.richContent && containsHtmlMarkup(prop.richContent) && (
                          <ProductHtmlContent html={prop.richContent} className="mt-1" />
                        )}
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
              )}
            </div>
          </div>
        </div>

        {relatedProducts && relatedProducts.length > 0 && (
          <section className="border-t border-[#D9C5B0]/50 pt-16 lg:pt-20">
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] tracking-[0.38em] uppercase text-[#A17E65]">Keşfetmeye Devam</p>
                <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#5C4638] sm:text-3xl">
                  Benzer Ürünler
                </h2>
              </div>
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#5C4638] transition hover:text-[#A17E65]"
              >
                Tümünü Gör
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-8">
              {relatedProducts.slice(0, 6).map((item, index) => (
                <ItemListingProduct key={item.id} product={item} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
