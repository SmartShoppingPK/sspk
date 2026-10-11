"use client";

import { buttonGhostClass } from "@/components/ui/button-styles";

// A small button that asks "are you sure?" before running a server action.
export function ConfirmForm({
  action,
  id,
  label,
  message,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label: string;
  message: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={buttonGhostClass}>
        {label}
      </button>
    </form>
  );
}
