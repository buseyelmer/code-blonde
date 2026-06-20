import { Order, Product, User } from '@raxonltd/raxon-core/interface/prisma.interface';

export class Meta {
  static ViewContent(product: Product) {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: product.name,
        content_id: product.id,
        content_type: 'product',
        value: product.price,
      });
    }
  }
  static AddToCart(product: Product,user: User) {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_name: product.name,
        content_id: product.id,
        content_type: 'product',
        value: product.price,
        user_id: user.id,
        user_email: user.email,
        user_phone: user.phoneNumber,
      });
    }
  }
  static InitiateCheckout(product: Product,user: User) {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: product.name,
        content_id: product.id,
        content_type: 'product',
        value: product.price,

      });
    }
  }
  static Purchase(order: Order,user: User) {
    if (typeof window !== 'undefined' && window.fbq) {

      

      let contentIds = order.items?.map(item => item.productId) ?? [];
      let contentNames = order.items?.map(item => item.productName) ?? [];
      window.fbq('track', 'Purchase', {
        content_name: contentNames,
        content_ids: contentIds,
        content_type: 'product',
        value: order.totalPayAmount,
        currency: 'TRY',
        test_event_code: 'TEST10757',
        user_id: user.id,
        user_email: user.email,
        user_phone: user.phoneNumber,
      });
    }
  }
}
