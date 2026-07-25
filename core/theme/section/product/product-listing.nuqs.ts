import { parseAsString, parseAsInteger, parseAsArrayOf, parseAsJson } from "nuqs";

function parseOrderQuery(value: unknown): { column: string; direction: "asc" | "desc" } | null {
  if (value == null || typeof value !== "object") return null;
  const x = value as { column?: unknown; direction?: unknown };
  if (typeof x.column !== "string") return null;
  if (x.direction !== "asc" && x.direction !== "desc") return null;
  return { column: x.column, direction: x.direction };
}

export {
  PRODUCT_DEFAULT_PAGE_SIZE,
  PRODUCT_SORT_OPTIONS,
  normalizeProductSortPreset,
  resolveProductSortFromQuery,
  resolveProductListOrder,
  mergeProductListTags,
  resolveProductListHasDiscount,
  findProductSortOption,
  buildProductListHref,
  appendProductListStateToHref,
  serializeProductListingParams,
} from "@/core/util/product-listing";
export type { ProductListingUrlState } from "@/core/util/product-listing";

export const productListingQueryParsers = {
  category: parseAsString,
  amount: parseAsInteger.withDefault(12),
  page: parseAsInteger.withDefault(1),
  tags: parseAsArrayOf(parseAsString),
  search: parseAsString,
  sort: parseAsString,
  order: parseAsJson(parseOrderQuery),
  orderDirection: parseAsString,
  minPrice: parseAsString,
  maxPrice: parseAsString,
  brandId: parseAsArrayOf(parseAsString),
  attributeOptions: parseAsArrayOf(parseAsString),
} as const;

export function parsePriceQueryParam(raw: string | null | undefined): number | undefined {
  if (raw == null || raw === "") return undefined;
  const n = Number(String(raw).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined;
}
