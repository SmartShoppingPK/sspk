"use client";

import { startTransition, useActionState, useState } from "react";
import { saveProductAction } from "../actions";
import type { FormState } from "../types";
import type { Category, Product } from "@/features/products/types";
import { slugify } from "@/lib/slug";
import { buttonClass } from "@/components/ui/button-styles";
import { hintClass, inputClass, labelClass } from "../styles";

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveProductAction,
    null,
  );
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="max-w-2xl space-y-7"
    >
      {product && <input type="hidden" name="id" value={product.id} />}

      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          defaultValue={product?.title}
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>
          Slug (the end of the product link)
        </label>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className={inputClass}
        />
        <p className={hintClass}>
          Made from the title automatically.
          {product && " Changing it breaks any old Pinterest links to this product."}
        </p>
      </div>

      <div className="grid gap-7 md:grid-cols-2">
        <div>
          <label htmlFor="category_id" className={labelClass}>
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className={inputClass}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="price" className={labelClass}>
            Price in Rs (optional)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            defaultValue={product?.price ?? ""}
            className={inputClass}
          />
          <p className={hintClass}>Shown for information only.</p>
        </div>
      </div>

      <div>
        <label htmlFor="affiliate_url" className={labelClass}>
          Daraz affiliate link
        </label>
        <input
          id="affiliate_url"
          name="affiliate_url"
          type="url"
          required
          placeholder="https://..."
          defaultValue={product?.affiliate_url}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          maxLength={5000}
          defaultValue={product?.description ?? ""}
          className={inputClass}
        />
      </div>

      <fieldset className="space-y-4 border border-line p-5">
        <legend className="px-2 text-[12px] font-semibold uppercase tracking-[0.12em]">
          Image
        </legend>
        {product?.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt="Current product"
            className="h-32 w-24 object-cover"
          />
        )}
        <div>
          <label htmlFor="image_file" className={labelClass}>
            Upload a new image
          </label>
          <input
            id="image_file"
            name="image_file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm"
          />
          <p className={hintClass}>JPG, PNG or WebP, up to 2 MB. Portrait (tall) photos look best.</p>
        </div>
        <div>
          <label htmlFor="image_url" className={labelClass}>
            Or paste an image link
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            placeholder="https://..."
            defaultValue={product?.image_url ?? ""}
            className={inputClass}
          />
          <p className={hintClass}>
            If you upload a file, it replaces this link.
          </p>
        </div>
      </fieldset>

      <label className="flex items-center gap-3 text-[15px]">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={product?.is_published ?? false}
          className="h-5 w-5 accent-[#c4572e]"
        />
        Published (visible on the site)
      </label>

      {state?.error && (
        <p role="alert" className="border border-accent px-4 py-3 text-sm text-accent">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Saving..." : product ? "Save changes" : "Add product"}
      </button>
    </form>
  );
}
