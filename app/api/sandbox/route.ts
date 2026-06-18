import { fetchData } from "@/lib/api-client";
import { IData } from "@/core/interface/nexine.interface";
import { Product } from "@/core/interface/product.interface";
import { Category, Status } from "@/core/interface/prisma.interface";
import { normalizeApiProducts } from "@/lib/api/normalize-product";
import { groupProductsByCategory } from "@/lib/api/group-products";
import {
  CODE_BLONDE_BRAND_NAME,
  isCodeBlondeProduct,
  resolveCodeBlondeBrandId,
} from "@/lib/api/resolve-brand";
import { NO_CACHE_HEADERS } from "@/core/util/no-cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
      return jsonWithNoCache({
        ...(scope === "products"
          ? { products: [], meta: { scope, brandId: null, count: 0 } }
          : {
              ...EMPTY_HOME_PAYLOAD,
              meta: { scope, brandId: null, error: "brand_not_found" },
            }),
      });
    }

    if (scope === "products") {
      return jsonWithNoCache(await fetchCodeBlondeProducts(brandId));
    }

    return jsonWithNoCache(await fetchHomeBundle(brandId));
  } catch (error) {
    console.error("[sandbox] Beklenmeyen hata:", error);
    return jsonWithNoCache({
      ...EMPTY_HOME_PAYLOAD,
      meta: { scope, error: true },
    });
  }
}

async function fetchCodeBlondeProducts(brandId: string) {
  const productData = await fetchData<IData<Record<string, unknown>>>(
    "/customer/product",
    {
      status: Status.PUBLISHED,
      brandId,
      amount: 20,
    },
  );

  const products = filterCodeBlondeProducts(
    normalizeApiProducts(productData?.data),
    brandId,
    productData?.data,
  );
  const grouped = groupProductsByCategory(products);

  if (!productData) {
    console.warn("[sandbox] Code Blonde ürünleri çekilemedi, boş dizi dönülüyor.");
  }

  return {
    products,
    productCategories: grouped.productCategories,
    productGroups: grouped.groups,
    meta: {
      scope: "products",
      brand: CODE_BLONDE_BRAND_NAME,
      brandId,
      count: products.length,
    },
  };
}

async function fetchHomeBundle(brandId: string) {
  const [productRes, bestSellerRes, categoryRes] = await Promise.all([
    fetchData<IData<Record<string, unknown>>>("/customer/product", {
      status: Status.PUBLISHED,
      brandId,
      amount: 20,
    }),
    fetchData<IData<Record<string, unknown>>>("/customer/product", {
      status: Status.PUBLISHED,
      brandId,
      tag: "best-seller",
      amount: 16,
    }),
    fetchData<IData<Category>>("/customer/category", {
      viewType: "tree",
    }),
  ]);

  const products = filterCodeBlondeProducts(
    normalizeApiProducts(productRes?.data),
    brandId,
    productRes?.data,
  );
  const bestSeller = filterCodeBlondeProducts(
    normalizeApiProducts(bestSellerRes?.data),
    brandId,
    bestSellerRes?.data,
  );
  const category = categoryRes?.data ?? [];
  const grouped = groupProductsByCategory(products);

  if (!productRes && !bestSellerRes && !categoryRes) {
    console.warn("[sandbox] Ana veri paketi çekilemedi, boş diziler dönülüyor.");
  }

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

  if (allowedIds.size === 0) return [];

  return normalized.filter((product) => product.id && allowedIds.has(product.id));
}

function jsonWithNoCache(body: unknown) {
  const response = NextResponse.json(body, { status: 200 });

  Object.entries(NO_CACHE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
