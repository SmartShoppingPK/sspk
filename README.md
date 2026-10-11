# Affiliate shop

Next.js 15 + Tailwind 4 + Supabase. Products link to Daraz through /go/[slug], which counts the click first.

## Run it

1. Copy `.env.example` to `.env.local` and fill it in (Supabase URL, anon key, service role key).
2. In the Supabase SQL editor, run `supabase/migrations/0001_init.sql`, then `0002_click_stats.sql`.
3. `npm install`
4. `npm run dev` and open http://localhost:3000
5. Sign in at http://localhost:3000/admin/login

## Where things live

- `src/app/(site)/` public pages
- `src/app/admin/` login (`login/`) and the admin panel (`(panel)/`)
- `src/app/go/[slug]/route.ts` click counting and redirect to Daraz
- `src/features/products/` product queries and cards
- `src/features/admin/` admin actions, forms, auth check
- `src/components/` shared layout pieces and button styles
- `src/lib/` Supabase clients, rate limiter, site config
- `supabase/migrations/` database setup
