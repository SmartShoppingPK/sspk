import type { Metadata } from "next";
import { requireAdmin } from "@/features/admin/require-admin";
import { deleteCategoryAction } from "@/features/admin/actions";
import { CategoryForm } from "@/features/admin/components/category-form";
import { ConfirmForm } from "@/features/admin/components/confirm-form";
import type { Category } from "@/features/products/types";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("id, name, slug").order("name");
  const categories = (data ?? []) as Category[];

  return (
    <>
      <h1 className="mb-8 font-heading text-4xl">Categories</h1>

      <CategoryForm />

      <h2 className="mb-4 mt-14 font-heading text-2xl">Existing categories</h2>
      {categories.length === 0 ? (
        <p className="text-muted">No categories yet.</p>
      ) : (
        <ul className="max-w-xl divide-y divide-line border-y border-line">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted">/category/{c.slug}</p>
              </div>
              <ConfirmForm
                action={deleteCategoryAction}
                id={c.id}
                label="Delete"
                message={`Delete the category "${c.name}"? Products in it will become uncategorised.`}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
