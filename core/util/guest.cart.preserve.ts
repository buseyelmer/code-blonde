import type { BasketItemSummaryInterface } from "@raxonltd/raxon-core/interface/basket.interface";

const SNAPSHOT_KEY = "cb.guest-cart.snapshot";
const PENDING_KEY = "cb.guest-cart.pending-restore";

export type GuestCartSnapshotItem = {
  productId: string;
  variantId?: string;
  productUnitId?: string;
  quantity: number;
};

export function toGuestCartSnapshot(
  items: BasketItemSummaryInterface[] | undefined | null,
): GuestCartSnapshotItem[] {
  if (!items?.length) return [];

  const snapshot: GuestCartSnapshotItem[] = [];

  for (const item of items) {
    const productId = item.productId || item.product?.id;
    if (!productId || !item.quantity || item.quantity < 1) continue;

    const variantId = item.variantId || item.variant?.id || undefined;
    const productUnitId = !variantId ? item.productUnit?.id || undefined : undefined;

    snapshot.push({
      productId,
      variantId: variantId || undefined,
      productUnitId,
      quantity: item.quantity,
    });
  }

  return snapshot;
}

export function saveGuestCartSnapshot(items: BasketItemSummaryInterface[] | undefined | null) {
  if (typeof window === "undefined") return;

  const snapshot = toGuestCartSnapshot(items);
  if (snapshot.length === 0) return;

  try {
    sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore quota / private mode
  }
}

export function loadGuestCartSnapshot(): GuestCartSnapshotItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = sessionStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestCartSnapshotItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item?.productId && item.quantity > 0);
  } catch {
    return [];
  }
}

export function clearGuestCartSnapshot() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SNAPSHOT_KEY);
  } catch {
    // ignore
  }
}

export function markGuestCartRestorePending() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PENDING_KEY, "1");
  } catch {
    // ignore
  }
}

export function isGuestCartRestorePending() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(PENDING_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearGuestCartRestorePending() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
}
