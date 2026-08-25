import type { Metadata } from "next";
import Link from "next/link";

import { MediaGrid } from "@/components/admin/media/media-grid";
import { requireAdmin } from "@/lib/auth";
import { ALLOWED_MEDIA_MIME_TYPES } from "@/lib/media/constants";
import { listMedia } from "@/lib/media/data";

export const metadata: Metadata = {
  title: "Mediabibliotheek",
  robots: { index: false, follow: false },
};

const MIME_TYPE_LABELS: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "image/avif": "AVIF",
};

type AdminMediaPageProps = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    page?: string;
    success?: string;
    error?: string;
  }>;
};

function parsePage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "1", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

/** Bouwt een link naar dezelfde pagina met alleen `page` gewijzigd. */
function buildPageHref(page: number, search: string, mimeType: string): string {
  const params = new URLSearchParams();

  if (search) {
    params.set("q", search);
  }

  if (mimeType) {
    params.set("type", mimeType);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/admin/media?${query}` : "/admin/media";
}

export default async function AdminMediaPage({ searchParams }: AdminMediaPageProps) {
  await requireAdmin();

  const { q, type, page, success, error } = await searchParams;

  const search = (q ?? "").trim();
  const mimeType = (ALLOWED_MEDIA_MIME_TYPES as readonly string[]).includes(type ?? "") ? (type as string) : "";
  const currentPage = parsePage(page);

  const result = await listMedia({
    search,
    mimeType: mimeType || null,
    page: currentPage,
  });

  const hasFilters = search !== "" || mimeType !== "";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Mediabibliotheek</h1>
        <p className="text-sm text-slate-500">
          {result.total} {result.total === 1 ? "bestand" : "bestanden"}
        </p>
      </div>

      {success ? <p className="rounded-xl bg-emerald-100 px-4 py-2 text-sm text-emerald-900">{success}</p> : null}
      {error ? <p className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-900">{error}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form method="get" className="flex flex-wrap items-end gap-3">
          <div className="min-w-[12rem] flex-1">
            <label htmlFor="media-search" className="block text-sm font-medium text-slate-700">
              Zoeken
            </label>
            <input
              id="media-search"
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Bestandsnaam of alt-tekst"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label htmlFor="media-type" className="block text-sm font-medium text-slate-700">
              Type
            </label>
            <select
              id="media-type"
              name="type"
              defaultValue={mimeType}
              className="mt-1 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
            >
              <option value="">Alle types</option>
              {ALLOWED_MEDIA_MIME_TYPES.map((value) => (
                <option key={value} value={value}>
                  {MIME_TYPE_LABELS[value] ?? value}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Filteren
          </button>

          {hasFilters ? (
            <Link
              href="/admin/media"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Wissen
            </Link>
          ) : null}
        </form>
      </section>

      {result.items.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            {hasFilters ? "Geen bestanden gevonden." : "Er staat nog niets in de mediabibliotheek."}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {hasFilters
              ? "Pas de zoekterm of het filter aan."
              : "Uploaden kan zodra die functie beschikbaar is."}
          </p>
        </section>
      ) : (
        <MediaGrid items={result.items} />
      )}

      {result.pageCount > 1 && (
  <nav className="flex items-center justify-between gap-3" aria-label="Paginering">
          {currentPage > 1 ? (
            <Link
              href={buildPageHref(currentPage - 1, search, mimeType)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Vorige
            </Link>
          ) : (
            <span className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-400">Vorige</span>
          )}

          <p className="text-sm text-slate-600">
            Pagina {currentPage} van {result.pageCount}
          </p>

          {currentPage < result.pageCount ? (
            <Link
              href={buildPageHref(currentPage + 1, search, mimeType)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Volgende
            </Link>
          ) : (
            <span className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-400">Volgende</span>
          )}
                </nav>
      )}
    </div>
  );
}
