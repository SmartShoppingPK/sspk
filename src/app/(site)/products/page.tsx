import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/features/products/components/product-grid";
import { getProducts } from "@/features/products/queries";

export const metadata: Metadata = { title: "All products" };

export default async function ProductsPage() {
  const products = await getProducts({ limit: 100 });

  return (
    <Container className="py-12 md:py-20">
      <h1 className="mb-10 font-heading text-4xl md:text-5xl">All products</h1>
      <ProductGrid products={products} />
    </Container>
  );
}
