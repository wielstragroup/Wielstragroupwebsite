import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateSectionAction } from "@/app/admin/home/actions";
import { SectionFields } from "@/app/admin/home/[id]/_components/section-fields";
import { StatusMessage, TextField } from "@/components/admin/form-fields";
import { requireAdmin } from "@/lib/auth";
import { getHomeSectionById } from "@/lib/sections/data";
import {
  parseSectionContent,
  SECTION_DESCRIPTIONS,
  SECTION_LABELS,
} from "@/lib/sections/schema";

export const metadata: Metadata = {
  title: "Sectie bewerken",
  robots: { index: false, follow: false },
};

export default async function EditSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const section = await getHomeSectionById(id);

  if (!section) {
    notFound();
  }

  const { success, error } = await searchParams;
  const content = parseSectionContent(section.type, section.content);

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/admin/home"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <span aria-hidden="true">←</span>
          <span>Terug naar secties</span>
        </Link>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {section.adminLabel || SECTION_LABELS[section.type]}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {SECTION_LABELS[section.type]} — {SECTION_DESCRIPTIONS[section.type]}
        </p>
      </div>

      <StatusMessage success={success} error={error} />

      <form action={updateSectionAction} className="space-y-5">
        <input type="hidden" name="id" value={section.id} />

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="adminLabel"
              label="Naam in dashboard"
              defaultValue={section.adminLabel}
              hint="Alleen voor jezelf; niet zichtbaar op de website."
              maxLength={120}
            />
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm sm:col-span-2">
              <input
                type="checkbox"
                name="enabled"
                defaultChecked={section.enabled}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-400"
              />
              <span>
                <span className="font-medium text-slate-800">
                  Sectie tonen op de website
                </span>
                <span className="block text-xs text-slate-500">
                  Uitgeschakelde secties blijven bewaard maar worden niet
                  gerenderd.
                </span>
              </span>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">Inhoud</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <SectionFields type={section.type} content={content} />
          </div>
        </section>

        <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Sectie opslaan
          </button>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Homepagina bekijken
          </Link>
        </div>
      </form>
    </div>
  );
}
