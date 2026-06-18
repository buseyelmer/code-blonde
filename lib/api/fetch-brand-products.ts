import { fetchData, API_REVALIDATE_SECONDS } from "@/lib/api-client";
import { IData } from "@/core/interface/nexine.interface";
import { Status } from "@/core/interface/prisma.interface";
import { normalizeApiProducts } from "@/lib/api/normalize-product";
import { isCodeBlondeProduct } from "@/lib/api/resolve-brand";
import type { Product } from "@/core/interface/product.interface";

/** API'deki Code Blonde ürün sayısı (~59); güvenli üst sınır */
export const CODE_BLONDE_PRODUCT_LIMIT = 100;

const PAGE_SIZE = 100;

export async function fetchAllCodeBlondeProducts(
  brandId: string,
): Promise<{
  products: Product[];
  rawItems: Record<string, unknown>[];
  apiReportedCount: number;
}> {
  const allRaw: Record<string, unknown>[] = [];
  let page = 1;
  let apiReportedCount = 0;

  while (page <= 5) {
    const response = await fetchData<IData<Record<string, unknown>>>(
      "/customer/product",
      {
        status: Status.PUBLISHED,
        brandId,
        amount: PAGE_SIZE,
        page,
      },
      { revalidate: API_REVALIDATE_SECONDS },
    );

    if (!response?.data?.length) break;

    apiReportedCount = response.total ?? response.data.length;
    allRaw.push(...response.data);

    if (response.data.length < PAGE_SIZE) break;
    page += 1;
  }

  const uniqueRaw = dedupeById(allRaw);
  const normalized = normalizeApiProducts(uniqueRaw);

  const products = normalized.filter((product) => {
    const raw = uniqueRaw.find((item) => item.id === product.id);
    return raw ? isCodeBlondeProduct(raw, brandId) : true;
  });

  return {
    products,
    rawItems: uniqueRaw,
    apiReportedCount,
  };
}

function dedupeById(items: Record<string, unknown>[]): Record<string, unknown>[] {
  const map = new Map<string, Record<string, unknown>>();

  for (const item of items) {
    if (typeof item.id === "string") {
      map.set(item.id, item);
    }
  }

  return Array.from(map.values());
}
