import Link from "next/link";
import type { Product } from "../types";
import { formatPrice } from "../format";

export function ProductCard({ product }: { product: Product }) {
  const price = formatPrice(product.price);

  return (
    <article>
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="aspect-[3/4] w-full overflow-hidden bg-sand">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover transition-opacity group-hover:opacity-85"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.2em] text-muted">
              No image
            </div>
          )}
        </div>
        <h3 className="mt-3 truncate text-sm">{product.title}</h3>
        {price && <p className="mt-1 text-sm text-muted">{price}</p>}
        <span className="mt-2 inline-block text-[11px] uppercase tracking-[0.15em] underline underline-offset-4">
          View
        </span>
      </Link>
    </article>
  );
}
