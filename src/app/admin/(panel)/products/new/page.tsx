import type { Metadata } from "next";
import { requireAdmin } from "@/features/admin/require-admin";
import { ProductForm } from "@/features/admin/components/product-form";
import type { Category } from "@/features/products/types";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("id, name, slug").order("name");

  return (
    <>
      <h1 className="mb-8 font-heading text-4xl">Add product</h1>
      <ProductForm categories={(data ?? []) as Category[]} />
    </>
  );
}
