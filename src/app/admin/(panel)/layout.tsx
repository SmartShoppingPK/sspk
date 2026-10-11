import Link from "next/link";
import { requireAdmin } from "@/features/admin/require-admin";
import { logoutAction } from "@/features/admin/actions";
import { buttonGhostClass } from "@/components/ui/button-styles";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <nav className="flex flex-wrap gap-6 text-[12px] font-semibold uppercase tracking-[0.12em]">
            <Link href="/admin/products" className="hover:text-accent">
              Products
            </Link>
            <Link href="/admin/products/new" className="hover:text-accent">
              Add product
            </Link>
            <Link href="/admin/categories" className="hover:text-accent">
              Categories
            </Link>
            <a href="/" target="_blank" rel="noopener" className="hover:text-accent">
              View site
            </a>
          </nav>
          <form action={logoutAction} className="flex items-center gap-4 text-xs text-muted">
            <span>{user.email}</span>
            <button type="submit" className={buttonGhostClass}>
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </>
  );
}
