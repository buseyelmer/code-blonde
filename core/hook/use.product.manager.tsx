'use client';

import { useMemo } from 'react';
import { Product, ProductDetail } from '@raxonltd/raxon-core/interface/product.interface';
import { useQueryStates } from 'nuqs';
import { productDetailSearchParams } from '@/core/util/product-detail.search-params';
import { useAttribute } from '@raxonltd/raxon-core/hook';
import { useRaxon } from '@raxonltd/raxon-core';

export function useProductManager(product?: ProductDetail) {
  const [params] = useQueryStates(productDetailSearchParams);

  const { cart } = useRaxon();
  const { data: productAttributes } = useAttribute().fetch({
    productId: product?.id,
    enabled: true,
  });

  let images = useMemo(() => {
    let filterImages = product?.images;
    if (params.variantId != undefined) {
      filterImages = filterImages?.filter(it => it.variantIds.includes(params.variantId as string));
    } else if (params.attributeOption1Id != undefined && params.attributeOption2Id != undefined) {
      filterImages = filterImages?.filter(it => it.attributeOptionId === (params.attributeOption1Id as string) || it.attributeOptionId === (params.attributeOption2Id as string));
    }
    return filterImages && Array.isArray(filterImages) && filterImages.length > 0 ? filterImages.map(it => it.relativePath) : product?.images && Array.isArray(product.images) ? product.images.map(it => it.relativePath) : [];
  }, [product?.images, params.attributeOption1Id, params.attributeOption2Id, params.variantId]);

  let variantMatrix = useMemo(() => {
    var findAttributeOption1 = productAttributes?.data?.find(it => it.id == product?.variant[0].attributeOption1.attributeId);
    var findAttributeOption2 = productAttributes?.data?.find(it => it.id == product?.variant[0].attributeOption2.attributeId);
    return {
      attributeOption1: {
        label: findAttributeOption1?.name,
        options: findAttributeOption1?.attributeOptions ?? [],
      },
      attributeOption2: {
        label: findAttributeOption2?.name,
        options: findAttributeOption2?.attributeOptions ?? [],
      },
    };
  }, [product?.variant, productAttributes?.data]);

  const isSingleVariant = useMemo(() => {
    if (!product?.variant || product.variant.length === 0) return false;
    if (product.variant.length === 1) return true;
    const firstVariant = product.variant[0];
    return !firstVariant.attributeOption1?.id && !firstVariant.attributeOption2?.id;
  }, [product?.variant]);

  const hasOption2 = useMemo(() => {
    if (!product?.variant || product.variant.length === 0) return false;
    return product.variant.some(v => v.attributeOption2?.id && v.attributeOption2.id !== '');
  }, [product?.variant]);

  const hasOption1 = useMemo(() => {
    if (!product?.variant || product.variant.length === 0) return false;
    return product.variant.some(v => v.attributeOption1?.id && v.attributeOption1.id !== '');
  }, [product?.variant]);

  let selectedVariant = useMemo(() => {
    if (!product?.variant || product.variant.length === 0) return null;

    if (isSingleVariant) {
      return product.variant[0];
    }

    if (hasOption1 && !hasOption2 && params.attributeOption1Id != undefined) {
      return product.variant.find(it => it.attributeOption1.id === (params.attributeOption1Id as string)) ?? null;
    }

    if (params.attributeOption1Id != undefined && params.attributeOption2Id != undefined) {
      return product?.variant.find(it => it.attributeOption1.id === (params.attributeOption1Id as string) && it.attributeOption2.id === (params.attributeOption2Id as string)) ?? null;
    } else if (params.variantId != undefined) {
      return product?.variant.find(it => it.id === (params.variantId as string)) ?? null;
    }
    return null;
  }, [product?.variant, params.variantId, params.attributeOption1Id, params.attributeOption2Id, isSingleVariant, hasOption1, hasOption2]);

  const discountPercent = useMemo(() => {
    if (!selectedVariant?.price?.discountPrice || selectedVariant.price.discountPrice <= 0) return 0;
    if (!selectedVariant?.price?.mainPrice || selectedVariant.price.mainPrice <= 0) return 0;
    if (selectedVariant.price.discountPrice >= selectedVariant.price.mainPrice) return 0;
    return Math.round(((selectedVariant.price.mainPrice - selectedVariant.price.discountPrice) / selectedVariant.price.mainPrice) * 100);
  }, [selectedVariant?.price?.discountPrice, selectedVariant?.price?.mainPrice]);

  const basketDiscountPercent = useMemo(() => {
    if (!selectedVariant?.price?.basketPrice || selectedVariant.price.basketPrice <= 0) return 0;
    return Math.round(((selectedVariant.price.mainPrice - selectedVariant.price.basketPrice) / selectedVariant.price.mainPrice) * 100);
  }, [selectedVariant]);

  const bestPrice = useMemo(() => {
    if (!selectedVariant?.price?.mainPrice) return null;
    const candidates = [
      selectedVariant.price.discountPrice && selectedVariant.price.discountPrice > 0 ? selectedVariant.price.discountPrice : null,
      selectedVariant.price.basketPrice && selectedVariant.price.basketPrice > 0 ? selectedVariant.price.basketPrice : null,
      selectedVariant.price.mainPrice,
    ].filter((p): p is number => typeof p === 'number');

    return candidates.length ? Math.min(...candidates) : null;
  }, [selectedVariant?.price?.basketPrice, selectedVariant?.price?.discountPrice, selectedVariant?.price?.mainPrice]);

  const showStrike = useMemo(() => {
    if (!selectedVariant?.price?.mainPrice || !bestPrice) return false;
    return bestPrice < selectedVariant.price.mainPrice;
  }, [bestPrice, selectedVariant?.price?.mainPrice]);

  const isWishlisted = useMemo(() => {
    return product?.isFavorite ?? false;
  }, [product]);

  const cartItem = useMemo(() => {
    return cart?.items?.find(item => item.productId === product?.id && item.variant?.id === selectedVariant?.id);
  }, [cart, product?.id, selectedVariant?.id]);

  const isInCart = useMemo(() => {
    return cartItem !== undefined;
  }, [cartItem]);

  return {
    images,
    variantMatrix,
    selectedVariant,
    discountPercent,
    basketDiscountPercent,
    bestPrice,
    showStrike,
    isWishlisted,
    cartItem,
    isInCart,
    isSingleVariant,
    hasOption1,
    hasOption2,
  };
}
