-- Step 2: database, row-level security, image storage
-- Run once in Supabase Dashboard > SQL Editor.

-- ============ TABLES ============

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 200),
  description text check (char_length(description) <= 5000),
  image_url text,
  price numeric(10, 2) check (price >= 0),
  category_id uuid references public.categories (id) on delete set null,
  affiliate_url text not null check (affiliate_url ~ '^https://'),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clicks (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products (id) on delete cascade,
  utm_source text check (char_length(utm_source) <= 100),
  created_at timestamptz not null default now()
);

-- Who counts as admin. Filled manually after you create the admin user.
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create index products_category_idx on public.products (category_id);
create index products_published_idx on public.products (is_published, created_at desc);
create index clicks_product_idx on public.clicks (product_id, created_at desc);

-- ============ updated_at TRIGGER ============

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============ ADMIN CHECK ============

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- ============ ROW-LEVEL SECURITY ============

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.clicks enable row level security;
alter table public.admin_users enable row level security;

-- categories: public read, admin write
create policy "categories public read" on public.categories
  for select using (true);
create policy "categories admin write" on public.categories
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- products: public sees published only, admin sees and writes everything
create policy "products public read published" on public.products
  for select using (is_published = true or public.is_admin());
create policy "products admin write" on public.products
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- clicks: no public access at all. Inserts come from the server (service role,
-- which bypasses RLS). The admin panel may read counts.
create policy "clicks admin read" on public.clicks
  for select to authenticated using (public.is_admin());

-- admin_users: no policies = nobody can read or write via the API.
-- Only you, in the SQL editor.

-- ============ IMAGE STORAGE ============

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "product images public read" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "product images admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());
create policy "product images admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
create policy "product images admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
