"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { SLUG_PATTERN, slugify } from "@/lib/slug";
import { requireAdmin } from "./require-admin";
import type { FormState } from "./types";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function text(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

// ---------- login / logout ----------

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ip = clientIp(await headers());
  if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
    return { error: "Too many attempts. Try again in 15 minutes." };
  }

  const email = text(formData, "email");
  const password = typeof formData.get("password") === "string"
    ? (formData.get("password") as string)
    : "";
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
    console.error("LOGIN ERROR:", error.message);
    return { error: "Wrong email or password." };
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    return { error: "Wrong email or password." };
  }

  redirect("/admin/products");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- products ----------

export async function saveProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id") || null;
  if (id && !UUID.test(id)) return { error: "Invalid product." };

  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const description = text(formData, "description");
  const priceRaw = text(formData, "price");
  const categoryId = text(formData, "category_id") || null;
  const affiliateUrl = text(formData, "affiliate_url");
  const imageUrlField = text(formData, "image_url");
  const isPublished = formData.get("is_published") === "on";
  const file = formData.get("image_file");

  if (!title) return { error: "Title is required." };
  if (title.length > 200) return { error: "Title is too long (max 200 characters)." };
  if (!slug || !SLUG_PATTERN.test(slug)) {
    return { error: "Slug can only use lowercase letters, numbers and dashes." };
  }
  if (description.length > 5000) {
    return { error: "Description is too long (max 5000 characters)." };
  }
  if (categoryId && !UUID.test(categoryId)) return { error: "Invalid category." };

  let price: number | null = null;
  if (priceRaw !== "") {
    price = Number(priceRaw);
    if (!Number.isFinite(price) || price < 0 || price > 99999999) {
      return { error: "Price must be a number, 0 or more." };
    }
  }

  try {
    const u = new URL(affiliateUrl);
    if (u.protocol !== "https:") throw new Error("not https");
  } catch {
    return { error: "Affiliate link must be a full link starting with https://" };
  }

  let imageUrl: string | null = imageUrlField || null;

  if (file instanceof File && file.size > 0) {
    const ext = IMAGE_TYPES[file.type];
    if (!ext) return { error: "Image must be a JPG, PNG or WebP file." };
    if (file.size > MAX_IMAGE_BYTES) return { error: "Image must be 2 MB or smaller." };

    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
    if (uploadError) return { error: `Image upload failed: ${uploadError.message}` };

    imageUrl = supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  }

  if (imageUrl) {
    try {
      if (new URL(imageUrl).protocol !== "https:") throw new Error("not https");
    } catch {
      return { error: "Image link must start with https://" };
    }
  }

  const row = {
    title,
    slug,
    description: description || null,
    image_url: imageUrl,
    price,
    category_id: categoryId,
    affiliate_url: affiliateUrl,
    is_published: isPublished,
  };

  const result = id
    ? await supabase.from("products").update(row).eq("id", id)
    : await supabase.from("products").insert(row);

  if (result.error) {
    if (result.error.code === "23505") {
      return { error: "That slug is already used by another product. Change the slug." };
    }
    return { error: `Could not save: ${result.error.message}` };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function togglePublishedAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  if (!UUID.test(id)) return;

  const publish = text(formData, "publish") === "true";
  await supabase.from("products").update({ is_published: publish }).eq("id", id);
  revalidatePath("/admin/products");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  if (!UUID.test(id)) return;

  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
}

// ---------- categories ----------

export async function addCategoryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const name = text(formData, "name");
  if (!name) return { error: "Enter a category name." };
  if (name.length > 60) return { error: "Name is too long (max 60 characters)." };

  const slug = slugify(name);
  if (!slug || !SLUG_PATTERN.test(slug)) {
    return { error: "Use letters or numbers in the name." };
  }

  const { error } = await supabase.from("categories").insert({ name, slug });
  if (error) {
    if (error.code === "23505") return { error: "A category with that name already exists." };
    return { error: `Could not add: ${error.message}` };
  }

  revalidatePath("/admin/categories");
  return null;
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  if (!UUID.test(id)) return;

  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
}
