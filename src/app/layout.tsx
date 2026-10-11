import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/source-sans-3";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description:
    "Hand-picked finds from Daraz. Every product links to Daraz, where you buy it.",
  openGraph: { siteName: siteConfig.name, type: "website" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-paper font-body text-ink antialiased">{children}</body>
    </html>
  );
}
