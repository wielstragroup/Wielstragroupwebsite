# Wielstra Group Website & CMS

Professionele Next.js website met portfolio-CMS voor Wielstra Group.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage)
- Vercel-ready deployment

## Features

- Publieke pagina's: `/`, `/diensten`, `/portfolio`, `/portfolio/[slug]`, `/over`, `/contact`
- Portfolio volledig database-gedreven (geen hardcoded items in frontend)
- Beveiligd admin dashboard:
  - `/admin/login`
  - `/admin/dashboard`
  - `/admin/projects`
  - `/admin/projects/new`
  - `/admin/projects/[id]/edit`
- CRUD voor projecten incl. publiceren/uitlichten
- Afbeelding-upload naar Supabase Storage met type/size-validatie
- Contactformulier met server-side validatie en eenvoudige anti-spam honeypot
- SEO: metadata, OG/Twitter, sitemap, robots

## Installatie

```bash
npm install
```

## Environment variables

Kopieer `.env.example` naar `.env.local`.

```bash
cp .env.example .env.local
```

Vul minimaal in:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (alleen server-side nodig voor beheerwerkflows)

## Supabase instellen

1. Maak een nieuw Supabase project.
2. Voer de SQL-migratie uit uit:
   - `supabase/migrations/20260811190000_init.sql`
3. Controleer dat bucket `project-images` bestaat (migratie maakt deze aan).
4. Maak een admin user aan via Supabase Auth.
5. Geef de user adminrechten:

```sql
insert into public.profiles (id, role)
values ('<auth_user_uuid>', 'admin')
on conflict (id) do update set role = 'admin';
```

## Lokaal draaien

```bash
npm run dev
```

Ga naar `http://localhost:3000`.

## Build & lint

```bash
npm run lint
npm run build
```

## Seed/demo project

De migratie seedt standaard project **A La Regina**. Dit project is daarna volledig te beheren via het dashboard (aanpassen, verwijderen, publiceren).

## Deploy naar Vercel

1. Verbind repository met Vercel.
2. Zet alle environment variables in Vercel Project Settings.
3. Deploy.

## Security-notes

- Admin routes worden server-side beschermd via auth + role-check.
- RLS policies beperken writes tot admins.
- Geen plaintext wachtwoorden of hardcoded secrets in code.
- Uploads accepteren alleen toegestane bestandstypen met maximumgrootte.
