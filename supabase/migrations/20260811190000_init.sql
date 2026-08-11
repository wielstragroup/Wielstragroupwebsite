create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'user');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  client text not null,
  short_description text not null,
  description text not null,
  category text not null,
  image text not null,
  additional_images text[] not null default '{}',
  live_url text,
  date date not null,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_projects_published_date on public.projects(published, date desc);
create index if not exists idx_projects_featured on public.projects(featured) where featured = true;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.handle_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.prevent_unauthorized_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;

  return new;
end;
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;

create policy "profiles_self_read"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_self_update"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_admin_update"
on public.profiles
for update
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists prevent_unauthorized_role_change on public.profiles;
create trigger prevent_unauthorized_role_change
before update on public.profiles
for each row execute function public.prevent_unauthorized_role_change();

create policy "projects_public_read_published"
on public.projects
for select
using (published = true or public.is_admin());

create policy "projects_admin_all"
on public.projects
for all
using (public.is_admin())
with check (public.is_admin());

create policy "contact_insert_any"
on public.contact_messages
for insert
with check (true);

create policy "contact_admin_read"
on public.contact_messages
for select
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "project_images_public_read"
on storage.objects
for select
using (bucket_id = 'project-images');

create policy "project_images_admin_insert"
on storage.objects
for insert
with check (bucket_id = 'project-images' and public.is_admin());

create policy "project_images_admin_update"
on storage.objects
for update
using (bucket_id = 'project-images' and public.is_admin());

create policy "project_images_admin_delete"
on storage.objects
for delete
using (bucket_id = 'project-images' and public.is_admin());

insert into public.projects (
  title,
  slug,
  client,
  short_description,
  description,
  category,
  image,
  additional_images,
  live_url,
  date,
  featured,
  published
) values (
  'A La Regina',
  'a-la-regina',
  'A La Regina',
  'Website voor een lokale onderneming met focus op uitstraling en duidelijkheid.',
  'Website voor A La Regina met een rustige, professionele uitstraling en heldere call-to-actions voor nieuwe klanten.',
  'Webdesign',
  '/placeholders/alaregina-main.svg',
  array['/placeholders/alaregina-detail.svg'],
  'https://example.com',
  current_date,
  true,
  true
)
on conflict (slug) do nothing;
