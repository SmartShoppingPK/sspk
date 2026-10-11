export function formatPrice(price: number | null): string {
  if (price == null) return "";
  return `Rs ${Math.round(price).toLocaleString("en-PK")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
