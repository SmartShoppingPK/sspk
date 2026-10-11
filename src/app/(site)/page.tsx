import Link from "next/link";
import { Container } from "@/components/ui/container";
import { buttonClass } from "@/components/ui/button-styles";
import { ProductGrid } from "@/features/products/components/product-grid";
import { getCategories, getProducts } from "@/features/products/queries";

const tileColors = ["bg-sand", "bg-clay", "bg-sage", "bg-stone"];

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ limit: 8 }),
  ]);

  return (
    <>
      <section className="grid md:grid-cols-2">
        <Link
          href="/products"
          className="flex min-h-[55vh] items-center justify-center bg-sand px-8 py-16 text-center md:min-h-[75vh]"
        >
          <div className="max-w-md">
            <p className="text-[11px] uppercase tracking-[0.3em]">New in</p>
            <h1 className="mt-4 font-heading text-4xl leading-tight md:text-6xl">
              Daraz finds, picked by hand.
            </h1>
            <p className="mt-5 text-[15px] leading-6">
              Every product here links to Daraz, where you buy it. We earn a
              small commission, at no extra cost to you.
            </p>
            <span className={`${buttonClass} mt-8`}>Shop all products</span>
          </div>
        </Link>
        <Link
          href={categories.length > 0 ? "#categories" : "/products"}
          className="flex min-h-[40vh] items-center justify-center bg-clay px-8 py-16 text-center md:min-h-[75vh]"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em]">Browse</p>
            <h2 className="mt-4 font-heading text-3xl md:text-5xl">
              Shop by category
            </h2>
          </div>
        </Link>
      </section>

      {categories.length > 0 && (
        <section id="categories" className="py-16 md:py-24">
          <Container>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {categories.slice(0, 8).map((c, i) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className={`flex aspect-[4/3] items-center justify-center p-4 text-center transition-opacity hover:opacity-85 ${tileColors[i % tileColors.length]}`}
                >
                  <span className="font-heading text-xl uppercase tracking-[0.08em] md:text-2xl">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-8 md:py-12">
        <Container>
          <h2 className="mb-10 text-center font-heading text-3xl md:text-4xl">
            New in
          </h2>
          <ProductGrid products={products} />
          {products.length > 0 && (
            <p className="mt-12 text-center">
              <Link
                href="/products"
                className="text-[12px] uppercase tracking-[0.2em] underline underline-offset-4 hover:text-accent"
              >
                View all products
              </Link>
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
