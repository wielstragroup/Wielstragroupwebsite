import type { Metadata } from "next";

import { createProjectAction } from "@/app/admin/projects/actions";
import { ProjectForm } from "@/app/admin/projects/_components/project-form";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Nieuw project",
  robots: { index: false, follow: false },
};

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Nieuw project</h1>
      {error ? <p className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-900">{error}</p> : null}
      <ProjectForm action={createProjectAction} submitLabel="Project opslaan" />
    </div>
  );
}
