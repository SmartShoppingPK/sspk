import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { createServiceClient } from "@/lib/supabase/service";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const BOT_PATTERN =
  /bot|crawler|spider|crawling|slurp|preview|headless|facebookexternalhit|curl|wget|python-requests/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const toProducts = () =>
    NextResponse.redirect(new URL("/products", request.url), 302);

  let product: { id: string; affiliate_url: string } | null = null;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("products")
      .select("id, affiliate_url")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    product = data;
  } catch (e) {
    console.error("go route lookup failed", e);
  }

  if (!product) return toProducts();

  // Count the click, but never block the redirect if counting fails.
  try {
    const userAgent = request.headers.get("user-agent") ?? "";
    const ip = clientIp(request.headers);
    const countable =
      !BOT_PATTERN.test(userAgent) &&
      rateLimit(`click:${ip}:${product.id}`, 3, 60 * 60 * 1000);

    if (countable) {
      const utm =
        new URL(request.url).searchParams.get("utm_source")?.slice(0, 100) ?? null;
      const service = createServiceClient();
      const { error } = await service
        .from("clicks")
        .insert({ product_id: product.id, utm_source: utm });
      if (error) console.error("click insert failed", error);
    }
  } catch (e) {
    console.error("click tracking failed", e);
  }

  return NextResponse.redirect(product.affiliate_url, 302);
}
