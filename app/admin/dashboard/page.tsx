import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { getAllHomeSections } from "@/lib/sections/data";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const shortcuts = [
  {
    href: "/admin/home",
    title: "Homepagina",
    description: "Secties toevoegen, verplaatsen, tonen of verbergen.",
  },
  {
    href: "/admin/settings",
    title: "Website-instellingen",
    description: "Bedrijfsgegevens, contact, socials, CTA en SEO-defaults.",
  },
  {
    href: "/admin/projects",
    title: "Portfolio",
    description: "Projecten beheren en publiceren.",
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
    sections,
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", false),
    supabase
      .from("projects")
      .select("id,title,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
    getAllHomeSections(),
  ]);

  const visibleSections = sections.filter((section) => section.enabled).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        Dashboard
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Zichtbare secties</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {visibleSections}
            <span className="text-base font-normal text-slate-400">
              {" "}
              / {sections.length}
            </span>
          </p>
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
        <h2 className="text-lg font-semibold text-slate-900">
          Nieuwste projecten
        </h2>
        {(latest ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Nog geen projecten.</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {(latest ?? []).map((project) => (
              <li
                key={project.id}
                className="rounded-lg border border-slate-200 px-3 py-2"
              >
                {project.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
