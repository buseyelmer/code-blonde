"use client";

import { useProduct } from "@raxonltd/raxon-core/hook";
import type { Product as CustomProduct } from "@raxonltd/raxon-core/interface/product.interface";
import ItemListingProduct from "@/core/theme/item/item.listing.product";

type BlogRelatedOfRelatedProps = {
  productId: string;
};

/** Mount only when productId is known — avoids empty related API calls. */
export default function BlogRelatedOfRelated({ productId }: BlogRelatedOfRelatedProps) {
  const { data, isLoading } = useProduct().related(productId);
  const products = (Array.isArray(data) ? data : (data as { data?: CustomProduct[] })?.data) ?? [];
  const list = (products as CustomProduct[]).slice(0, 4);

  if (isLoading) {
    return <p className="text-xs text-[#8B6B57]">İlgili ürünler yükleniyor…</p>;
  }

  if (list.length === 0) {
    return <p className="text-xs text-[#8B6B57]">Bu ürün için ilişkili öneri bulunamadı.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {list.map((product, index) => (
        <ItemListingProduct key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
