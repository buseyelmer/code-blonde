import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Heart, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useProductManager } from '@/core/hook/use.product.manager';
import { ProductDetail } from '@raxonltd/raxon-core/interface/product.interface';
import { createPortal } from 'react-dom';

interface ViewProductImageAreaProps {
  product: ProductDetail;
}

export default function ViewProductImageArea({ product }: ViewProductImageAreaProps) {
  const { images, selectedVariant, discountPercent, basketDiscountPercent, isWishlisted } = useProductManager(product);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<any | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex(prev => (images?.length ? (prev - 1 + images.length) % images.length : 0));
  }, [images?.length]);

  const goNext = useCallback(() => {
    setLightboxIndex(prev => (images?.length ? (prev + 1) % images.length : 0));
  }, [images?.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isLightboxOpen, closeLightbox, goPrev, goNext]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  }, [closeLightbox]);

  return (
    <>
      <div className="relative overflow-hidden bg-gray-100 group rounded-xl" style={{ aspectRatio: '3 / 4' }}>
        <Swiper
          modules={[Navigation, Thumbs]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper: any) => {
            if (typeof swiper.params.navigation !== 'boolean') {
              const navigation = swiper.params.navigation;
              navigation.prevEl = prevRef.current;
              navigation.nextEl = nextRef.current;
            }
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          className="h-full"
        >
          {images?.map((image, index) => (
            <SwiperSlide key={`slide-${index}`}>
              <div className="relative w-full h-full">
                <Image
                  src={image ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${image}` : 'https://placehold.co/600x800/f3f4f6/9ca3af?text=Ürün'}
                  alt={product?.name ?? ''}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full"
                  priority={index === 0}
                />

                <button
                  type="button"
                  className="absolute inset-0 w-full h-full cursor-zoom-in z-10 bg-transparent border-0"
                  onClick={() => openLightbox(index)}
                  aria-label="Görseli büyüt"
                >
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <ZoomIn className="w-3.5 h-3.5" />
                    Büyüt
                  </span>
                </button>

                {(discountPercent > 0 || basketDiscountPercent > 0) && (discountPercent || basketDiscountPercent) && (
                  <div className="absolute top-4 left-4 z-20 pointer-events-none">
                    <div className="flex min-w-[56px] flex-col items-center justify-center bg-red-500 px-3 py-2 rounded-lg shadow-sm">
                      <span className="text-base font-bold leading-none text-white">%{discountPercent || basketDiscountPercent}</span>
                      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-red-50">İndirim</span>
                    </div>
                  </div>
                )}

                {selectedVariant?.price?.basketPrice && selectedVariant.price.basketPrice > 0 ? (
                  <div className="absolute top-4 right-4 z-20 pointer-events-none">
                    <div className="flex items-center gap-2 bg-rose-900 px-3 py-2 rounded-lg shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      <div className="flex flex-col leading-none">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-rose-100">Sepette</span>
                        <span className="text-base font-bold text-white">{selectedVariant.price.basketPrice.toTry()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white hover:bg-rose-50 transition-all duration-200 flex items-center justify-center rounded-full shadow-sm group/heart"
                  >
                    <Heart className={`w-5 h-5 transition-colors duration-200 ${isWishlisted ? 'text-rose-900 fill-rose-900' : 'text-gray-600 group-hover/heart:text-rose-900'}`} />
                  </button>
                )}
              </div>
            </SwiperSlide>
          ))}

          {images?.length && images.length > 1 ? (
            <>
              <button
                ref={prevRef}
                type="button"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 bg-white/90 hover:bg-white transition-all duration-200 flex items-center justify-center rounded-full shadow-md opacity-0 group-hover:opacity-100 sm:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                ref={nextRef}
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-10 h-10 bg-white/90 hover:bg-white transition-all duration-200 flex items-center justify-center rounded-full shadow-md opacity-0 group-hover:opacity-100 sm:opacity-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          ) : null}
        </Swiper>
      </div>

      {images?.length && images.length > 1 ? (
        <div className="relative mt-4">
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView="auto"
            watchSlidesProgress={true}
            className="thumbs-swiper"
          >
            {images?.map((productMediaItem, index) => (
              <SwiperSlide key={`thumb-${index}`} className="!w-20 !h-20 sm:!w-24 sm:!h-24">
                <button
                  type="button"
                  className="aspect-square w-full relative overflow-hidden bg-gray-100 border-2 border-transparent hover:border-gray-400 transition-colors cursor-pointer rounded-xl"
                  onClick={() => openLightbox(index)}
                  aria-label="Görseli büyüt"
                >
                  <Image
                    src={productMediaItem ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${productMediaItem}` : 'https://placehold.co/200x200/f3f4f6/9ca3af?text=Ürün'}
                    alt={`${product?.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="100px"
                    className="w-full h-full"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : null}

      {isLightboxOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm"
              onClick={handleBackdropClick}
              role="dialog"
              aria-modal="true"
              aria-label="Görsel önizleme"
            >
              <button
                type="button"
                className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all duration-200"
                onClick={closeLightbox}
                aria-label="Kapat"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {images?.length && images.length > 1 ? (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-white/60 text-sm select-none">
                  {lightboxIndex + 1} / {images.length}
                </div>
              ) : null}

              <div className="relative w-[min(90vw,680px)] max-h-[90vh] flex items-center justify-center">
                <div className="relative w-full" style={{ aspectRatio: '3 / 4' }}>
                  <Image
                    src={images?.[lightboxIndex] ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${images[lightboxIndex]}` : 'https://placehold.co/900x1200/f3f4f6/9ca3af?text=Ürün'}
                    alt={product?.name ?? ''}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 90vw, 680px"
                    priority
                  />
                </div>
              </div>

              {images?.length && images.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all duration-200"
                    onClick={goPrev}
                    aria-label="Önceki"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all duration-200"
                    onClick={goNext}
                    aria-label="Sonraki"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              ) : null}
            </div>,
            document.body
          )
        : null}
    </>
  );
}
