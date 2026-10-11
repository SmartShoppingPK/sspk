import { createPublicClient } from "@/lib/supabase/public";
import type { Category, Product } from "./types";

const PRODUCT_COLUMNS =
  "id, slug, title, description, image_url, price, category_id, affiliate_url, is_published, created_at, updated_at";

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name");
    if (error) throw error;
    return (data ?? []) as Category[];
  } catch (e) {
    console.error("getCategories failed", e);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return (data as Category | null) ?? null;
  } catch (e) {
    console.error("getCategoryBySlug failed", e);
    return null;
  }
}

export async function getProducts(
  opts: { limit?: number; categoryId?: string; search?: string } = {},
): Promise<Product[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(opts.limit ?? 100);

    if (opts.categoryId) query = query.eq("category_id", opts.categoryId);

    if (opts.search) {
      const safe = opts.search.replace(/[%_\\,()]/g, " ").trim().slice(0, 80);
      if (safe) query = query.ilike("title", `%${safe}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as Product[];
  } catch (e) {
    console.error("getProducts failed", e);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    return (data as Product | null) ?? null;
  } catch (e) {
    console.error("getProductBySlug failed", e);
    return null;
  }
}
