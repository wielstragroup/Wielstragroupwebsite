import type { Project } from "@/lib/types";

type ProjectFormProps = {
  action: (formData: FormData) => Promise<void>;
  project?: Project;
  submitLabel: string;
};

export function ProjectForm({ action, project, submitLabel }: ProjectFormProps) {
  return (
    <form action={action} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Projectnaam
          <input name="title" required defaultValue={project?.title} className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Slug
          <input name="slug" required defaultValue={project?.slug} className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Klant
          <input name="client" required defaultValue={project?.client} className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Categorie
          <input name="category" required defaultValue={project?.category} className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
          Korte beschrijving
          <input name="shortDescription" required defaultValue={project?.shortDescription} className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
          Volledige beschrijving
          <textarea
            name="description"
            required
            defaultValue={project?.description}
            rows={5}
            className="rounded-xl border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Hoofdafbeelding URL
          <input name="image" required defaultValue={project?.image} className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Live URL
          <input name="liveUrl" defaultValue={project?.liveUrl ?? ""} className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Datum
          <input type="date" name="date" required defaultValue={project?.date.slice(0, 10)} className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
          Extra afbeeldingen (één URL per regel)
          <textarea
            name="additionalImages"
            defaultValue={project?.additionalImages.join("\n")}
            rows={4}
            className="rounded-xl border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} /> Uitgelicht
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="published" defaultChecked={project?.published} /> Gepubliceerd
        </label>
      </div>

      <button type="submit" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
        {submitLabel}
      </button>
    </form>
  );
}
