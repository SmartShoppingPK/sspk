export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "My Shop",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com",
  legalUpdated: "October 11, 2026",
};
