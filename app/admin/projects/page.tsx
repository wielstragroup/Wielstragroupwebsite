import Link from "next/link";
import type { Metadata } from "next";

import {
  deleteProjectAction,
  toggleProjectAction,
  uploadImageAction,
} from "@/app/admin/projects/actions";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Portfolio beheer",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; uploaded?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { data: projects } = await supabase
    .from("projects")
    .select("id,title,category,published,featured,date")
    .order("date", { ascending: false });

  const { success, error, uploaded } = await searchParams;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Portfolio beheer</h1>
        <Link href="/admin/projects/new" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
          Nieuw project
        </Link>
      </div>

      {success ? <p className="rounded-xl bg-emerald-100 px-4 py-2 text-sm text-emerald-900">{success}</p> : null}
      {error ? <p className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-900">{error}</p> : null}
      {uploaded ? (
        <p className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-800 break-all">
          Geüpload: <span className="font-medium">{uploaded}</span>
        </p>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Afbeelding uploaden</h2>
        <form action={uploadImageAction} className="mt-3 flex flex-wrap items-center gap-3">
          <input type="file" name="image" accept="image/png,image/jpeg,image/webp,image/svg+xml" required className="text-sm" />
          <button type="submit" className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
            Upload
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Categorie</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(projects ?? []).map((project) => (
              <tr key={project.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{project.title}</td>
                <td className="px-4 py-3 text-slate-700">{project.category}</td>
                <td className="px-4 py-3 text-slate-700">
                  {project.published ? "Gepubliceerd" : "Concept"}
                  {project.featured ? " • Uitgelicht" : ""}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/projects/${project.id}/edit`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100">
                      Bewerken
                    </Link>
                    <form action={toggleProjectAction}>
                      <input type="hidden" name="id" value={project.id} />
                      <input type="hidden" name="key" value="published" />
                      <input type="hidden" name="value" value={project.published ? "false" : "true"} />
                      <button type="submit" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100">
                        {project.published ? "Depubliceer" : "Publiceer"}
                      </button>
                    </form>
                    <form action={toggleProjectAction}>
                      <input type="hidden" name="id" value={project.id} />
                      <input type="hidden" name="key" value="featured" />
                      <input type="hidden" name="value" value={project.featured ? "false" : "true"} />
                      <button type="submit" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100">
                        {project.featured ? "Niet uitgelicht" : "Uitlichten"}
                      </button>
                    </form>
                    <form action={deleteProjectAction}>
                      <input type="hidden" name="id" value={project.id} />
                      <button type="submit" className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50">
                        Verwijderen
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
