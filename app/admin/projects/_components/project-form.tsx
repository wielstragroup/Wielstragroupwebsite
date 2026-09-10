import type { Project } from "@/lib/types";
import { ImageUploader } from "@/app/admin/projects/_components/image-uploader";
import { MultiImageUploader } from "@/app/admin/projects/_components/multi-image-uploader";
import { CheckboxField, FormSection, TextAreaField, TextField } from "@/components/admin/form-fields";

type ProjectFormProps = {
  action: (formData: FormData) => Promise<void>;
  project?: Project;
  submitLabel: string;
};

export function ProjectForm({ action, project, submitLabel }: ProjectFormProps) {
  return (
    <form action={action} className="space-y-5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <FormSection
        title="Basisinformatie"
        description="De kerngegevens van het project."
      >
        <TextField
          name="title"
          label="Projectnaam"
          defaultValue={project?.title}
          required
          placeholder="bijv. Restaurant De Gouden Leeuw"
        />
        <TextField
          name="slug"
          label="URL Slug"
          defaultValue={project?.slug}
          required
          placeholder="bijv. restaurant-de-gouden-leeuw"
          hint="Wordt gebruikt in de webadres van de projectpagina."
        />
        <TextField
          name="client"
          label="Klant"
          defaultValue={project?.client}
          required
          placeholder="bijv. De Gouden Leeuw B.V."
        />
        <TextField
          name="category"
          label="Categorie"
          defaultValue={project?.category}
          required
          placeholder="bijv. Horeca, Huisstijl, Maatwerk"
        />
        <TextField
          name="shortDescription"
          label="Korte beschrijving"
          defaultValue={project?.shortDescription}
          required
          full
          placeholder="Korte samenvatting voor de projectkaart"
        />
        <TextAreaField
          name="description"
          label="Volledige beschrijving"
          defaultValue={project?.description}
          rows={5}
          placeholder="Uitgebreide toelichting over het project..."
        />
      </FormSection>

      <FormSection
        title="Afbeeldingen"
        description="Hoofdafbeelding is verplicht; extra afbeeldingen zijn optioneel."
      >
        <div className="sm:col-span-2 space-y-2">
          <span className="text-sm font-medium text-slate-800">
            Hoofdafbeelding <span className="text-red-600">*</span>
          </span>
          <ImageUploader defaultValue={project?.image ?? ""} name="image" />
        </div>

        <div className="sm:col-span-2 space-y-2 border-t border-slate-100 pt-5">
          <span className="text-sm font-medium text-slate-800">Extra afbeeldingen</span>
          <MultiImageUploader defaultValue={project?.additionalImages ?? []} name="additionalImages" />
        </div>
      </FormSection>

      <FormSection
        title="Publicatie"
        description="Bepaalt of en hoe het project op de website verschijnt."
      >
        <TextField
          name="liveUrl"
          label="Live URL"
          defaultValue={project?.liveUrl ?? ""}
          placeholder="https://..."
          hint="Optioneel: link naar de live website van dit project."
        />
        <TextField
          name="date"
          label="Datum"
          type="date"
          required
          defaultValue={project?.date ? project.date.slice(0, 10) : new Date().toISOString().slice(0, 10)}
        />
        <CheckboxField
          name="featured"
          label="Uitgelicht op homepagina"
          defaultChecked={project?.featured}
          hint="Toont dit project tussen de uitgelichte projecten op de homepagina."
        />
        <CheckboxField
          name="published"
          label="Gepubliceerd"
          defaultChecked={project?.published}
          hint="Alleen gepubliceerde projecten zijn zichtbaar voor bezoekers."
        />
      </FormSection>

      <div className="pt-1">
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
