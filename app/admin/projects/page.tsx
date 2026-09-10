import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { deleteProjectAction, toggleProjectAction } from "@/app/admin/projects/actions";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Projecten",
  robots: { index: false, follow: false },
};

function formatDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(date);
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { data: projects } = await supabase
    .from("projects")
    .select("id,title,client,category,published,featured,date,image")
    .order("date", { ascending: false });

  const { success, error } = await searchParams;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Projecten</h1>
          <p className="mt-1 text-sm text-slate-600">Beheer je portfolio: toevoegen, bewerken, publiceren of verwijderen.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
        >
          + Nieuw project
        </Link>
      </div>

      {success ? <p className="rounded-xl bg-emerald-100 px-4 py-2 text-sm text-emerald-900">{success}</p> : null}
      {error ? <p className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-900">{error}</p> : null}

      {(projects ?? []).length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm font-medium text-slate-700">Er staat nog geen project in het portfolio.</p>
          <p className="mt-1 text-sm text-slate-500">Klik op &ldquo;+ Nieuw project&rdquo; om te beginnen.</p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Klant</th>
                  <th className="px-4 py-3">Categorie</th>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(projects ?? []).map((project) => (
                  <tr key={project.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                          {project.image ? (
                            <Image
                              src={project.image}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">{project.title}</p>
                          {project.featured ? (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                              Uitgelicht
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{project.client}</td>
                    <td className="px-4 py-3 text-slate-700">{project.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-700">{formatDate(project.date)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          project.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {project.published ? "Gepubliceerd" : "Concept"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Bewerken
                        </Link>
                        <form action={toggleProjectAction}>
                          <input type="hidden" name="id" value={project.id} />
                          <input type="hidden" name="key" value="published" />
                          <input type="hidden" name="value" value={project.published ? "false" : "true"} />
                          <button
                            type="submit"
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            {project.published ? "Depubliceren" : "Publiceren"}
                          </button>
                        </form>
                        <form action={toggleProjectAction}>
                          <input type="hidden" name="id" value={project.id} />
                          <input type="hidden" name="key" value="featured" />
                          <input type="hidden" name="value" value={project.featured ? "false" : "true"} />
                          <button
                            type="submit"
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            {project.featured ? "Niet uitlichten" : "Uitlichten"}
                          </button>
                        </form>
                        <form action={deleteProjectAction}>
                          <input type="hidden" name="id" value={project.id} />
                          <ConfirmSubmitButton
                            confirmMessage={`Weet je zeker dat je "${project.title}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`}
                            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                          >
                            Verwijderen
                          </ConfirmSubmitButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
