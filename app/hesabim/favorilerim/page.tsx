'use client';

import { useProduct, PRODUCT_PAGE_SIZE, useFavorite } from '@raxonltd/raxon-core/hook';
import { Product as CustomProduct } from '@raxonltd/raxon-core/interface/product.interface';
import { Status } from '@raxonltd/raxon-core/interface/prisma.interface';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

const FAVORITES_PAGE_SIZE = Math.max(PRODUCT_PAGE_SIZE, 48);

export default function FavorilerimPage() {
  const queryClient = useQueryClient();
  const productApi = useProduct();

  const { data: favoritesData, isLoading, refetch } = productApi.fetch({
    isFavorite: true,
    page: 1,
    amount: FAVORITES_PAGE_SIZE,
    status: Status.PUBLISHED,
    enabled: true,
  });

  const favoritesList: CustomProduct[] = favoritesData?.data ?? [];

  const { mutate: removeFavorite, isPending: isRemovingFavorite } = useFavorite().toggle();

  const handleRemove = (productId: string) => {
    removeFavorite({ productId }, {
      onSuccess: () => {
        toast.success('Favorilerden kaldırıldı');
        refetch();
      },
      onError: () => {
        toast.error('İşlem başarısız');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl text-gray-900 font-serif font-bold">
          Favorilerim
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Beğendiğiniz ürünleri görüntüleyin ve yönetin
        </p>
      </div>

      {/* Favorites Grid */}
      {favoritesList.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Favori Ürününüz Yok</h3>
          <p className="text-sm text-gray-500 mb-6">Beğendiğiniz ürünleri favorilere ekleyin.</p>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-900 text-white rounded-lg hover:bg-rose-800 transition-colors text-sm"
          >
            Ürünleri Keşfet
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoritesList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors group"
            >
              <div className="flex gap-4 p-4">
                {/* Product Image */}
                <Link href={`/urunler/${item.id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden relative">
                    {item.images?.[0] ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.images[0].relativePath}`}
                        alt={item.name}
                        fill
                        className="object-cover"
                       
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/urunler/${item.id}`}>
                    <h3 className="font-medium text-gray-900 truncate group-hover:text-rose-900 transition-colors">
                      {item.name || 'Ürün'}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {(item.price?.mainPrice as number | undefined)?.toLocaleString('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                    })}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      disabled={isRemovingFavorite}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Kaldır
                    </button>
                    <Link
                      href={`/urunler/${item.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Ürüne Git
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
