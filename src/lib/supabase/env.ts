export function supabaseUrl(): string {
  const v = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!v) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  return v;
}

export function supabaseAnonKey(): string {
  const v =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!v) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  return v;
}

export function supabaseServiceKey(): string {
  const v =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!v) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
  return v;
}
