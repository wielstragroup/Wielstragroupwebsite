import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { updateLegalPageAction } from "@/app/admin/legal/actions";
import { FormSection, StatusMessage, TextAreaField, TextField } from "@/components/admin/form-fields";
import { requireAdmin } from "@/lib/auth";
import { getLegalPage, isLegalPageSlug, LEGAL_PAGE_LABELS } from "@/lib/legal-pages";

export const metadata: Metadata = {
  title: "Juridische pagina bewerken",
  robots: { index: false, follow: false },
};

export default async function AdminLegalEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;

  if (!isLegalPageSlug(slug)) {
    notFound();
  }

  const [page, { success, error }] = await Promise.all([getLegalPage(slug), searchParams]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {LEGAL_PAGE_LABELS[slug]} bewerken
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Gebruik <code>## Kop</code> voor een kop, <code>- tekst</code> voor een lijst,{" "}
          <code>**vet**</code> voor vetgedrukte tekst en <code>[link](url)</code> voor een link.
          Met <code>{"{{companyName}}"}</code>, <code>{"{{email}}"}</code>, <code>{"{{phone}}"}</code>{" "}
          en <code>{"{{address}}"}</code> verwijs je naar de bedrijfsgegevens uit de
          website-instellingen, zodat die overal automatisch kloppen.
        </p>
      </div>

      <StatusMessage success={success} error={error} />

      <form action={updateLegalPageAction} className="space-y-5">
        <input type="hidden" name="slug" value={slug} />

        <FormSection
          title="Inhoud"
          description="Deze tekst wordt getoond op de publieke pagina."
        >
          <TextField name="title" label="Titel" defaultValue={page.title} required maxLength={150} full />
          <TextAreaField
            name="intro"
            label="Introductietekst"
            defaultValue={page.intro}
            rows={2}
            maxLength={600}
          />
          <TextAreaField
            name="content"
            label="Inhoud"
            defaultValue={page.content}
            rows={28}
            maxLength={20000}
          />
        </FormSection>

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Opslaan
        </button>
      </form>
    </div>
  );
}
