import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Terms of use" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use">
      <p>
        By using {siteConfig.name} you agree to these terms. If you do not
        agree, please do not use the site.
      </p>
      <h2>General information only</h2>
      <p>
        This site is for general information. Product details and prices may be
        out of date, so check Daraz before you buy.
      </p>
      <h2>Purchases happen on Daraz</h2>
      <p>
        We do not sell products or take payments. When you click Buy on Daraz,
        you leave this site and any purchase is governed by Daraz&apos;s own
        terms. We are not responsible for third-party sites, sellers or
        products.
      </p>
      <h2>No warranties</h2>
      <p>
        The site is provided as it is, without warranties of any kind. We do
        not promise that it will always be available or free of errors.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the extent allowed by law, we are not liable for any loss or damage
        that comes from using this site or from purchases made on other sites.
      </p>
      <h2>Intellectual property</h2>
      <p>
        The text and design of this site belong to us. Product images and names
        belong to their respective owners.
      </p>
      <h2>Changes</h2>
      <p>
        We may change these terms at any time. The date at the top shows when
        they were last updated.
      </p>
      <h2>Contact</h2>
      <p>
        Email{" "}
        <a className="underline underline-offset-4" href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
