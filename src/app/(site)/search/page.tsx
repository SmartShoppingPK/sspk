import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { buttonClass } from "@/components/ui/button-styles";
import { ProductGrid } from "@/features/products/components/product-grid";
import { getProducts } from "@/features/products/queries";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().slice(0, 80);
  const products = query ? await getProducts({ search: query }) : [];

  return (
    <Container className="py-12 md:py-20">
      <h1 className="mb-8 font-heading text-4xl md:text-5xl">Search</h1>
      <form action="/search" role="search" className="mb-12 flex max-w-xl gap-3">
        <label htmlFor="search-q" className="sr-only">
          Search products
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="What are you looking for?"
          className="w-full border border-ink bg-transparent px-4 py-3 text-[15px] outline-none focus-visible:border-accent"
        />
        <button type="submit" className={buttonClass}>
          Search
        </button>
      </form>

      {query && (
        <ProductGrid
          products={products}
          emptyMessage={`No products found for "${query}".`}
        />
      )}
    </Container>
  );
}
