"use client";

import { useMemo } from "react";
import { useProduct } from "@raxonltd/raxon-core/hook";
import { Status } from "@raxonltd/raxon-core/interface/prisma.interface";
import type { Category, Collection } from "@raxonltd/raxon-core/interface/prisma.interface";
import type { Product } from "@raxonltd/raxon-core/interface/product.interface";
import {
  findPresentationForCollection,
  resolveCollectionProductFilter,
} from "@/core/constant/collection.constant";

export const COLLECTION_PAGE_SIZE = 24;

type CollectionWithProducts = Collection & { products?: Product[] };

function hasProducts(data?: { data?: Product[]; count?: number }) {
  return (data?.count ?? 0) > 0 || (data?.data?.length ?? 0) > 0;
}

export function useCollectionProducts(
  collectionId: string,
  collection: Collection | null | undefined,
  categories: Category[],
  page: number,
) {
  const ready = Boolean(collection && collectionId);

  const productFilter = useMemo(
    () => resolveCollectionProductFilter(categories, collection),
    [categories, collection],
  );

  const presentation = useMemo(
    () => (collection ? findPresentationForCollection(collection) : undefined),
    [collection],
  );

  const keywordSearch = productFilter.search ?? presentation?.keywords?.[0] ?? collection?.title?.trim();

  const hasCategoryFilter = Boolean(
    productFilter.categoryId || productFilter.subCategoryId || productFilter.search,
  );
  const hasTags = Boolean(collection?.tags?.length);
  const hasKeywordSearch = Boolean(keywordSearch && keywordSearch.length > 2);

  const baseParams = {
    materialType: "product" as const,
    status: Status.PUBLISHED,
    page,
    amount: COLLECTION_PAGE_SIZE,
  };

  const byCollectionId = useProduct().fetch({
    ...baseParams,
    collectionId,
    enabled: ready,
  });

  const collectionEmpty =
    ready && !byCollectionId.isLoading && !hasProducts(byCollectionId.data);

  const byCategory = useProduct().fetch({
    ...baseParams,
    categoryId: productFilter.categoryId,
    subCategoryId: productFilter.subCategoryId,
    search: productFilter.search,
    enabled: ready && collectionEmpty && hasCategoryFilter,
  });

  const categorySkipped = collectionEmpty && !hasCategoryFilter;
  const categoryEmpty =
    categorySkipped ||
    (collectionEmpty && !byCategory.isLoading && !hasProducts(byCategory.data));

  const byTags = useProduct().fetch({
    ...baseParams,
    tags: collection?.tags?.length ? collection.tags : undefined,
    enabled: ready && categoryEmpty && hasTags,
  });

  const tagsSkipped = categoryEmpty && !hasTags;
  const tagsEmpty =
    tagsSkipped || (categoryEmpty && !byTags.isLoading && !hasProducts(byTags.data));

  const bySearch = useProduct().fetch({
    ...baseParams,
    search: keywordSearch,
    enabled: ready && tagsEmpty && hasKeywordSearch,
  });

  const embeddedProducts = (collection as CollectionWithProducts | undefined)?.products;

  const activeQuery = useMemo(() => {
    if (hasProducts(byCollectionId.data)) return byCollectionId;
    if (hasCategoryFilter && hasProducts(byCategory.data)) return byCategory;
    if (hasTags && hasProducts(byTags.data)) return byTags;
    if (hasKeywordSearch && hasProducts(bySearch.data)) return bySearch;
    return bySearch.isLoading || bySearch.data
      ? bySearch
      : byTags.isLoading || byTags.data
        ? byTags
        : byCategory.isLoading || byCategory.data
          ? byCategory
          : byCollectionId;
  }, [
    byCollectionId,
    byCategory,
    byTags,
    bySearch,
    hasCategoryFilter,
    hasTags,
    hasKeywordSearch,
  ]);

  const products = useMemo(() => {
    if (embeddedProducts?.length) return embeddedProducts;
    return activeQuery.data?.data ?? [];
  }, [embeddedProducts, activeQuery.data?.data]);

  const totalCount = embeddedProducts?.length ?? activeQuery.data?.count ?? products.length;

  const isLoading =
    !ready ||
    byCollectionId.isLoading ||
    (collectionEmpty && hasCategoryFilter && byCategory.isLoading) ||
    (categoryEmpty && hasTags && byTags.isLoading) ||
    (tagsEmpty && hasKeywordSearch && bySearch.isLoading);

  return {
    products,
    totalCount,
    isLoading,
    isFetching: activeQuery.isFetching,
    productFilter,
    keywordSearch,
  };
}
