import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        This page explains what {siteConfig.name} collects when you visit.
        Short version: very little.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>
          There are no visitor accounts. We do not ask for your name or email.
        </li>
        <li>
          When you click a product link, we record an anonymous click (which
          product, when, and the campaign source if the link has one). We do not
          store your name, email or IP address with it.
        </li>
        <li>
          If analytics are turned on, we see basic anonymous visit statistics.
        </li>
      </ul>
      <h2>Cookies</h2>
      <p>
        We only use essential cookies needed to run the site. Visitors do not
        get tracking cookies from us.
      </p>
      <h2>Other companies</h2>
      <p>
        Links take you to Daraz, and visitors often arrive from Pinterest. The
        site runs on services such as Vercel and Supabase. These companies have
        their own privacy policies, which apply when you use their services.
      </p>
      <h2>We do not sell personal data</h2>
      <p>We do not sell or rent personal data to anyone.</p>
      <h2>Children</h2>
      <p>This site is not directed at children under 13.</p>
      <h2>Your questions</h2>
      <p>
        To ask about data or privacy, email{" "}
        <a className="underline underline-offset-4" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        .
      </p>
      <h2>Changes</h2>
      <p>
        We may update this policy. The date at the top shows the latest version.
      </p>
    </LegalPage>
  );
}
