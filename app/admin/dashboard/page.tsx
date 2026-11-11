import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const shortcuts = [
  {
    href: "/admin/settings",
    title: "Website-instellingen",
    description: "Bedrijfsgegevens, contact, socials, CTA en SEO-defaults.",
  },
  {
    href: "/admin/projects",
    title: "Projecten",
    description: "Projecten beheren en publiceren.",
  },
  {
    href: "/admin/media",
    title: "Mediabibliotheek",
    description: "Afbeeldingen bekijken, uploaden en verwijderen.",
  },
  {
    href: "/admin/contact",
    title: "Contactaanvragen",
    description: "Inkomende berichten via het contactformulier bekijken.",
  },
  {
    href: "/admin/analytics",
    title: "Analytics",
    description: "Bezoekstatistieken van de website bekijken.",
  },
  {
    href: "/admin/legal",
    title: "Juridische pagina's",
    description: "Privacybeleid, cookiebeleid, voorwaarden en disclaimer bewerken.",
  },
];

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [
    { count: total },
    { count: published },
    { count: drafts },
    { data: latest },
    { count: contactMessages },
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", false),
    supabase
      .from("projects")
      .select("id,title,published,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Dashboard
        </h1>
        <Link
          href="/admin/projects/new"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
        >
          + Nieuw project
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Projecten</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{total ?? 0}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Gepubliceerd</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{published ?? 0}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Concepten</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{drafts ?? 0}</p>
        </article>
        <Link
          href="/admin/contact"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <p className="text-sm text-slate-500">Contactaanvragen</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{contactMessages ?? 0}</p>
        </Link>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Snel naar</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {shortcuts.map((shortcut) => (
            <Link
              key={shortcut.href}
              href={shortcut.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-slate-900">
                {shortcut.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {shortcut.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Nieuwste projecten
          </h2>
          <Link href="/admin/projects" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Alle projecten →
          </Link>
        </div>
        {(latest ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Nog geen projecten.</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
            {(latest ?? []).map((project) => (
              <li key={project.id}>
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="truncate font-medium text-slate-800">{project.title}</span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      project.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {project.published ? "Gepubliceerd" : "Concept"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
