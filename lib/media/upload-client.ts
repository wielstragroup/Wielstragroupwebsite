/**
 * Directe-uploadflow, browserzijde.
 *
 * Bestandsbytes gaan hier nooit naar een Server Action — dat is precies wat
 * de "Body exceeded 1 MB limit"-fout veroorzaakte. In plaats daarvan:
 *
 *   1. Client valideert en sniffed het bestand (dezelfde pure functie als de
 *      server ooit gebruikte, hier hergebruikt).
 *   2. Client berekent de checksum (Web Crypto) en vraagt de server of dit
 *      bestand al bestaat — zo niet, dan pas uploaden.
 *   3. Client uploadt rechtstreeks naar Supabase Storage met de sessie van de
 *      ingelogde beheerder (RLS dwingt `is_admin()` af; geen service-role key).
 *   4. Client stuurt alleen het pad + metadata naar `attachMediaAction`, die
 *      de databaserij aanmaakt.
 */

import { attachMediaAction, checkDuplicateMediaAction } from "@/app/admin/media/actions";
import type { Media } from "@/lib/media/data";
import { MEDIA_BUCKET, MEDIA_MAX_SIZE_BYTES } from "@/lib/media/constants";
import { buildMediaStoragePath, validateMediaUpload } from "@/lib/media/validate";
import { createClient } from "@/lib/supabase/client";

export type DirectUploadResult =
  | { ok: true; media: Media; duplicate: boolean }
  | { ok: false; error: string };

export type UploadImageOptions = {
  /** Standaard de limiet van de mediabibliotheek (10MB). */
  maxSizeBytes?: number;
};

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Puur metadata, niet security-kritisch: de bytes zijn al gevalideerd. */
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

export async function uploadImageDirect(file: File, options: UploadImageOptions = {}): Promise<DirectUploadResult> {
  const maxSizeBytes = options.maxSizeBytes ?? MEDIA_MAX_SIZE_BYTES;

  if (file.size === 0) {
    return { ok: false, error: "Het bestand is leeg." };
  }

  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));

    return { ok: false, error: `Deze afbeelding is te groot. Maximaal ${maxMb} MB toegestaan.` };
  }

  let bytes: Uint8Array;

  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch {
    return { ok: false, error: "Het bestand kon niet worden gelezen." };
  }

  const validation = validateMediaUpload({ bytes, reportedMimeType: file.type, fileName: file.name });

  if (!validation.ok) {
    return { ok: false, error: validation.message };
  }

  const checksum = await sha256Hex(bytes);

  try {
    const duplicate = await checkDuplicateMediaAction(checksum);
    if (duplicate) {
      return { ok: true, media: duplicate, duplicate: true };
    }
  } catch {
    // Dedup-check mag nooit de upload blokkeren; gewoon doorgaan als nieuw bestand.
  }

  const dimensions = await readDimensions(file);
  const storagePath = buildMediaStoragePath(validation.extension);

  const supabase = createClient();
  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(storagePath, bytes, {
    contentType: validation.mimeType,
    cacheControl: "31536000",
    upsert: false,
  });

  if (uploadError) {
    return {
      ok: false,
      error: `Uploaden naar de opslag is mislukt (${uploadError.message}). Controleer je verbinding en probeer het opnieuw.`,
    };
  }

  let attached: Awaited<ReturnType<typeof attachMediaAction>>;

  try {
    attached = await attachMediaAction({
      storagePath,
      fileName: validation.fileName,
      mimeType: validation.mimeType,
      sizeBytes: validation.sizeBytes,
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
      checksum,
    });
  } catch {
    return { ok: false, error: "Opslaan van de bestandsgegevens is mislukt. Probeer het opnieuw." };
  }

  if (!attached.ok) {
    return { ok: false, error: attached.error };
  }

  return { ok: true, media: attached.media, duplicate: attached.duplicate };
}
