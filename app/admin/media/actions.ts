"use server";

import { createHash } from "node:crypto";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { MEDIA_BUCKET } from "@/lib/media/constants";
import { createMedia, findMediaByChecksum, type Media } from "@/lib/media/data";
import { buildMediaStoragePath, validateMediaUpload } from "@/lib/media/validate";

export type UploadMediaResult =
  | { ok: true; media: Media; duplicate: boolean }
  | { ok: false; error: string };

/**
 * In-process rate limit op uploads, per admin.
 *
 * LET OP: dit dupliceert de limiter uit de security-commit. Zodra het pad en
 * de signatuur van die helper bekend zijn, moet dit blok daardoor vervangen
 * worden. Net als die andere is dit per instance; op meerdere serverless
 * instances telt elke instance apart. Voor admin-only uploads is dat genoeg:
 * het doel is een misgelopen script afremmen, niet een DDoS tegenhouden.
 */
const UPLOAD_LIMIT = 20;
const UPLOAD_WINDOW_MS = 5 * 60 * 1000;

const uploadHits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (uploadHits.get(key) ?? []).filter((timestamp) => now - timestamp < UPLOAD_WINDOW_MS);

  if (recent.length >= UPLOAD_LIMIT) {
    uploadHits.set(key, recent);

    return true;
  }

  recent.push(now);
  uploadHits.set(key, recent);

  // Voorkomt dat de map onbeperkt groeit bij veel verschillende sleutels.
  if (uploadHits.size > 500) {
    for (const [existingKey, timestamps] of uploadHits) {
      if (timestamps.every((timestamp) => now - timestamp >= UPLOAD_WINDOW_MS)) {
        uploadHits.delete(existingKey);
      }
    }
  }

  return false;
}

function parseDimension(value: FormDataEntryValue | null): number | null {
  const parsed = Number.parseInt(String(value ?? ""), 10);

  return Number.isFinite(parsed) && parsed > 0 && parsed <= 100000 ? parsed : null;
}

export async function uploadMediaAction(formData: FormData): Promise<UploadMediaResult> {
  const { supabase, user } = await requireAdmin();

  if (isRateLimited(user.id)) {
    return { ok: false, error: "Te veel uploads achter elkaar. Probeer het over een paar minuten opnieuw." };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { ok: false, error: "Geen bestand ontvangen." };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  const validation = validateMediaUpload({
    bytes,
    reportedMimeType: file.type,
    fileName: file.name,
  });

  if (!validation.ok) {
    return { ok: false, error: validation.message };
  }

  // Server-side berekend, niet aangeleverd door de client.
  const checksum = createHash("sha256").update(bytes).digest("hex");

  const existing = await findMediaByChecksum(checksum);
  if (existing) {
    return { ok: true, media: existing, duplicate: true };
  }

  const storagePath = buildMediaStoragePath(validation.extension);

  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(storagePath, bytes, {
    contentType: validation.mimeType,
    cacheControl: "31536000",
    upsert: false,
  });

  if (uploadError) {
    return { ok: false, error: `Upload mislukt: ${uploadError.message}` };
  }

  const created = await createMedia({
    storagePath,
    fileName: validation.fileName,
    mimeType: validation.mimeType,
    extension: validation.extension,
    sizeBytes: validation.sizeBytes,
    width: parseDimension(formData.get("width")),
    height: parseDimension(formData.get("height")),
    checksum,
    uploadedBy: user.id,
  });

  if (!created.ok) {
    // Geen weesbestanden: het net geüploade bestand weer opruimen.
    await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);

    return { ok: false, error: created.error };
  }

  revalidatePath("/admin/media");

  return { ok: true, media: created.media, duplicate: false };
}
