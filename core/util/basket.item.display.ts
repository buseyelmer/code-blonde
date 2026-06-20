import type { BasketItemSummaryInterface } from '@raxonltd/raxon-core/interface/basket.interface';

export function formatBasketItemVariantLine(item: BasketItemSummaryInterface): string | null {
  const v = item.variant;
  if (!v) return null;
  const parts: string[] = [];
  if (v.attributeOption1) {
    const n = v.attributeOption1.name;
    const label = v.attributeOption1.attribute?.name;
    parts.push(label && n ? `${label}: ${n}` : n || '');
  }
  if (v.attributeOption2) {
    const n = v.attributeOption2.name;
    const label = v.attributeOption2.attribute?.name;
    parts.push(label && n ? `${label}: ${n}` : n || '');
  }
  const s = parts.filter(Boolean).join(' · ');
  return s.length > 0 ? s : null;
}
