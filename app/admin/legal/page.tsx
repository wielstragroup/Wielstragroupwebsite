import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { formatLegalUpdatedDate, getAllLegalPages, LEGAL_PAGE_LABELS } from "@/lib/legal-pages";

export const metadata: Metadata = {
  title: "Juridische pagina's",
  robots: { index: false, follow: false },
};

export default async function AdminLegalPage() {
  await requireAdmin();
  const pages = await getAllLegalPages();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Juridische pagina&apos;s
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Privacybeleid, cookiebeleid, algemene voorwaarden en disclaimer bewerken.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Pagina</th>
              <th className="px-4 py-3">Laatst bijgewerkt</th>
              <th className="px-4 py-3">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pages.map((page) => (
              <tr key={page.slug}>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {LEGAL_PAGE_LABELS[page.slug]}
                </td>
                <td className="px-4 py-3 text-slate-700">{formatLegalUpdatedDate(page.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/legal/${page.slug}`}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                    >
                      Bewerken
                    </Link>
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                    >
                      Bekijken
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
