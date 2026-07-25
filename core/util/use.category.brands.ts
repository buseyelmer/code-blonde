"use client";

import { useMemo } from "react";
import { useBrand, useProduct } from "@raxonltd/raxon-core/hook";
import type { RaxonContextBrand } from "@raxonltd/raxon-core/interface/context.interface";

function normalizeBrandName(name: string | null | undefined): string {
  return (name ?? "").trim().toLocaleUpperCase("tr-TR");
}

type CategoryBrand = Pick<RaxonContextBrand, "id" | "name">;

export function useCategoryBrands(
  categoryId: string | undefined,
  bootstrapBrands: RaxonContextBrand[],
): { brands: CategoryBrand[]; isLoading: boolean } {
  const { data: apiBrands, isFetching: apiFetching, isSuccess: apiSuccess } = useBrand().fetch({
    categoryId,
    amount: 500,
    enabled: Boolean(categoryId),
  });

  const apiLooksFiltered =
    Boolean(categoryId) &&
    apiSuccess &&
    bootstrapBrands.length > 0 &&
    (apiBrands?.count ?? 0) > 0 &&
    (apiBrands?.count ?? 0) < bootstrapBrands.length;

  const { data: products, isFetching: productsFetching } = useProduct().fetch({
    categoryId,
    amount: 3000,
    page: 1,
    outOfStock: false,
    enabled: Boolean(categoryId) && !apiLooksFiltered,
  });

  const brands = useMemo(() => {
    if (!categoryId) return bootstrapBrands;

    if (apiLooksFiltered && apiBrands?.data?.length) {
      return apiBrands.data.map((b) => ({ id: b.id, name: b.name }));
    }

    if (!products?.data?.length) return [];

    const namesInCategory = new Set(
      products.data.map((p) => normalizeBrandName(p.brand)).filter(Boolean),
    );

    return bootstrapBrands.filter((b) => namesInCategory.has(normalizeBrandName(b.name)));
  }, [categoryId, bootstrapBrands, apiLooksFiltered, apiBrands?.data, products?.data]);

  const isLoading =
    Boolean(categoryId) &&
    ((apiFetching && !apiSuccess) || (!apiLooksFiltered && productsFetching && brands.length === 0));

  return { brands, isLoading };
}
