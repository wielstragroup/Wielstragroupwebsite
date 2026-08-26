"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

import { uploadMediaAction } from "@/app/admin/media/actions";
import { ALLOWED_MEDIA_MIME_TYPES, MEDIA_MAX_SIZE_BYTES } from "@/lib/media/constants";

type UploadStatus = "pending" | "uploading" | "done" | "duplicate" | "error";

type UploadEntry = {
  id: string;
  fileName: string;
  status: UploadStatus;
  message?: string;
};

const ACCEPT = ALLOWED_MEDIA_MIME_TYPES.join(",");
const MAX_MB = Math.round(MEDIA_MAX_SIZE_BYTES / (1024 * 1024));

/**
 * Afmetingen client-side bepalen. Puur metadata, niet security-kritisch:
 * de server valideert het bestand zelf op bytes.
 */
async function readDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (typeof createImageBitmap !== "function") {
    return null;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();

    return dimensions;
  } catch {
    return null;
  }
}

const STATUS_STYLES: Record<UploadStatus, string> = {
  pending: "text-slate-500",
  uploading: "text-slate-700",
  done: "text-emerald-700",
  duplicate: "text-amber-700",
  error: "text-red-700",
};

const STATUS_LABELS: Record<UploadStatus, string> = {
  pending: "In wachtrij",
  uploading: "Bezig…",
  done: "Geüpload",
  duplicate: "Stond er al",
  error: "Mislukt",
};

export function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [entries, setEntries] = useState<UploadEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const updateEntry = (id: string, patch: Partial<UploadEntry>) => {
    setEntries((previous) => previous.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  };

  const processFiles = async (files: File[]) => {
    if (files.length === 0 || busy) {
      return;
    }

    const queued: UploadEntry[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      fileName: file.name,
      status: "pending",
    }));

    setEntries(queued);
    setBusy(true);

    // Sequentieel: één mislukt bestand mag de rest niet meeslepen.
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const entry = queued[index];

      updateEntry(entry.id, { status: "uploading" });

      const formData = new FormData();
      formData.append("file", file);

      const dimensions = await readDimensions(file);
      if (dimensions) {
        formData.append("width", String(dimensions.width));
        formData.append("height", String(dimensions.height));
      }

      try {
        const result = await uploadMediaAction(formData);

        if (result.ok) {
          updateEntry(entry.id, {
            status: result.duplicate ? "duplicate" : "done",
            message: result.duplicate ? `Bestaat al als ${result.media.fileName}` : undefined,
          });
        } else {
          updateEntry(entry.id, { status: "error", message: result.error });
        }
      } catch {
        updateEntry(entry.id, { status: "error", message: "Er ging iets mis tijdens het uploaden." });
      }
    }

    setBusy(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    router.refresh();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    void processFiles(Array.from(event.target.files ?? []));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    void processFiles(Array.from(event.dataTransfer.files ?? []));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Uploaden</h2>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragOver(false);
        }}
        onDrop={handleDrop}
        className={`mt-3 rounded-xl border-2 border-dashed p-6 text-center transition ${
          dragOver ? "border-slate-900 bg-slate-50" : "border-slate-300"
        }`}
      >
        <p className="text-sm text-slate-600">
          <span className="hidden sm:inline">Sleep bestanden hierheen, of k</span>
          <span className="sm:hidden">K</span>ies ze hieronder.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          disabled={busy}
          onChange={handleChange}
          className="mt-3 w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700 disabled:opacity-50"
        />

        <p className="mt-2 text-xs text-slate-500">JPEG, PNG, WebP of AVIF · maximaal {MAX_MB} MB per bestand</p>
      </div>

      {entries.length > 0 ? (
        <ul className="mt-4 space-y-1.5">
          {entries.map((entry) => (
            <li key={entry.id} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
              <span className="truncate font-medium text-slate-800">{entry.fileName}</span>
              <span className={STATUS_STYLES[entry.status]}>
                {STATUS_LABELS[entry.status]}
                {entry.message ? ` — ${entry.message}` : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
