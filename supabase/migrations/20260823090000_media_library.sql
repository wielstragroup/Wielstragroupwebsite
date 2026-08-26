-- Media library
-- Tabel `media`, usage-detectie op basis van storage_path, en de publieke
-- bucket `media`. De bestaande bucket `project-images` blijft ongemoeid.
-- Idempotent: veilig meerdere keren uit te voeren.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tabel
-- ---------------------------------------------------------------------------

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  extension text not null,
  size_bytes bigint not null,
  width integer,
  height integer,
  alt_text text not null default '',
  caption text,
  checksum text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint media_mime_type_allowed check (
    mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')
  ),
  constraint media_extension_allowed check (
    extension in ('jpg', 'png', 'webp', 'avif')
  ),
  constraint media_size_bytes_range check (
    size_bytes > 0 and size_bytes <= 10485760
  ),
  constraint media_storage_path_format check (
    storage_path ~ '^[0-9]{4}/[0-9]{2}/[0-9a-f-]{36}\.(jpg|png|webp|avif)$'
  ),
  constraint media_dimensions_positive check (
    (width is null or width > 0) and (height is null or height > 0)
  )
);

create index if not exists idx_media_created_at on public.media (created_at desc);
create index if not exists idx_media_active on public.media (deleted_at) where deleted_at is null;
create index if not exists idx_media_checksum on public.media (checksum) where deleted_at is null;
create index if not exists idx_media_mime_type on public.media (mime_type);

drop trigger if exists set_media_updated_at on public.media;
create trigger set_media_updated_at
before update on public.media
for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: uitsluitend admins. De publieke site leest deze tabel nooit; die
-- krijgt losse URL-strings uit de sectiecontent.
-- ---------------------------------------------------------------------------

alter table public.media enable row level security;

drop policy if exists "media_admin_select" on public.media;
create policy "media_admin_select"
on public.media
for select
using (public.is_admin());

drop policy if exists "media_admin_insert" on public.media;
create policy "media_admin_insert"
on public.media
for insert
with check (public.is_admin());

drop policy if exists "media_admin_update" on public.media;
create policy "media_admin_update"
on public.media
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "media_admin_delete" on public.media;
create policy "media_admin_delete"
on public.media
for delete
using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Helper: alle string-waarden uit een jsonb-structuur, met hun pad.
-- Wordt gebruikt door media_usage() zodat we niet alleen weten dát een
-- afbeelding ergens gebruikt wordt, maar ook in welk veld — zonder dat de
-- functie de sectieschema's hoeft te kennen.
-- ---------------------------------------------------------------------------

create or replace function public.jsonb_leaf_values(p_data jsonb, p_prefix text default '')
returns table (json_path text, leaf_value text)
language plpgsql
immutable
as $$
declare
  v_key text;
  v_value jsonb;
  v_index integer := 0;
begin
  if p_data is null then
    return;
  end if;

  case jsonb_typeof(p_data)
    when 'object' then
      for v_key, v_value in select key, value from jsonb_each(p_data) loop
        return query
        select *
        from public.jsonb_leaf_values(
          v_value,
          case when p_prefix = '' then v_key else p_prefix || '.' || v_key end
        );
      end loop;
    when 'array' then
      for v_value in select value from jsonb_array_elements(p_data) loop
        return query
        select *
        from public.jsonb_leaf_values(v_value, p_prefix || '[' || v_index || ']');
        v_index := v_index + 1;
      end loop;
    when 'string' then
      return query select p_prefix, p_data #>> '{}';
    else
      null;
  end case;
end;
$$;

-- ---------------------------------------------------------------------------
-- media_usage(): waar wordt dit bestand gebruikt?
--
-- Afgeleid uit de content in plaats van bijgehouden in een koppeltabel.
-- Geen synchronisatie, dus geen spookrijen of gemiste updates.
-- Security definer omdat de functie over meerdere tabellen leest; de
-- autorisatie gebeurt expliciet in het eerste statement.
-- ---------------------------------------------------------------------------

create or replace function public.media_usage(p_path text)
returns table (
  entity_type text,
  entity_id text,
  entity_label text,
  field text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  if p_path is null or btrim(p_path) = '' then
    return;
  end if;

  -- projects.image
  return query
  select
    'project'::text,
    p.id::text,
    p.title,
    'image'::text
  from public.projects p
  where p.image is not null
    and strpos(p.image, p_path) > 0;

  -- projects.additional_images
  return query
  select
    'project'::text,
    p.id::text,
    p.title,
    'additional_images[' || (a.ord - 1) || ']'
  from public.projects p
  cross join lateral unnest(p.additional_images) with ordinality as a(url, ord)
  where a.url is not null
    and strpos(a.url, p_path) > 0;

  -- home_sections.content (jsonb)
  if to_regclass('public.home_sections') is not null then
    return query
    select
      'home_section'::text,
      hs.id::text,
      coalesce(nullif(hs.admin_label, ''), hs.type::text),
      lv.json_path
    from public.home_sections hs
    cross join lateral public.jsonb_leaf_values(hs.content) lv
    where strpos(lv.leaf_value, p_path) > 0;
  end if;

  -- site_settings (hele rij generiek gescand, kolomonafhankelijk)
  if to_regclass('public.site_settings') is not null then
    return query
    select
      'site_setting'::text,
      'site_settings'::text,
      'Website-instellingen'::text,
      lv.json_path
    from public.site_settings s
    cross join lateral public.jsonb_leaf_values(to_jsonb(s)) lv
    where strpos(lv.leaf_value, p_path) > 0;
  end if;
end;
$$;

revoke all on function public.media_usage(text) from public;
grant execute on function public.media_usage(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: bucket `media`
-- Public read (CDN-caching + next/image), maar strikte poortcontrole:
-- alleen jpeg/png/webp/avif, max 10MB. Geen SVG, geen GIF.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media_bucket_public_read" on storage.objects;
create policy "media_bucket_public_read"
on storage.objects
for select
using (bucket_id = 'media');

drop policy if exists "media_bucket_admin_insert" on storage.objects;
create policy "media_bucket_admin_insert"
on storage.objects
for insert
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_bucket_admin_update" on storage.objects;
create policy "media_bucket_admin_update"
on storage.objects
for update
using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_bucket_admin_delete" on storage.objects;
create policy "media_bucket_admin_delete"
on storage.objects
for delete
using (bucket_id = 'media' and public.is_admin());
