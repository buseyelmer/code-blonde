import { SectionProductDetail } from "@/theme/product-detail/section.product.detail";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return <SectionProductDetail productId={id} />;
}
