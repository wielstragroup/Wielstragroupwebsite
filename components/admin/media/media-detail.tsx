"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  deleteMediaAction,
  purgeMediaAction,
  restoreMediaAction,
  updateMediaAction,
} from "@/app/admin/media/actions";
import type { Media, MediaUsageEntry } from "@/lib/media/data";

type MediaDetailProps = {
  media: Media;
  usage: MediaUsageEntry[];
};

const ENTITY_LABELS: Record<string, string> = {
  home_section: "Homepagina-sectie",
  project: "Project",
  site_setting: "Site-instelling",
};

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} kB`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

/** Alleen voor entiteiten waarvan het beheerpad zeker is. */
function usageHref(entry: MediaUsageEntry): string | null {
  return entry.entityType === "project" ? `/admin/projects/${entry.entityId}/edit` : null;
}

export function MediaDetail({ media, usage }: MediaDetailProps) {
  const [copied, setCopied] = useState(false);
  const [confirmForce, setConfirmForce] = useState(false);

  const inUse = usage.length > 0;
  const isDeleted = media.deletedAt !== null;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(media.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <div className="space-y-5">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative aspect-video bg-slate-100">
            {media.url ? (
              <Image
                src={media.url}
                alt={media.altText || media.fileName}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-contain"
              />
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Gegevens</h2>

          <form action={updateMediaAction} className="mt-3 space-y-4">
            <input type="hidden" name="id" value={media.id} />

            <div>
              <label htmlFor="media-alt" className="block text-sm font-medium text-slate-700">
                Alt-tekst
              </label>
              <input
                id="media-alt"
                name="altText"
                defaultValue={media.altText}
                maxLength={300}
                placeholder="Beschrijf wat er op de afbeelding te zien is"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              />
              <p className="mt-1 text-xs text-slate-500">
                Wordt voorgelezen door schermlezers en getoond als de afbeelding niet laadt.
              </p>
            </div>

            <div>
              <label htmlFor="media-caption" className="block text-sm font-medium text-slate-700">
                Bijschrift <span className="font-normal text-slate-500">(optioneel)</span>
              </label>
              <textarea
                id="media-caption"
                name="caption"
                rows={2}
                defaultValue={media.caption ?? ""}
                maxLength={1000}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Opslaan
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Gebruikt op</h2>

          {inUse ? (
            <ul className="mt-3 divide-y divide-slate-100 text-sm">
              {usage.map((entry) => {
                const href = usageHref(entry);
                const label = `${ENTITY_LABELS[entry.entityType] ?? entry.entityType} · ${entry.entityLabel}`;

                return (
                  <li key={`${entry.entityType}-${entry.entityId}-${entry.field}`} className="py-2">
                    {href ? (
                      <Link href={href} className="font-medium text-slate-900 underline hover:text-slate-600">
                        {label}
                      </Link>
                    ) : (
                      <span className="font-medium text-slate-900">{label}</span>
                    )}
                    <span className="ml-2 text-slate-500">{entry.field}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-600">Dit bestand wordt nergens gebruikt.</p>
          )}
        </section>
      </div>

      <div className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Bestand</h2>

          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Type</dt>
              <dd className="text-slate-900">{media.mimeType}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Grootte</dt>
              <dd className="text-slate-900">{formatSize(media.sizeBytes)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Afmetingen</dt>
              <dd className="text-slate-900">
                {media.width && media.height ? `${media.width} × ${media.height}` : "Onbekend"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Geüpload</dt>
              <dd className="text-slate-900">{formatDate(media.createdAt)}</dd>
            </div>
            {isDeleted ? (
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Verwijderd</dt>
                <dd className="text-amber-700">{formatDate(media.deletedAt as string)}</dd>
              </div>
            ) : null}
          </dl>

          <p className="mt-3 break-all rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">{media.url}</p>

          <button
            type="button"
            onClick={() => void copyUrl()}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            {copied ? "URL gekopieerd" : "URL kopiëren"}
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Beheer</h2>

          {isDeleted ? (
            <>
              <p className="mt-2 text-sm text-slate-600">
                Dit bestand staat in de prullenbak. Het bestand zelf staat er nog, dus bestaande verwijzingen werken
                gewoon.
              </p>

              <form action={restoreMediaAction} className="mt-3">
                <input type="hidden" name="id" value={media.id} />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Terugzetten
                </button>
              </form>

              <form action={purgeMediaAction} className="mt-2">
                <input type="hidden" name="id" value={media.id} />
                <button
                  type="submit"
                  disabled={inUse}
                  className="w-full rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Definitief wissen
                </button>
              </form>

              {inUse ? (
                <p className="mt-2 text-xs text-red-700">
                  Definitief wissen kan niet zolang het bestand ergens gebruikt wordt.
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-500">Het bestand wordt uit de opslag verwijderd. Dit is definitief.</p>
              )}
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-slate-600">
                Verwijderen haalt het bestand uit de bibliotheek, maar laat het in de opslag staan. Bestaande
                verwijzingen blijven dus werken.
              </p>

              <form action={deleteMediaAction} className="mt-3">
                <input type="hidden" name="id" value={media.id} />
                {confirmForce ? <input type="hidden" name="force" value="true" /> : null}

                {inUse ? (
                  <label className="mb-2 flex items-start gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={confirmForce}
                      onChange={(event) => setConfirmForce(event.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      Toch verwijderen, ook al wordt het op {usage.length}{" "}
                      {usage.length === 1 ? "plek" : "plekken"} gebruikt.
                    </span>
                  </label>
                ) : null}

                <button
                  type="submit"
                  disabled={inUse && !confirmForce}
                  className="w-full rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Verwijderen
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
