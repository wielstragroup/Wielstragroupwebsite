"use client";

import { useEffect, useState, type DragEvent } from "react";
import Link from "next/link";

export type SectionListItem = {
  id: string;
  type: string;
  typeLabel: string;
  adminLabel: string;
  enabled: boolean;
};

/**
 * Sleepbare sectielijst.
 *
 * Werkt met de native HTML drag & drop API zodat er geen extra
 * dependency nodig is. Op touch-apparaten is slepen onbetrouwbaar,
 * daarom staan er altijd ook omhoog/omlaag-knoppen. Die knoppen zijn
 * gewone form-submits naar een server action, dus alles blijft werken
 * zonder JavaScript.
 */
export function SectionList({
  items,
  reorderAction,
}: {
  items: SectionListItem[];
  reorderAction: (formData: FormData) => void;
}) {
  const [order, setOrder] = useState(items);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  // Wanneer de server nieuwe data teruggeeft (na opslaan of een
  // andere actie) de lokale volgorde weer gelijktrekken.
  useEffect(() => {
    setOrder(items);
    setDirty(false);
  }, [items]);

  function handleDragStart(id: string) {
    setDraggingId(id);
  }

  function handleDragOver(event: DragEvent<HTMLLIElement>, overId: string) {
    event.preventDefault();

    if (!draggingId || draggingId === overId) {
      return;
    }

    setOrder((current) => {
      const from = current.findIndex((item) => item.id === draggingId);
      const to = current.findIndex((item) => item.id === overId);

      if (from === -1 || to === -1) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved!);
      return next;
    });

    setDirty(true);
  }

  function handleDragEnd() {
    setDraggingId(null);
  }

  return (
    <div className="space-y-3">
      {dirty ? (
        <form action={reorderAction}>
          <input type="hidden" name="order" value={order.map((i) => i.id).join(",")} />
          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
            <span className="flex-1">De volgorde is gewijzigd maar nog niet opgeslagen.</span>
            <button
              type="submit"
              className="rounded-lg bg-amber-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-800"
            >
              Volgorde opslaan
            </button>
            <button
              type="button"
              onClick={() => {
                setOrder(items);
                setDirty(false);
              }}
              className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
            >
              Ongedaan maken
            </button>
          </div>
        </form>
      ) : null}

      <ul className="space-y-2">
        {order.map((item, index) => (
          <li
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(item.id)}
            onDragOver={(event) => handleDragOver(event, item.id)}
            onDragEnd={handleDragEnd}
            className={`rounded-2xl border bg-white p-3 shadow-sm transition sm:p-4 ${
              draggingId === item.id
                ? "border-slate-400 opacity-60"
                : "border-slate-200"
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                aria-hidden="true"
                className="cursor-grab select-none text-slate-400 active:cursor-grabbing"
                title="Sleep om te verplaatsen"
              >
                ☰
              </span>

              <span className="w-6 shrink-0 text-xs font-semibold text-slate-400">
                {index + 1}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {item.adminLabel || item.typeLabel}
                </p>
                <p className="text-xs text-slate-500">{item.typeLabel}</p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  item.enabled
                    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                    : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                {item.enabled ? "Zichtbaar" : "Verborgen"}
              </span>

              <Link
                href={`/admin/home/${item.id}`}
                className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Bewerken
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
