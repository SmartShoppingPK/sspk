"use client";

import { useActionState } from "react";
import { addCategoryAction } from "../actions";
import type { FormState } from "../types";
import { buttonClass } from "@/components/ui/button-styles";
import { inputClass, labelClass } from "../styles";

export function CategoryForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    addCategoryAction,
    null,
  );

  return (
    <form action={action} className="max-w-md space-y-4">
      <div>
        <label htmlFor="name" className={labelClass}>
          New category name
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={60}
          placeholder="Home decor"
          className={inputClass}
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Adding..." : "Add category"}
      </button>
    </form>
  );
}
