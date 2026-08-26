import Image from "next/image";
import Link from "next/link";

import type { Media } from "@/lib/media/data";

type MediaGridProps = {
  items: Media[];
};

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} kB`;
}

export function MediaGrid({ items }: MediaGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((item) => (
        <li
          key={item.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-900"
        >
          <Link href={`/admin/media/${item.id}`} className="block">
            <div className="relative aspect-square bg-slate-100">
              {item.url ? (
                <Image
                  src={item.url}
                  alt={item.altText || item.fileName}
                  fill
                  sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="space-y-1 p-3">
              <p className="truncate text-sm font-medium text-slate-900" title={item.fileName}>
                {item.fileName}
              </p>
              <p className="text-xs text-slate-500">
                {item.width && item.height ? `${item.width} × ${item.height} · ` : ""}
                {formatSize(item.sizeBytes)}
              </p>
              {item.altText ? null : (
                <p className="text-xs font-medium text-amber-700">Geen alt-tekst</p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
