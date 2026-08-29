-- Privacyvriendelijke, cookieloze paginabezoeken-teller.
-- visitor_hash is een dagelijks roterende hash (ip + user-agent + salt),
-- zodat bezoekers nooit over meerdere dagen herleidbaar zijn en er geen
-- IP-adres wordt opgeslagen.
create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  visitor_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_page_views_created_at on public.page_views(created_at desc);
create index if not exists idx_page_views_path on public.page_views(path);

alter table public.page_views enable row level security;

create policy "page_views_insert_any"
on public.page_views
for insert
with check (true);

create policy "page_views_admin_read"
on public.page_views
for select
using (public.is_admin());
