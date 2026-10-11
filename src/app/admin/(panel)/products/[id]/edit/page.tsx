import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/features/admin/require-admin";
import { ProductForm } from "@/features/admin/components/product-form";
import type { Category, Product } from "@/features/products/types";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [productRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name, slug").order("name"),
  ]);

  if (!productRes.data) notFound();

  return (
    <>
      <h1 className="mb-8 font-heading text-4xl">Edit product</h1>
      <ProductForm
        product={productRes.data as Product}
        categories={(categoriesRes.data ?? []) as Category[]}
      />
    </>
  );
}
