import { useRaxon } from '@raxonltd/raxon-core';
import { ProductDetail } from '@raxonltd/raxon-core/interface/product.interface';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { Modal } from 'rizzui/modal';
import { Button } from 'rizzui/button';
import { Input } from 'rizzui/input';
import { useNewsletter } from '@raxonltd/raxon-core/hook';

export interface ModalVariantArg {
  id: string;
  attributeOption1?: { id?: string; label?: string; name?: string } | null;
  attributeOption2?: { id?: string; label?: string; name?: string } | null;
  price?: { mainPrice?: number; discountPrice?: number } | null;
}

export interface ModalNewsletterVariantProductRef {
  open: (product: ProductDetail, variant: ModalVariantArg) => void;
  close: () => void;
}

export interface ModalNewsletterVariantProductProps {}

export const ModalNewsletterVariantProduct = React.forwardRef<ModalNewsletterVariantProductRef, ModalNewsletterVariantProductProps>((props, ref) => {
  const callbackRef = useRef<any>(null);

  const { subscribeByVariant: subscribeByVariantMutation } = useNewsletter();
  const { profile } = useRaxon();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [variant, setVariant] = useState<ModalVariantArg | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onHandleSubscripeProduct = async () => {
    if(!product || !variant) return;
    
    const emailToUse = profile?.email || email;
    if(!emailToUse) return;
    
    setIsLoading(true);
    try {
      await subscribeByVariantMutation.mutate({
        variantId: variant.id,
        email: emailToUse,
      });
      setIsOpen(false);
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  }
  useImperativeHandle(ref, () => ({
    open: (product: ProductDetail, variant: ModalVariantArg) => {
      setProduct(product);
      setVariant(variant);
      setIsOpen(true);
      setEmail('');
      return new Promise((resolve, reject) => {
        callbackRef.current = { resolve, reject };
        resolve(true);
      });
    },
    close: () => {
      setIsOpen(false);
      setProduct(null);
      setVariant(null);
      setEmail('');
    },
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setProduct(null);
        setVariant(null);
        setEmail('');
      }}
      size="md"
    >
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Ürün Gelince Haber Ver
          </h2>
          <p className="text-gray-600">
            Bu ürün stoğa geldiğinde size haber verelim
          </p>
        </div>

        {product && variant && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-2">{product.name}</p>
            <p className="text-sm text-gray-600 mb-1">
              Varyant: {variant.attributeOption1?.label ?? variant.attributeOption1?.name} {variant.attributeOption2?.label ?? variant.attributeOption2?.name}
            </p>
            {variant.price && (
              <p className="text-sm font-medium text-green-600">
                ₺{(variant.price?.discountPrice ?? variant.price?.mainPrice ?? 0).toFixed(2)}
              </p>
            )}
          </div>
        )}

        {!profile?.email && (
          <div className="mb-4">
            <Input
              label="E-posta Adresiniz"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />
          </div>
        )}

        {profile?.email && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Bildirim gönderilecek e-posta: <span className="font-medium">{profile.email}</span>
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setProduct(null);
              setVariant(null);
              setEmail('');
            }}
            disabled={isLoading}
          >
            İptal
          </Button>
          <Button
            onClick={onHandleSubscripeProduct}
            disabled={isLoading || (!profile?.email && !email)}
            isLoading={isLoading}
          >
            Haber Ver
          </Button>
        </div>
      </div>
    </Modal>
  );
});
