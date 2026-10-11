"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

type NavCategory = { name: string; slug: string };

const smallCaps = "text-[11px] uppercase tracking-[0.12em] md:tracking-[0.2em]";

export function SiteHeader({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-10">
        <div>
          <button
            type="button"
            className={`${smallCaps} md:hidden`}
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            Menu
          </button>
          <form action="/search" role="search" className="hidden md:block">
            <label htmlFor="header-search" className="sr-only">
              Search products
            </label>
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="SEARCH"
              className="w-44 border-0 border-b border-ink bg-transparent pb-1 text-[11px] uppercase tracking-[0.2em] outline-none placeholder:text-muted focus-visible:border-accent"
            />
          </form>
        </div>

        <Link href="/" className="whitespace-nowrap text-center font-heading text-[17px] sm:text-xl md:text-2xl">
          {siteConfig.name}
        </Link>

        <div className={`flex justify-end gap-6 ${smallCaps}`}>
          <Link href="/search" className="md:hidden">
            Search
          </Link>
          <Link href="/products" className="hidden hover:text-accent md:inline">
            All products
          </Link>
        </div>
      </div>

      {categories.length > 0 && (
        <nav aria-label="Categories" className="hidden border-t border-line md:block">
          <ul className="mx-auto flex max-w-[1400px] flex-wrap justify-center gap-8 px-10 py-3 text-[12px] uppercase tracking-[0.12em]">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-accent">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 overflow-y-auto bg-paper px-5 py-5"
        >
          <div className="flex items-center justify-between">
            <span className="font-heading text-2xl">{siteConfig.name}</span>
            <button
              type="button"
              className={smallCaps}
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <ul className="mt-10 space-y-6 text-[14px] uppercase tracking-[0.15em]">
            <li>
              <Link href="/products" onClick={() => setOpen(false)}>
                All products
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} onClick={() => setOpen(false)}>
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/search" onClick={() => setOpen(false)}>
                Search
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
