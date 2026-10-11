import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { buttonClass } from "@/components/ui/button-styles";
import { getCategories, getProductBySlug } from "@/features/products/queries";
import { formatDate, formatPrice } from "@/features/products/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const description = (product.description || `${product.title} on Daraz`).slice(0, 160);
  const url = `/products/${product.slug}`;

  return {
    title: product.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: product.title,
      description,
      type: "website",
      url,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categories = await getCategories();
  const category = categories.find((c) => c.id === product.category_id);
  const price = formatPrice(product.price);

  return (
    <Container className="py-10 md:py-16">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="aspect-[3/4] w-full overflow-hidden bg-sand">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.2em] text-muted">
              No image
            </div>
          )}
        </div>

        <div className="md:pt-6">
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="text-[11px] uppercase tracking-[0.2em] text-muted hover:text-accent"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-3 font-heading text-3xl leading-tight md:text-5xl">
            {product.title}
          </h1>
          {price && <p className="mt-4 text-xl">{price}</p>}
          {price && (
            <p className="mt-1 text-xs text-muted">
              Price is set by Daraz and can change.
            </p>
          )}

          {product.description && (
            <p className="mt-8 whitespace-pre-line text-[15px] leading-7">
              {product.description}
            </p>
          )}

          <a
            href={`/go/${product.slug}`}
            target="_blank"
            rel="sponsored nofollow noopener"
            className={`${buttonClass} mt-10 w-full md:w-auto md:px-12`}
          >
            Buy on Daraz
          </a>

          <p className="mt-6 text-xs leading-5 text-muted">
            We earn a commission if you buy through this link, at no extra cost
            to you.{" "}
            <Link href="/disclosure" className="underline underline-offset-4">
              Learn more
            </Link>
            .
          </p>
          <p className="mt-2 text-xs text-muted">
            Last updated: {formatDate(product.updated_at)}
          </p>
        </div>
      </div>
    </Container>
  );
}
