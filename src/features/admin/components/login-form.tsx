"use client";

import { startTransition, useActionState, useState } from "react";
import { loginAction } from "../actions";
import type { FormState } from "../types";
import { buttonClass } from "@/components/ui/button-styles";
import { inputClass, labelClass } from "../styles";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    loginAction,
    null,
  );
  const [show, setShow] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="space-y-6"
    >
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <div className="flex">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="border border-l-0 border-ink px-4 text-[11px] uppercase tracking-[0.15em]"
            aria-pressed={show}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="border border-accent px-4 py-3 text-sm text-accent">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={`${buttonClass} w-full`}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
