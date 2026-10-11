import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/features/products/components/product-grid";
import { getCategoryBySlug, getProducts } from "@/features/products/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category ? category.name : "Category not found" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProducts({ categoryId: category.id });

  return (
    <Container className="py-12 md:py-20">
      <h1 className="mb-10 font-heading text-4xl md:text-5xl">{category.name}</h1>
      <ProductGrid
        products={products}
        emptyMessage="Nothing in this category yet. Check back soon."
      />
    </Container>
  );
}
