"use server";

import { createHash } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { ALLOWED_MEDIA_MIME_TYPES, MEDIA_BUCKET } from "@/lib/media/constants";
import {
  createMedia,
  findMediaByChecksum,
  getMedia,
  getMediaUsage,
  hardDeleteMedia,
  listMedia,
  restoreMedia,
  softDeleteMedia,
  updateMedia,
  type Media,
} from "@/lib/media/data";
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

function requireId(formData: FormData): string {
  const id = String(formData.get("id") ?? "").trim();

  if (id === "") {
    redirect("/admin/media?error=Ongeldige+aanvraag");
  }

  return id;
}

function detailHref(id: string, key: "success" | "error", message: string): string {
  return `/admin/media/${id}?${key}=${encodeURIComponent(message)}`;
}

function revalidateMedia(id?: string) {
  revalidatePath("/admin/media");

  if (id) {
    revalidatePath(`/admin/media/${id}`);
  }
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

/** Alt-tekst en bijschrift bijwerken. Meer velden zijn niet bewerkbaar. */
export async function updateMediaAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = requireId(formData);

  const altText = String(formData.get("altText") ?? "").trim().slice(0, 300);
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 1000);

  const result = await updateMedia(id, {
    altText,
    caption: caption === "" ? null : caption,
  });

  if (!result.ok) {
    redirect(detailHref(id, "error", result.error));
  }

  revalidateMedia(id);
  redirect(detailHref(id, "success", "Gegevens opgeslagen"));
}

/**
 * Soft delete: zet `deleted_at`, het bestand blijft in de bucket staan.
 *
 * Daardoor breken bestaande verwijzingen op de site niet — het bestand
 * verdwijnt alleen uit de bibliotheek. Is het nog in gebruik, dan blokkeren we
 * standaard; met `force` gaat het alsnog door, maar de verwijzingen worden
 * NIET herschreven (dat hoort bij `replaceMediaAction`, buiten v1-scope).
 */
export async function deleteMediaAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = requireId(formData);
  const force = String(formData.get("force") ?? "") === "true";

  const media = await getMedia(id);

  if (!media) {
    redirect("/admin/media?error=Bestand+niet+gevonden");
  }

  const usage = await getMediaUsage(media.storagePath);

  if (usage.length > 0 && !force) {
    redirect(
      detailHref(
        id,
        "error",
        `Dit bestand wordt nog op ${usage.length} ${usage.length === 1 ? "plek" : "plekken"} gebruikt.`
      )
    );
  }

  const result = await softDeleteMedia(id);

  if (!result.ok) {
    redirect(detailHref(id, "error", result.error));
  }

  revalidateMedia(id);
  redirect("/admin/media?success=Bestand+naar+de+prullenbak+verplaatst");
}

/** Terughalen uit de prullenbak. */
export async function restoreMediaAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = requireId(formData);
  const result = await restoreMedia(id);

  if (!result.ok) {
    redirect(detailHref(id, "error", result.error));
  }

  revalidateMedia(id);
  redirect(detailHref(id, "success", "Bestand teruggezet"));
}

/**
 * Definitief wissen: eerst de rij, dan het bestand.
 *
 * Die volgorde is bewust. Blijft er een bestand achter zonder rij, dan kost dat
 * alleen opslag. Andersom — een rij zonder bestand — levert kapotte
 * afbeeldingen op in de bibliotheek. Bij gebruik is dit altijd geblokkeerd,
 * ook met force: het bestand weghalen breekt de live site.
 */
export async function purgeMediaAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();

  const id = requireId(formData);
  const media = await getMedia(id);

  if (!media) {
    redirect("/admin/media?error=Bestand+niet+gevonden");
  }

  const usage = await getMediaUsage(media.storagePath);

  if (usage.length > 0) {
    redirect(detailHref(id, "error", "Dit bestand is nog in gebruik en kan niet definitief worden gewist."));
  }

  const removed = await hardDeleteMedia(id);

  if (!removed.ok) {
    redirect(detailHref(id, "error", removed.error));
  }

  const { error } = await supabase.storage.from(media.bucket).remove([media.storagePath]);

  revalidateMedia(id);
  redirect(
    error
      ? "/admin/media?status=deleted&error=Rij+gewist%2C+maar+het+bestand+kon+niet+worden+opgeruimd"
      : "/admin/media?status=deleted&success=Definitief+verwijderd"
  );
}

export type MediaSearchInput = {
  search?: string;
  mimeType?: string;
  page?: number;
};

export type MediaSearchResult = {
  items: Media[];
  page: number;
  pageCount: number;
  total: number;
};

/**
 * Lijstquery voor de MediaPicker. De picker is een client component en kan
 * `listMedia()` niet zelf aanroepen; dit is de dunne serverzijde ervan.
 */
export async function searchMediaAction(input: MediaSearchInput = {}): Promise<MediaSearchResult> {
  await requireAdmin();

  const mimeType = (ALLOWED_MEDIA_MIME_TYPES as readonly string[]).includes(input.mimeType ?? "")
    ? (input.mimeType as string)
    : null;

  const result = await listMedia({
    search: (input.search ?? "").trim(),
    mimeType,
    page: input.page,
  });

  return {
    items: result.items,
    page: result.page,
    pageCount: result.pageCount,
    total: result.total,
  };
}