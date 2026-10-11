import Link from "next/link";
import { requireAdmin } from "@/features/admin/require-admin";
import {
  deleteProductAction,
  togglePublishedAction,
} from "@/features/admin/actions";
import { ConfirmForm } from "@/features/admin/components/confirm-form";
import { buttonClass, buttonGhostClass } from "@/components/ui/button-styles";
import { formatPrice } from "@/features/products/format";
import type { Product } from "@/features/products/types";

type Row = Product & { categories: { name: string } | null };
type Stat = { product_id: string; total: number; last7: number };

export default async function AdminProductsPage() {
  const { supabase } = await requireAdmin();

  const [productsRes, statsRes] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false }),
    supabase.rpc("product_click_stats"),
  ]);

  const products = (productsRes.data ?? []) as Row[];
  const stats = new Map<string, Stat>(
    ((statsRes.data ?? []) as Stat[]).map((s) => [s.product_id, s]),
  );
  const statsMissing = Boolean(statsRes.error);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-4xl">Products</h1>
        <Link href="/admin/products/new" className={buttonClass}>
          Add product
        </Link>
      </div>

      {statsMissing && (
        <p className="mb-6 border border-line px-4 py-3 text-sm text-muted">
          Click counts are not set up yet. Run 0002_click_stats.sql in the Supabase SQL editor.
        </p>
      )}

      {products.length === 0 ? (
        <p className="text-muted">No products yet. Add your first one.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink text-[11px] uppercase tracking-[0.12em]">
                <th className="py-3 pr-4 font-semibold">Product</th>
                <th className="py-3 pr-4 font-semibold">Category</th>
                <th className="py-3 pr-4 font-semibold">Price</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold">Clicks (all / 7 days)</th>
                <th className="py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const s = stats.get(p.id);
                return (
                  <tr key={p.id} className="border-b border-line align-middle">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-12 shrink-0 bg-sand">
                          {p.image_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.image_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{p.title}</p>
                          <p className="text-xs text-muted">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{p.categories?.name ?? "None"}</td>
                    <td className="py-4 pr-4">{formatPrice(p.price) || "None"}</td>
                    <td className="py-4 pr-4">
                      {p.is_published ? "Published" : "Hidden"}
                    </td>
                    <td className="py-4 pr-4">
                      {statsMissing ? "-" : `${Number(s?.total ?? 0)} / ${Number(s?.last7 ?? 0)}`}
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/products/${p.id}/edit`} className={buttonGhostClass}>
                          Edit
                        </Link>
                        <form action={togglePublishedAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <input
                            type="hidden"
                            name="publish"
                            value={p.is_published ? "false" : "true"}
                          />
                          <button type="submit" className={buttonGhostClass}>
                            {p.is_published ? "Hide" : "Publish"}
                          </button>
                        </form>
                        <ConfirmForm
                          action={deleteProductAction}
                          id={p.id}
                          label="Delete"
                          message={`Delete "${p.title}"? This cannot be undone.`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
