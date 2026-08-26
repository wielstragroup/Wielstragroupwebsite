-- =====================================================================
-- Modulair CMS: globale website-instellingen + homepagina-secties
--
-- Hergebruikt bestaande helpers uit 20260811190000_init.sql:
--   public.is_admin()            - rolcontrole
--   public.handle_updated_at()   - updated_at trigger
--
-- Deze migratie is idempotent (if not exists / drop policy if exists)
-- zodat hij veilig opnieuw uitgevoerd kan worden.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. site_settings
--
-- Singleton-tabel: precies één rij. De check-constraint op id dwingt
-- af dat er nooit een tweede rij ontstaat, zodat de applicatie altijd
-- deterministisch dezelfde rij leest.
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id boolean primary key default true,

  -- Bedrijfsidentiteit
  company_name text not null default 'Wielstra Group',
  logo_url text not null default '',
  favicon_url text not null default '',

  -- Contactgegevens (centraal, overal hergebruikt)
  email text not null default '',
  phone text not null default '',
  whatsapp_url text not null default '',
  address text not null default '',
  copyright_text text not null default '',

  -- Globale standaard-CTA
  cta_label text not null default 'Bespreek je project',
  cta_url text not null default '/contact',

  -- SEO-defaults (fallback voor pagina's zonder eigen waarden)
  default_seo_title text not null default '',
  default_meta_description text not null default '',
  default_og_image text not null default '',

  -- Contactformulier-instellingen
  contact_form_enabled boolean not null default true,
  contact_form_recipient text not null default '',
  contact_form_subject text not null default 'Nieuw contactformulier',
  contact_form_success_message text not null default 'Bedankt! Je bericht is ontvangen.',
  contact_form_error_message text not null default 'Er ging iets mis. Probeer het later opnieuw.',

  -- Social links als jsonb: [{ platform, url, enabled }]
  -- jsonb omdat het een korte, altijd samen gelezen lijst is; een
  -- aparte tabel zou hier alleen extra joins opleveren.
  socials jsonb not null default '[]'::jsonb,

  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,

  constraint site_settings_singleton check (id is true),
  constraint site_settings_socials_is_array check (jsonb_typeof(socials) = 'array')
);

comment on table public.site_settings is
  'Singleton met globale website-instellingen. Altijd exact één rij (id = true).';


-- ---------------------------------------------------------------------
-- 2. home_sections
--
-- Modulaire secties van de homepagina. Elk sectietype bepaalt welke
-- velden in `content` betekenis hebben; de applicatie valideert dat
-- met Zod per type.
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'section_type') then
    create type public.section_type as enum (
      'hero',
      'services',
      'portfolio',
      'usp',
      'testimonials',
      'text',
      'image_text',
      'cta',
      'faq',
      'contact'
    );
  end if;
end
$$;

create table if not exists public.home_sections (
  id uuid primary key default gen_random_uuid(),
  type public.section_type not null,

  -- Sorteervolgorde. Lager = hoger op de pagina.
  position integer not null default 0,

  -- Zichtbaarheid op de publieke site.
  enabled boolean not null default true,

  -- Interne naam in het dashboard, zodat je twee 'text'-secties
  -- uit elkaar kunt houden.
  admin_label text not null default '',

  -- Typespecifieke inhoud. Gevalideerd in de applicatielaag.
  content jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint home_sections_content_is_object check (jsonb_typeof(content) = 'object'),
  constraint home_sections_position_positive check (position >= 0)
);

comment on table public.home_sections is
  'Modulaire secties van de homepagina, gesorteerd op position.';

-- Index voor de publieke query: alleen ingeschakelde secties op volgorde.
create index if not exists idx_home_sections_enabled_position
  on public.home_sections (position)
  where enabled = true;

-- Index voor het dashboard: alle secties op volgorde.
create index if not exists idx_home_sections_position
  on public.home_sections (position);


-- ---------------------------------------------------------------------
-- 3. updated_at triggers
-- ---------------------------------------------------------------------
drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.handle_updated_at();

drop trigger if exists set_home_sections_updated_at on public.home_sections;
create trigger set_home_sections_updated_at
before update on public.home_sections
for each row execute function public.handle_updated_at();


-- ---------------------------------------------------------------------
-- 4. Row Level Security
--
-- Lezen: iedereen (de site moet de instellingen server-side kunnen
--        ophalen met de anon key).
-- Schrijven: alleen admins, via public.is_admin().
--
-- Let op: er is bewust GEEN insert/delete-policy op site_settings.
-- De rij wordt door deze migratie aangemaakt en mag niet verdwijnen.
-- ---------------------------------------------------------------------
alter table public.site_settings enable row level security;
alter table public.home_sections enable row level security;

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
on public.site_settings
for select
using (true);

drop policy if exists "site_settings_admin_update" on public.site_settings;
create policy "site_settings_admin_update"
on public.site_settings
for update
using (public.is_admin())
with check (public.is_admin());

-- Publiek leest alleen ingeschakelde secties. Admins zien alles,
-- zodat uitgeschakelde secties in het dashboard zichtbaar blijven.
drop policy if exists "home_sections_public_read" on public.home_sections;
create policy "home_sections_public_read"
on public.home_sections
for select
using (enabled = true or public.is_admin());

drop policy if exists "home_sections_admin_all" on public.home_sections;
create policy "home_sections_admin_all"
on public.home_sections
for all
using (public.is_admin())
with check (public.is_admin());


-- ---------------------------------------------------------------------
-- 5. Seed
--
-- De singleton-rij aanmaken en de homepagina vullen met de secties
-- die nu hardcoded in app/page.tsx staan. Daardoor ziet de site er na
-- deze migratie hetzelfde uit als ervoor.
-- ---------------------------------------------------------------------
insert into public.site_settings (id)
values (true)
on conflict (id) do nothing;

insert into public.home_sections (type, position, enabled, admin_label, content)
select * from (values
  (
    'hero'::public.section_type, 0, true, 'Hero',
    jsonb_build_object(
      'badge', 'Wielstra Group • Webdesign & Development',
      'title', 'Een website die jouw bedrijf serieus laat zien.',
      'highlight', 'serieus',
      'subtitle', 'Voor lokale ondernemers die professioneel zichtbaar willen zijn. Met heldere communicatie, korte lijnen en een persoonlijke aanpak van idee tot livegang.',
      'primaryCtaLabel', 'Bespreek je project',
      'primaryCtaUrl', '/contact',
      'secondaryCtaLabel', 'Bekijk ons werk',
      'secondaryCtaUrl', '/portfolio',
      'desktopImage', '',
      'desktopImageAlt', '',
      'mobileImage', '',
      'mobileImageAlt', ''
    )
  ),
  (
    'services'::public.section_type, 1, true, 'Diensten',
    jsonb_build_object(
      'eyebrow', 'Diensten',
      'title', 'Praktische ondersteuning voor jouw online uitstraling',
      'text', 'Geen overbodige pakketten, maar heldere diensten afgestemd op jouw onderneming.',
      'theme', 'light',
      'items', jsonb_build_array(
        jsonb_build_object(
          'title', 'Website bouwen',
          'subtitle', 'Een gloednieuwe online basis voor jouw onderneming',
          'description', 'Een moderne, snelle website die volledig aansluit op jouw bedrijf, doelgroep en doelstellingen.',
          'ctaLabel', 'Meer over website bouwen',
          'ctaUrl', '/diensten#bouwen',
          'highlights', jsonb_build_array('Uniek ontwerp op maat', 'Mobiel geoptimaliseerd', 'Helder & overzichtelijk')
        ),
        jsonb_build_object(
          'title', 'Website verbeteren',
          'subtitle', 'Vernieuwing en optimalisatie van je bestaande website',
          'description', 'Het moderniseren van een verouderde website voor een frisse uitstraling en beter gebruiksgemak.',
          'ctaLabel', 'Meer over website verbeteren',
          'ctaUrl', '/diensten#verbeteren',
          'highlights', jsonb_build_array('Modern design', 'Snellere laadtijden', 'Hogere conversie')
        ),
        jsonb_build_object(
          'title', 'Website onderhoud',
          'subtitle', 'Zorgeloos technisch beheer en ondersteuning',
          'description', 'Doorlopende ondersteuning zodat jouw website veilig, actueel en optimaal bereikbaar blijft.',
          'ctaLabel', 'Meer over website onderhoud',
          'ctaUrl', '/diensten#onderhoud',
          'highlights', jsonb_build_array('Periodieke updates', 'Veilige hosting & beheer', 'Korte communicatielijnen')
        ),
        jsonb_build_object(
          'title', 'Online zichtbaarheid',
          'subtitle', 'Helder gevonden worden door de juiste doelgroep',
          'description', 'Een sterke structuur en zoekmachinebasis voor betere online vindbaarheid van je diensten.',
          'ctaLabel', 'Meer over online zichtbaarheid',
          'ctaUrl', '/diensten#zichtbaarheid',
          'highlights', jsonb_build_array('SEO-basisinrichting', 'Duidelijke websitestructuur', 'Lokale vindbaarheid')
        )
      )
    )
  ),
  (
    'usp'::public.section_type, 2, true, 'Waarom Wielstra Group',
    jsonb_build_object(
      'eyebrow', 'Samenwerken',
      'title', 'Waarom bedrijven voor Wielstra Group kiezen',
      'text', 'Geen ingewikkelde bureau-overlegstructuren, maar direct en persoonlijk contact.',
      'theme', 'dark',
      'items', jsonb_build_array(
        jsonb_build_object('label', 'PERSOONLIJK', 'title', 'Direct contact', 'description', 'Je hebt direct contact en kunt snel schakelen met de ontwikkelaar zelf. Geen wisselende projectmanagers.'),
        jsonb_build_object('label', 'OP MAAT', 'title', 'Afgestemd op jou', 'description', 'Geen standaardwebsite die toevallig bij je bedrijf moet passen, maar maatwerk gericht op jouw doelgroep.'),
        jsonb_build_object('label', 'DUIDELIJK', 'title', 'Helder & Begrijpelijk', 'description', 'Een website die bezoekers binnen enkele seconden laat begrijpen wat je doet en wat je te bieden hebt.'),
        jsonb_build_object('label', 'MEEDENKEND', 'title', 'Proactief meedenken', 'description', 'Niet alleen uitvoeren wat je vraagt, maar ook proactief meedenken over slimme keuzes en een beter resultaat.')
      )
    )
  ),
  (
    'portfolio'::public.section_type, 3, true, 'Recent werk',
    jsonb_build_object(
      'eyebrow', 'Portfolio',
      'title', 'Recent werk',
      'text', 'Een selectie van websites die ik heb gemaakt voor ondernemers.',
      'theme', 'light',
      'limit', 3,
      'ctaLabel', 'Bekijk alle projecten',
      'ctaUrl', '/portfolio',
      'emptyText', 'Er zijn op dit moment geen uitgelichte projecten beschikbaar.'
    )
  ),
  (
    'cta'::public.section_type, 4, true, 'Afsluitende CTA',
    jsonb_build_object(
      'title', 'Klaar om je bedrijf online sterker neer te zetten?',
      'text', 'Laten we bespreken wat je nodig hebt. Neem gerust contact op voor een kennismaking.',
      'theme', 'dark',
      'ctaLabel', '',
      'ctaUrl', ''
    )
  )
) as seed(type, position, enabled, admin_label, content)
where not exists (select 1 from public.home_sections);
