export const dynamic = 'force-static';
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getCategories, getProducts } from "@/features/products/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProducts({ limit: 1000 }),
    getCategories(),
  ]);

  return [
    { url: siteConfig.url, changeFrequency: "daily" },
    { url: `${siteConfig.url}/products`, changeFrequency: "daily" },
    ...categories.map((c) => ({
      url: `${siteConfig.url}/category/${c.slug}`,
      changeFrequency: "weekly" as const,
    })),
    ...products.map((p) => ({
      url: `${siteConfig.url}/products/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "weekly" as const,
    })),
  ];
}
