import type { Metadata } from "next";
import Link from "next/link";

import {
  createSectionAction,
  deleteSectionAction,
  duplicateSectionAction,
  moveSectionAction,
  reorderSectionsAction,
  toggleSectionAction,
} from "@/app/admin/home/actions";
import { SectionList } from "@/app/admin/home/_components/section-list";
import { StatusMessage } from "@/components/admin/form-fields";
import { requireAdmin } from "@/lib/auth";
import { getAllHomeSections } from "@/lib/sections/data";
import {
  SECTION_DESCRIPTIONS,
  SECTION_LABELS,
  SECTION_TYPES,
} from "@/lib/sections/schema";

export const metadata: Metadata = {
  title: "Homepagina",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  await requireAdmin();

  const sections = await getAllHomeSections();
  const { success, error } = await searchParams;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Homepagina
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Sleep secties om de volgorde te wijzigen, of gebruik de pijlen. Een
          verborgen sectie wordt niet op de website getoond.
        </p>
      </div>

      <StatusMessage success={success} error={error} />

      {sections.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Er zijn nog geen secties. Voer de database-migratie uit of voeg
          hieronder een sectie toe.
        </p>
      ) : (
        <>
          {/* Sleepbare lijst (vereist JavaScript) */}
          <SectionList
            items={sections.map((section) => ({
              id: section.id,
              type: section.type,
              typeLabel: SECTION_LABELS[section.type],
              adminLabel: section.adminLabel,
              enabled: section.enabled,
            }))}
            reorderAction={reorderSectionsAction}
          />

          {/* Acties per sectie. Werkt ook zonder JavaScript en op touch. */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Acties per sectie
            </h2>
            <ul className="divide-y divide-slate-100">
              {sections.map((section, index) => (
                <li
                  key={section.id}
                  className="flex flex-wrap items-center gap-2 py-3"
                >
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-800">
                    {section.adminLabel || SECTION_LABELS[section.type]}
                  </span>

                  <form action={moveSectionAction}>
                    <input type="hidden" name="id" value={section.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={index === 0}
                      aria-label="Omhoog verplaatsen"
                      className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ↑
                    </button>
                  </form>

                  <form action={moveSectionAction}>
                    <input type="hidden" name="id" value={section.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={index === sections.length - 1}
                      aria-label="Omlaag verplaatsen"
                      className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ↓
                    </button>
                  </form>

                  <form action={toggleSectionAction}>
                    <input type="hidden" name="id" value={section.id} />
                    <input
                      type="hidden"
                      name="value"
                      value={section.enabled ? "false" : "true"}
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100"
                    >
                      {section.enabled ? "Verbergen" : "Tonen"}
                    </button>
                  </form>

                  <form action={duplicateSectionAction}>
                    <input type="hidden" name="id" value={section.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100"
                    >
                      Dupliceren
                    </button>
                  </form>

                  <Link
                    href={`/admin/home/${section.id}`}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100"
                  >
                    Bewerken
                  </Link>

                  <form action={deleteSectionAction}>
                    <input type="hidden" name="id" value={section.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-700 transition hover:bg-red-50"
                    >
                      Verwijderen
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* Nieuwe sectie toevoegen */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Sectie toevoegen
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Een nieuwe sectie wordt onderaan toegevoegd en staat eerst
          uitgeschakeld, zodat je hem eerst kunt invullen.
        </p>

        <form
          action={createSectionAction}
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="flex flex-1 flex-col gap-1.5 text-sm">
            <span className="font-medium text-slate-800">Type</span>
            <select
              name="type"
              defaultValue="text"
              className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              {SECTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {SECTION_LABELS[type]} — {SECTION_DESCRIPTIONS[type]}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Toevoegen
          </button>
        </form>
      </section>
    </div>
  );
}
