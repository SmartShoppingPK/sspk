import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-16 md:py-24">
      <article className="mx-auto max-w-2xl">
        <h1 className="font-heading text-4xl md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted">
          Last updated: {siteConfig.legalUpdated}
        </p>
        <div className="mt-10 space-y-4 text-[15px] leading-7 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-2xl [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </Container>
  );
}
