import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/app/admin/projects/_components/project-form";
import { updateProjectAction } from "@/app/admin/projects/actions";
import { getProjectById } from "@/lib/projects";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Project bewerken",
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;

  const project = await getProjectById(id);
  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Project bewerken</h1>
      {error ? <p className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-900">{error}</p> : null}
      <ProjectForm action={updateProjectAction} project={project} submitLabel="Wijzigingen opslaan" />
    </div>
  );
}
