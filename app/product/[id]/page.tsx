import { ProductDetail } from "@/components/ProductDetail";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return <ProductDetail productId={id} />;
}
