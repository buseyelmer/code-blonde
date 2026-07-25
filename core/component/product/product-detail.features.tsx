"use client";

import type { ProductDetail } from "@raxonltd/raxon-core/interface/product.interface";
import { Droplet } from "lucide-react";
import { ProductDetailAccordion } from "@/core/component/product/product-detail.accordion";
import { containsHtmlMarkup } from "@/core/util/product.html";
import {
  getDisplayableProperties,
  getProductAttributes,
  getProductDescriptionHtml,
} from "@/core/util/product-detail-display";

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

export function ProductDetailFeatures({ product }: { product: ProductDetail }) {
  const descriptionHtml = getProductDescriptionHtml(product);
  const displayableProperties = getDisplayableProperties(product);
  const productAttributes = getProductAttributes(product);

  const variantOptionLabels = (() => {
    const labels = new Set<string>();
    for (const variant of product.variant ?? []) {
      const opt1 = variant.attributeOption1?.label?.trim();
      const opt2 = variant.attributeOption2?.label?.trim();
      if (opt1) labels.add(opt1);
      if (opt2) labels.add(opt2);
    }
    return [...labels];
  })();

  const showAttributesSection = productAttributes.length > 0;
  const showVariantOptionsSection = !showAttributesSection && variantOptionLabels.length > 0;
  const showPropertiesSection = displayableProperties.length > 0;
  const showDescriptionSection = Boolean(descriptionHtml);

  if (
    !showDescriptionSection &&
    !showPropertiesSection &&
    !showAttributesSection &&
    !showVariantOptionsSection
  ) {
    return null;
  }

  return (
    <div className="mt-12">
      {showDescriptionSection && (
        <ProductDetailAccordion title="Ürün Açıklaması" defaultOpen>
          <ProductHtmlContent html={descriptionHtml!} />
        </ProductDetailAccordion>
      )}

      {showAttributesSection && (
        <ProductDetailAccordion title="Ürün Nitelikleri">
          <dl className="overflow-hidden rounded-sm border border-[#D9C5B0]/40">
            {productAttributes.map((row) => (
              <div
                key={`${row.name}-${row.value}`}
                className="grid grid-cols-1 gap-1 border-b border-[#D9C5B0]/30 bg-[#FDFAF6] px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4"
              >
                <dt className="text-sm font-medium text-[#5C4638]">{row.name}</dt>
                <dd className="text-sm text-[#8B6B57]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </ProductDetailAccordion>
      )}

      {showVariantOptionsSection && (
        <ProductDetailAccordion title="Ürün Seçenekleri">
          <div className="flex flex-wrap gap-2">
            {variantOptionLabels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded-sm border border-[#D9C5B0]/60 bg-[#FDFAF6] px-3 py-1 text-sm text-[#5C4638]"
              >
                {label}
              </span>
            ))}
          </div>
        </ProductDetailAccordion>
      )}

      {showPropertiesSection && (
        <ProductDetailAccordion title="Ürün Özellikleri">
          <div className="space-y-3">
            {displayableProperties.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 rounded-sm border border-[#D9C5B0]/40 bg-[#FDFAF6] p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D9C5B0]/60 bg-[#F8F1E9]">
                  <Droplet className="h-5 w-5 text-[#A17E65]" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-sm font-medium text-[#5C4638]">{item.name}</p>
                  <p className="text-sm leading-relaxed text-[#8B6B57]">{item.description}</p>
                  {item.richContent && containsHtmlMarkup(item.richContent) && (
                    <ProductHtmlContent html={item.richContent} className="mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ProductDetailAccordion>
      )}
    </div>
  );
}
