-- Click counts for the admin product list.
-- Run once in Supabase Dashboard > SQL Editor, after 0001_init.sql.
-- Returns nothing unless the caller is the admin.

create or replace function public.product_click_stats()
returns table (product_id uuid, total bigint, last7 bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.product_id,
    count(*)::bigint as total,
    (count(*) filter (where c.created_at > now() - interval '7 days'))::bigint as last7
  from public.clicks c
  where public.is_admin()
  group by c.product_id;
$$;
