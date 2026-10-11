"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "cookie-notice-accepted";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // ignore
    }
    setShow(false);
  }

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-4 text-sm md:flex-row md:items-center md:justify-between md:px-10">
        <p>
          We only use essential cookies and anonymous click counts to see which
          products are popular. See our{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            privacy page
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="self-start border border-ink px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-ink hover:text-paper md:self-auto"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
