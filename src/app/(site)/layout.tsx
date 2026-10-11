import { SkipLink } from "@/components/layout/skip-link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { BackToTop } from "@/components/layout/back-to-top";
import { getCategories } from "@/features/products/queries";

// Always read fresh data so new products show up right away.
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <>
      <SkipLink />
      <SiteHeader categories={categories.map((c) => ({ name: c.name, slug: c.slug }))} />
      <main id="main">{children}</main>
      <SiteFooter />
      <CookieBanner />
      <BackToTop />
    </>
  );
}
