import type { BasketSummaryInterface } from "@raxonltd/raxon-core/interface/basket.interface";

type EntityWithId = { id?: string | null };

/** Raxon API bazen `{ data: T }` döner; tek kayıt uçlarında bunu açar. */
export function unwrapApiEntity<T extends EntityWithId>(payload: unknown): T | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as T & { data?: unknown };
  if (root.id) return root;

  const nested = root.data;
  if (nested && typeof nested === "object" && (nested as EntityWithId).id) {
    return nested as T;
  }

  return null;
}

export function unwrapBasketSummary(payload: unknown): BasketSummaryInterface | null {
  return unwrapApiEntity<BasketSummaryInterface>(payload);
}

export function isResolvableCartId(id?: string | null): boolean {
  return Boolean(id && id !== "optimistic-cart");
}
