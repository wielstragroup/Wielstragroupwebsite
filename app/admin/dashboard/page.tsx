import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [{ count: total }, { count: published }, { count: drafts }, { data: latest }] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", false),
    supabase.from("projects").select("id,title,created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
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
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Nieuwste projecten</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {(latest ?? []).map((project) => (
            <li key={project.id} className="rounded-lg border border-slate-200 px-3 py-2">
              {project.title}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
