import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Affiliate disclosure" };

export default function DisclosurePage() {
  return (
    <LegalPage title="Affiliate disclosure">
      <p>
        {siteConfig.name} participates in the Daraz affiliate program. This
        means we earn a commission if you click a link on this site and buy
        something on Daraz.
      </p>
      <h2>What this means for you</h2>
      <ul>
        <li>You pay the same price. The commission comes from Daraz, not from you.</li>
        <li>We only list products we choose ourselves.</li>
        <li>
          Prices and availability are set by Daraz and can change at any time.
          Always check the price on Daraz before you buy.
        </li>
        <li>Purchases, delivery and returns are handled by Daraz and its sellers.</li>
      </ul>
      <h2>Questions</h2>
      <p>
        Email us at{" "}
        <a className="underline underline-offset-4" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
