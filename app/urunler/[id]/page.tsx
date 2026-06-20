'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { ChevronRight, Home, Loader2, ShoppingBag } from 'lucide-react';
import { useProduct } from '@raxonltd/raxon-core/hook';
import SectionProductGallery from '@/core/theme/section/product-detail/section.product.detail.gallery';
import SectionProductInfo from '@/core/theme/section/product-detail/section.product.info';
import { getSafeImageUrl } from '@/core/util/util';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data: productData, isLoading, error } = useProduct().detail(productId);

  const product = useMemo(() => {
    if (!productData) return null;

    return {
      id: productData.id,
      name: productData.name,
      category: productData.categories?.[0]?.name || 'Kategori',
      brand: productData.brand || productData.categories?.[0]?.name || 'Ürün',
      price: productData.price?.payPrice || productData.price?.mainPrice || 0,
      originalPrice: productData.price?.mainPrice,
      rating: productData.review?.rating || 4.5,
      reviewCount: productData.review?.count || 0,
      description: productData.description || productData.shortDescription || '',
      shortDescription: productData.shortDescription || '',
      isFavorite: productData.isFavorite,
      images: (productData.images?.map((img, idx) => ({
        id: img.id || idx,
        src: getSafeImageUrl(img.relativePath, 'product'),
        alt: productData.name,
      })) || []) as { id: string | number; src: string; alt: string }[],
      variants:
        productData.variant?.length > 0
          ? [
              {
                type: 'size' as const,
                name: 'Seçenek',
                options: productData.variant.map((v) => ({
                  id: v.id,
                  name: v.attributeOption1?.label || 'Standart',
                  value: v.id,
                  available: v.stock > 0,
                })),
              },
            ]
          : [],
      ingredients: [],
      usage: [],
      shippingInfo: {
        deliveryTime: '1-3 iş günü içinde kargoya verilir',
        freeShippingThreshold: 500,
        returnPolicy:
          'Kozmetik ürünleri hijyen nedeniyle açıldıktan sonra iade edilemez. Ambalajı açılmamış ürünlerde 14 gün içinde iade hakkınız vardır.',
      },
    };
  }, [productData]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-charcoal" strokeWidth={1.5} />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-charcoal">Ürün Bulunamadı</h1>
          <p className="mt-3 text-sm text-muted">
            Aradığınız ürün mevcut değil veya bir hata oluştu.
          </p>
          <div className="mt-10 rounded-2xl border border-stone/70 bg-white p-12 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-stone" strokeWidth={1.5} />
            <Link
              href="/urunler"
              className="mt-6 inline-flex rounded-xl border border-charcoal px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-powder"
            >
              Ürünlere Dön
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const categoryId = productData?.categories?.[0]?.id;

  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <nav className="mb-8 flex flex-wrap items-center gap-2 border-b border-stone/50 pb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
          <Link href="/" className="inline-flex items-center gap-2 transition-colors hover:text-charcoal">
            <Home className="h-3.5 w-3.5" strokeWidth={1.5} />
            Ana Sayfa
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-stone" />
          <Link href="/urunler" className="transition-colors hover:text-charcoal">
            Ürünler
          </Link>
          {categoryId ? (
            <>
              <ChevronRight className="h-3 w-3 shrink-0 text-stone" />
              <Link
                href={`/urunler?category=${categoryId}`}
                className="transition-colors hover:text-charcoal"
              >
                {product.category}
              </Link>
            </>
          ) : null}
          <ChevronRight className="h-3 w-3 shrink-0 text-stone" />
          <span className="max-w-[220px] truncate text-charcoal">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 lg:items-start">
          <SectionProductGallery
            images={product.images}
            productId={product.id}
            isFavorite={product.isFavorite}
          />

          <SectionProductInfo
            productId={product.id}
            name={product.name}
            category={product.category}
            price={product.price}
            originalPrice={product.originalPrice}
            rating={product.rating}
            reviewCount={product.reviewCount}
            description={product.description}
            ingredients={product.ingredients}
            usage={product.usage}
            shippingInfo={product.shippingInfo}
            variants={product.variants}
            image={product.images[0]?.src}
            isFavorite={product.isFavorite}
          />
        </div>
      </div>
    </main>
  );
}
