/** API: product.fetch.service.ts — order.column enum ile uyumlu */
export type ProductOrderColumn = "price" | "stock" | "createdAt" | "updatedAt" | "status" | "saleScore";
export type ProductOrderDirection = "asc" | "desc";

export type ProductSortPreset =
  | "default"
  | "new"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "updated-desc"
  | "updated-asc"
  | "stock-desc"
  | "stock-asc"
  | "bestsellers"
  | "discount";

export interface ProductOrder {
  column: ProductOrderColumn;
  direction: ProductOrderDirection;
}

export interface ProductSortOption {
  preset: ProductSortPreset;
  label: string;
  order?: ProductOrder;
  tags?: string[];
  hasDiscount?: boolean;
}

export const PRODUCT_SORT_OPTIONS: ProductSortOption[] = [
  { preset: "default", label: "Önerilen" },
  { preset: "new", label: "En Yeni", order: { column: "createdAt", direction: "desc" } },
  { preset: "oldest", label: "En Eski", order: { column: "createdAt", direction: "asc" } },
  { preset: "price-asc", label: "Fiyat: Düşükten Yükseğe", order: { column: "price", direction: "asc" } },
  { preset: "price-desc", label: "Fiyat: Yüksekten Düşüğe", order: { column: "price", direction: "desc" } },
  { preset: "updated-desc", label: "Son Güncellenen", order: { column: "updatedAt", direction: "desc" } },
  { preset: "updated-asc", label: "İlk Güncellenen", order: { column: "updatedAt", direction: "asc" } },
  { preset: "stock-desc", label: "Stok: Yüksekten Düşüğe", order: { column: "stock", direction: "desc" } },
  { preset: "stock-asc", label: "Stok: Düşükten Yükseğe", order: { column: "stock", direction: "asc" } },
  { preset: "bestsellers", label: "Çok Satanlar", order: { column: "saleScore", direction: "desc" } },
  { preset: "discount", label: "İndirim", hasDiscount: true, order: { column: "price", direction: "asc" } },
];

const LEGACY_SORT_ALIASES: Record<string, ProductSortPreset> = {
  new: "new",
  newest: "new",
  oldest: "oldest",
  "price-asc": "price-asc",
  "price-desc": "price-desc",
  rating: "updated-desc",
  popular: "updated-desc",
  bestsellers: "bestsellers",
  bestseller: "bestsellers",
  discount: "discount",
  sale: "discount",
};

export function normalizeProductSortPreset(raw: string | null | undefined): ProductSortPreset {
  if (!raw || raw === "default") return "default";
  const alias = LEGACY_SORT_ALIASES[raw];
  if (alias) return alias;
  if (PRODUCT_SORT_OPTIONS.some((o) => o.preset === raw)) return raw as ProductSortPreset;
  return "default";
}

export function findProductSortOption(preset: ProductSortPreset): ProductSortOption {
  return PRODUCT_SORT_OPTIONS.find((o) => o.preset === preset) ?? PRODUCT_SORT_OPTIONS[0];
}

export function resolveProductSortFromQuery(input: {
  sort?: string | null;
  order?: { column?: string; direction?: string } | null;
  orderDirection?: string | null;
}): ProductSortPreset {
  const fromSort = normalizeProductSortPreset(input.sort);
  if (fromSort !== "default" || input.sort) return fromSort;

  if (!input.order?.column) return "default";

  const direction = (input.order.direction ?? input.orderDirection ?? "desc") as ProductOrderDirection;
  const matched = PRODUCT_SORT_OPTIONS.find(
    (o) => o.order?.column === input.order?.column && o.order?.direction === direction && !o.tags?.length,
  );
  return matched?.preset ?? "default";
}

export function resolveProductListOrder(preset: ProductSortPreset): ProductOrder | undefined {
  return findProductSortOption(preset).order;
}

export function mergeProductListTags(
  userTags: string[] | null | undefined,
  preset: ProductSortPreset,
): string[] | undefined {
  const sortTags = findProductSortOption(preset).tags;
  if (sortTags?.length) return [...sortTags];

  const cleaned = userTags?.filter(Boolean);
  return cleaned?.length ? cleaned : undefined;
}

export function resolveProductListHasDiscount(preset: ProductSortPreset): boolean | undefined {
  return findProductSortOption(preset).hasDiscount ? true : undefined;
}

export const PRODUCT_DEFAULT_PAGE_SIZE = 12;

export interface ProductListingUrlState {
  page?: number;
  amount?: number;
  category?: string | null;
  tags?: string[] | null;
  search?: string | null;
  sort?: string | null;
  order?: { column: string; direction: "asc" | "desc" } | null;
  orderDirection?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  brandId?: string[] | null;
  attributeOptions?: string[] | null;
}

export function serializeProductListingParams(state: ProductListingUrlState): URLSearchParams {
  const params = new URLSearchParams();

  const page = state.page ?? 1;
  const amount = state.amount ?? PRODUCT_DEFAULT_PAGE_SIZE;

  if (page > 1) params.set("page", String(page));
  if (amount !== PRODUCT_DEFAULT_PAGE_SIZE) params.set("amount", String(amount));
  if (state.category) params.set("category", state.category);
  if (state.search) params.set("search", state.search);
  if (state.sort) params.set("sort", state.sort);
  if (!state.sort && state.order) {
    params.set("order", JSON.stringify(state.order));
    if (state.orderDirection) params.set("orderDirection", state.orderDirection);
  }
  if (state.minPrice) params.set("minPrice", state.minPrice);
  if (state.maxPrice) params.set("maxPrice", state.maxPrice);

  state.tags?.forEach((tag) => {
    if (tag) params.append("tags", tag);
  });
  state.brandId?.forEach((id) => {
    if (id) params.append("brandId", id);
  });
  state.attributeOptions?.forEach((id) => {
    if (id) params.append("attributeOptions", id);
  });

  return params;
}

export function buildProductListHref(state: ProductListingUrlState = {}, basePath = "/urunler"): string {
  const qs = serializeProductListingParams(state).toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function appendProductListStateToHref(href: string, state: ProductListingUrlState): string {
  const qs = serializeProductListingParams(state).toString();
  return qs ? `${href}?${qs}` : href;
}
