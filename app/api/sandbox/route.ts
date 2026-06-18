import { fetchData, API_REVALIDATE_SECONDS } from "@/lib/api-client";
import { IData } from "@/core/interface/nexine.interface";
import { Product } from "@/core/interface/product.interface";
import { Category, Status } from "@/core/interface/prisma.interface";
import { fetchAllCodeBlondeProducts } from "@/lib/api/fetch-brand-products";
import { groupProductsByCategory } from "@/lib/api/group-products";
import { normalizeApiProducts } from "@/lib/api/normalize-product";
import {
  CODE_BLONDE_BRAND_NAME,
  isCodeBlondeProduct,
  resolveCodeBlondeBrandId,
} from "@/lib/api/resolve-brand";
import { jsonWithCache } from "@/app/api/sandbox/cache";

export const revalidate = 60;

const EMPTY_HOME_PAYLOAD = {
  products: [] as Product[],
  bestSeller: [] as Product[],
  category: [] as Category[],
  collection: [],
  subHeroCollection: [],
  campaign: [],
  faq: [],
  holiday: [],
  feed: [],
  review: [],
  article: [],
  bankAccount: [],
  deliveryMethod: [],
  paymentMethod: [],
  brand: [],
  branch: null,
  banner: [],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") ?? "home";

  try {
    const brandId = await resolveCodeBlondeBrandId();

    if (!brandId) {
      console.warn(
        `[sandbox] ${CODE_BLONDE_BRAND_NAME} brandId bulunamadı, boş diziler dönülüyor.`,
      );
      return jsonWithCache({
        ...(scope === "products"
          ? { products: [], meta: { scope, brandId: null, count: 0 } }
          : {
              ...EMPTY_HOME_PAYLOAD,
              meta: { scope, brandId: null, error: "brand_not_found" },
            }),
      });
    }

    if (scope === "products") {
      return jsonWithCache(await fetchCodeBlondeProducts(brandId));
    }

    return jsonWithCache(await fetchHomeBundle(brandId));
  } catch (error) {
    console.error("[sandbox] Beklenmeyen hata:", error);
    return jsonWithCache({
      ...EMPTY_HOME_PAYLOAD,
      meta: { scope, error: true },
    });
  }
}

async function fetchCodeBlondeProducts(brandId: string) {
  const { products, apiReportedCount } =
    await fetchAllCodeBlondeProducts(brandId);
  const grouped = groupProductsByCategory(products);

  return {
    products,
    productCategories: grouped.productCategories,
    productGroups: grouped.groups,
    meta: {
      scope: "products",
      brand: CODE_BLONDE_BRAND_NAME,
      brandId,
      count: products.length,
      apiReportedCount,
    },
  };
}

async function fetchHomeBundle(brandId: string) {
  const [productBundle, bestSellerRes, categoryRes] = await Promise.all([
    fetchAllCodeBlondeProducts(brandId),
    fetchData<IData<Record<string, unknown>>>(
      "/customer/product",
      {
        status: Status.PUBLISHED,
        brandId,
        tag: "best-seller",
        amount: 100,
      },
      { revalidate: API_REVALIDATE_SECONDS },
    ),
    fetchData<IData<Category>>(
      "/customer/category",
      { viewType: "tree" },
      { revalidate: API_REVALIDATE_SECONDS },
    ),
  ]);

  const products = productBundle.products;
  const bestSeller = filterCodeBlondeProducts(
    normalizeApiProducts(bestSellerRes?.data),
    brandId,
    bestSellerRes?.data,
  );
  const category = categoryRes?.data ?? [];
  const grouped = groupProductsByCategory(products);

  return {
    ...EMPTY_HOME_PAYLOAD,
    products,
    bestSeller,
    category,
    productCategories: grouped.productCategories,
    productGroups: grouped.groups,
    meta: {
      scope: "home",
      brand: CODE_BLONDE_BRAND_NAME,
      brandId,
      productCount: products.length,
      apiReportedCount: productBundle.apiReportedCount,
      bestSellerCount: bestSeller.length,
      categoryCount: category.length,
    },
  };
}

function filterCodeBlondeProducts(
  normalized: Product[],
  brandId: string,
  rawItems?: Record<string, unknown>[],
): Product[] {
  if (!rawItems?.length) return normalized;

  const allowedIds = new Set(
    rawItems
      .filter((item) => isCodeBlondeProduct(item, brandId))
      .map((item) => (typeof item.id === "string" ? item.id : ""))
      .filter(Boolean),
  );

  if (allowedIds.size === 0) return normalized;

  return normalized.filter((product) => product.id && allowedIds.has(product.id));
}
