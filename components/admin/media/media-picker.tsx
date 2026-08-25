"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { searchMediaAction } from "@/app/admin/media/actions";
import type { Media } from "@/lib/media/data";

export type MediaPickerProps = {
  open: boolean;
  onClose: () => void;
  /** Geeft de publieke URL terug plus de alt-tekst uit de bibliotheek. */
  onSelect: (url: string, altText: string) => void;
  title?: string;
};

type MediaPickerDialogProps = Omit<MediaPickerProps, "open">;

/**
 * Modal om een bestand uit de mediabibliotheek te kiezen.
 *
 * Bewust geen router-navigatie: de picker wordt gebruikt binnen formulieren die
 * nog niet opgeslagen zijn. De lijst komt via `searchMediaAction`, dezelfde
 * query als de bibliotheekpagina.
 *
 * De dialog zit in een apart component dat alleen bestaat zolang de picker
 * open is. Daardoor is "resetten bij openen" gewoon een nieuwe mount: geen
 * effect dat state terugzet, en dus geen synchrone setState in een effect.
 */
export function MediaPicker({ open, onClose, onSelect, title = "Kies een afbeelding" }: MediaPickerProps) {
  if (!open) {
    return null;
  }

  return <MediaPickerDialog onClose={onClose} onSelect={onSelect} title={title} />;
}

function MediaPickerDialog({ onClose, onSelect, title = "Kies een afbeelding" }: MediaPickerDialogProps) {
  const [items, setItems] = useState<Media[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef(0);

  const load = useCallback(async (term: string, targetPage: number) => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    setLoading(true);
    setError(null);

    try {
      const result = await searchMediaAction({ search: term, page: targetPage });

      // Een trager antwoord van een oudere zoekopdracht mag niet overschrijven.
      if (requestRef.current !== requestId) {
        return;
      }

      setItems(result.items);
      setPageCount(result.pageCount);
    } catch {
      if (requestRef.current === requestId) {
        setError("De bibliotheek kon niet geladen worden.");
        setItems([]);
      }
    } finally {
      if (requestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  // Focus bij openen. Alleen een DOM-actie, geen state.
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Debounce, zodat elke toetsaanslag geen server action afvuurt.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load(search, page);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search, page, load]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            Sluiten
          </button>
        </div>

        <div className="border-b border-slate-200 px-5 py-3">
          <label htmlFor="media-picker-search" className="sr-only">
            Zoeken
          </label>
          <input
            ref={searchRef}
            id="media-picker-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Zoek op bestandsnaam of alt-tekst"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="min-h-[12rem] flex-1 overflow-y-auto px-5 py-4">
          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          {!error && items.length === 0 ? (
            <p className="text-sm text-slate-600">
              {loading ? "Laden…" : "Geen bestanden gevonden."}
            </p>
          ) : null}

          {items.length > 0 ? (
            <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 ${loading ? "opacity-60" : ""}`}>
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(item.url, item.altText);
                      onClose();
                    }}
                    className="w-full overflow-hidden rounded-xl border border-slate-200 text-left hover:border-slate-900"
                  >
                    <span className="relative block aspect-square bg-slate-100">
                      {item.url ? (
                        <Image
                          src={item.url}
                          alt={item.altText || item.fileName}
                          fill
                          sizes="(min-width: 1024px) 20vw, 45vw"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    <span className="block truncate px-2 py-1.5 text-xs text-slate-700" title={item.fileName}>
                      {item.fileName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {pageCount > 1 ? (
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-3">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              Vorige
            </button>

            <p className="text-sm text-slate-600">
              Pagina {page} van {pageCount}
            </p>

            <button
              type="button"
              disabled={page >= pageCount || loading}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              Volgende
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
