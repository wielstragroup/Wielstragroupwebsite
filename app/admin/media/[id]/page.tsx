import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MediaDetail } from "@/components/admin/media/media-detail";
import { requireAdmin } from "@/lib/auth";
import { getMedia, getMediaUsage } from "@/lib/media/data";

export const metadata: Metadata = {
  title: "Mediabestand",
  robots: { index: false, follow: false },
};

type AdminMediaDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function AdminMediaDetailPage({ params, searchParams }: AdminMediaDetailPageProps) {
  await requireAdmin();

  const { id } = await params;
  const { success, error } = await searchParams;

  const media = await getMedia(id);

  if (!media) {
    notFound();
  }

  // Altijd live afgeleid via media_usage(); er is geen koppeltabel.
  const usage = await getMediaUsage(media.storagePath);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-3xl font-semibold tracking-tight text-slate-950">{media.fileName}</h1>
        <Link
          href="/admin/media"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Terug naar bibliotheek
        </Link>
      </div>

      {success ? <p className="rounded-xl bg-emerald-100 px-4 py-2 text-sm text-emerald-900">{success}</p> : null}
      {error ? <p className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-900">{error}</p> : null}

      <MediaDetail media={media} usage={usage} />
    </div>
  );
}
