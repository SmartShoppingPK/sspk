import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line py-12">
      <Container className="text-center">
        <nav aria-label="Legal">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em]">
            <li>
              <Link href="/disclosure" className="hover:text-accent">
                Affiliate disclosure
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-accent">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-accent">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>
        <p className="mx-auto mt-6 max-w-xl text-xs leading-5 text-muted">
          We earn a commission if you buy through our links, at no extra cost to
          you. Purchases happen on Daraz.
        </p>
        <p className="mt-4 text-xs text-muted">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
      </Container>
    </footer>
  );
}
