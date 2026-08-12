import type { Project } from "@/lib/types";
import { ImageUploader } from "@/app/admin/projects/_components/image-uploader";
import { MultiImageUploader } from "@/app/admin/projects/_components/multi-image-uploader";

type ProjectFormProps = {
  action: (formData: FormData) => Promise<void>;
  project?: Project;
  submitLabel: string;
};

export function ProjectForm({ action, project, submitLabel }: ProjectFormProps) {
  return (
    <form action={action} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
          <span>Projectnaam <span className="text-red-500">*</span></span>
          <input
            name="title"
            required
            defaultValue={project?.title}
            placeholder="bijv. Restaurant De Gouden Leeuw"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition focus:border-slate-900 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
          <span>URL Slug <span className="text-red-500">*</span></span>
          <input
            name="slug"
            required
            defaultValue={project?.slug}
            placeholder="bijv. restaurant-de-gouden-leeuw"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition focus:border-slate-900 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
          <span>Klant <span className="text-red-500">*</span></span>
          <input
            name="client"
            required
            defaultValue={project?.client}
            placeholder="bijv. De Gouden Leeuw B.V."
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition focus:border-slate-900 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
          <span>Categorie <span className="text-red-500">*</span></span>
          <input
            name="category"
            required
            defaultValue={project?.category}
            placeholder="bijv. Horeca, Huisstijl, Maatwerk"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition focus:border-slate-900 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900 sm:col-span-2">
          <span>Korte beschrijving <span className="text-red-500">*</span></span>
          <input
            name="shortDescription"
            required
            defaultValue={project?.shortDescription}
            placeholder="Korte samenvatting voor de projectkaart"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition focus:border-slate-900 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900 sm:col-span-2">
          <span>Volledige beschrijving <span className="text-red-500">*</span></span>
          <textarea
            name="description"
            required
            defaultValue={project?.description}
            rows={5}
            placeholder="Uitgebreide toelichting over het project..."
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition focus:border-slate-900 focus:outline-none"
          />
        </label>

        {/* HOOFDAFBEELDING DIRECT UPLOAD */}
        <div className="flex flex-col gap-2 text-sm font-semibold text-slate-900 sm:col-span-2 border-t border-slate-100 pt-6">
          <span>Hoofdafbeelding <span className="text-red-500">*</span></span>
          <ImageUploader defaultValue={project?.image ?? ""} name="image" />
        </div>

        {/* EXTRA AFBEELDINGEN MULTI UPLOAD */}
        <div className="flex flex-col gap-2 text-sm font-semibold text-slate-900 sm:col-span-2 border-t border-slate-100 pt-6">
          <span>Extra afbeeldingen</span>
          <MultiImageUploader defaultValue={project?.additionalImages ?? []} name="additionalImages" />
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
          <span>Live URL</span>
          <input
            name="liveUrl"
            defaultValue={project?.liveUrl ?? ""}
            placeholder="https://..."
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition focus:border-slate-900 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
          <span>Datum <span className="text-red-500">*</span></span>
          <input
            type="date"
            name="date"
            required
            defaultValue={project?.date ? project.date.slice(0, 10) : new Date().toISOString().slice(0, 10)}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition focus:border-slate-900 focus:outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-6">
        <label className="inline-flex items-center gap-2.5 text-sm font-medium text-slate-900 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={project?.featured}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <span>Uitgelicht op homepagina</span>
        </label>
        <label className="inline-flex items-center gap-2.5 text-sm font-medium text-slate-900 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            defaultChecked={project?.published}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <span>Gepubliceerd</span>
        </label>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-98"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
