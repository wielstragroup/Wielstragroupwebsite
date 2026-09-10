import type { Metadata } from "next";

import { createProjectAction } from "@/app/admin/projects/actions";
import { ProjectForm } from "@/app/admin/projects/_components/project-form";
import { StatusMessage } from "@/components/admin/form-fields";
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
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Nieuw project</h1>
        <p className="mt-1 text-sm text-slate-600">Vul de gegevens hieronder in. Velden met * zijn verplicht.</p>
      </div>
      <StatusMessage error={error} />
      <ProjectForm action={createProjectAction} submitLabel="Project opslaan" />
    </div>
  );
}
