/**
 * Media library — data-access.
 *
 * Leest en schrijft `public.media` via de sessie-client, zodat RLS het
 * autorisatiewerk doet (geen service-role key in de app). Alle mapping van
 * snake_case naar camelCase gebeurt hier, in de stijl van `lib/projects.ts`.
 *
 * Leesoperaties zijn tolerant en geven een lege waarde bij een fout.
 * Schrijfoperaties geven expliciet een resultaatobject terug: de aanroeper
 * moet kunnen opruimen als een insert faalt nadat het bestand al geüpload is.
 */

import { hasSupabaseEnv } from "@/lib/env";
import { MEDIA_BUCKET, type MediaMimeType } from "@/lib/media/constants";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const MEDIA_PAGE_SIZE = 24;

export type Media = {
  id: string;
  bucket: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string;
  caption: string | null;
  checksum: string | null;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  url: string;
};

export type MediaUsageEntry = {
  entityType: string;
  entityId: string;
  entityLabel: string;
  field: string;
};

export type ListMediaOptions = {
  search?: string | null;
  mimeType?: string | null;
  page?: number;
  perPage?: number;
  includeDeleted?: boolean;
};

export type ListMediaResult = {
  items: Media[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
};

export type CreateMediaInput = {
  storagePath: string;
  fileName: string;
  mimeType: MediaMimeType;
  extension: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  altText?: string;
  caption?: string | null;
  checksum?: string | null;
  uploadedBy?: string | null;
  bucket?: string;
};

export type UpdateMediaInput = {
  altText?: string;
  caption?: string | null;
};

export type MediaMutationResult =
  | { ok: true; media: Media }
  | { ok: false; error: string };

export type MediaDeleteResult = { ok: true } | { ok: false; error: string };

const MEDIA_COLUMNS =
  "id,bucket,storage_path,file_name,mime_type,extension,size_bytes,width,height,alt_text,caption,checksum,uploaded_by,created_at,updated_at,deleted_at";

/**
 * Publieke URL van een bestand in een public bucket.
 * Bewust zelf samengesteld in plaats van via `storage.getPublicUrl()`, zodat
 * de mapping synchroon kan blijven en geen client nodig heeft.
 */
export function getMediaPublicUrl(storagePath: string, bucket: string = MEDIA_BUCKET): string {
  if (!hasSupabaseEnv()) {
    return "";
  }

  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");

  return `${base}/storage/v1/object/public/${bucket}/${storagePath}`;
}

function toNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function mapMedia(row: Record<string, unknown>): Media {
  const bucket = String(row.bucket ?? MEDIA_BUCKET);
  const storagePath = String(row.storage_path);

  return {
    id: String(row.id),
    bucket,
    storagePath,
    fileName: String(row.file_name),
    mimeType: String(row.mime_type),
    extension: String(row.extension),
    sizeBytes: Number(row.size_bytes ?? 0),
    width: toNumberOrNull(row.width),
    height: toNumberOrNull(row.height),
    altText: String(row.alt_text ?? ""),
    caption: row.caption ? String(row.caption) : null,
    checksum: row.checksum ? String(row.checksum) : null,
    uploadedBy: row.uploaded_by ? String(row.uploaded_by) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    deletedAt: row.deleted_at ? String(row.deleted_at) : null,
    url: getMediaPublicUrl(storagePath, bucket),
  };
}

/**
 * Maakt een zoekterm veilig voor de PostgREST `or()`-filter.
 * Komma's, haakjes en wildcards hebben daar syntactische betekenis.
 */
function sanitizeSearchTerm(raw: string): string {
  return raw
    .replace(/[,()*%\\"']/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export async function listMedia(options: ListMediaOptions = {}): Promise<ListMediaResult> {
  const perPage = options.perPage && options.perPage > 0 ? Math.min(options.perPage, 100) : MEDIA_PAGE_SIZE;
  const page = options.page && options.page > 0 ? Math.floor(options.page) : 1;

  const empty: ListMediaResult = { items: [], total: 0, page, perPage, pageCount: 0 };

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return empty;
  }

  let query = supabase.from("media").select(MEDIA_COLUMNS, { count: "exact" });

  if (!options.includeDeleted) {
    query = query.is("deleted_at", null);
  }

  if (options.mimeType) {
    query = query.eq("mime_type", options.mimeType);
  }

  const search = sanitizeSearchTerm(options.search ?? "");
  if (search !== "") {
    query = query.or(`file_name.ilike.%${search}%,alt_text.ilike.%${search}%`);
  }

  const from = (page - 1) * perPage;

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + perPage - 1);

  if (error || !data) {
    return empty;
  }

  const total = count ?? data.length;

  return {
    items: data.map((row) => mapMedia(row)),
    total,
    page,
    perPage,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getMedia(id: string): Promise<Media | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from("media").select(MEDIA_COLUMNS).eq("id", id).maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapMedia(data);
}

export async function getMediaByStoragePath(storagePath: string): Promise<Media | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("media")
    .select(MEDIA_COLUMNS)
    .eq("storage_path", storagePath)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapMedia(data);
}

/** Voor de dedup-melding bij upload: is dit bestand er al? */
export async function findMediaByChecksum(checksum: string): Promise<Media | null> {
  if (!checksum) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("media")
    .select(MEDIA_COLUMNS)
    .eq("checksum", checksum)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapMedia(data);
}

/**
 * Waar wordt dit bestand gebruikt? Afgeleid door `public.media_usage()`;
 * er is geen koppeltabel die uit de pas kan lopen.
 */
export async function getMediaUsage(storagePath: string): Promise<MediaUsageEntry[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.rpc("media_usage", { p_path: storagePath });

  if (error || !Array.isArray(data)) {
    return [];
  }

  return data.map((row: Record<string, unknown>) => ({
    entityType: String(row.entity_type ?? ""),
    entityId: String(row.entity_id ?? ""),
    entityLabel: String(row.entity_label ?? ""),
    field: String(row.field ?? ""),
  }));
}

export async function createMedia(input: CreateMediaInput): Promise<MediaMutationResult> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is niet geconfigureerd." };
  }

  const { data, error } = await supabase
    .from("media")
    .insert({
      bucket: input.bucket ?? MEDIA_BUCKET,
      storage_path: input.storagePath,
      file_name: input.fileName,
      mime_type: input.mimeType,
      extension: input.extension,
      size_bytes: input.sizeBytes,
      width: input.width ?? null,
      height: input.height ?? null,
      alt_text: input.altText ?? "",
      caption: input.caption ?? null,
      checksum: input.checksum ?? null,
      uploaded_by: input.uploadedBy ?? null,
    })
    .select(MEDIA_COLUMNS)
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Opslaan van de metadata is mislukt." };
  }

  return { ok: true, media: mapMedia(data) };
}

export async function updateMedia(id: string, input: UpdateMediaInput): Promise<MediaMutationResult> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is niet geconfigureerd." };
  }

  const payload: Record<string, unknown> = {};

  if (input.altText !== undefined) {
    payload.alt_text = input.altText;
  }

  if (input.caption !== undefined) {
    payload.caption = input.caption;
  }

  if (Object.keys(payload).length === 0) {
    const existing = await getMedia(id);

    return existing ? { ok: true, media: existing } : { ok: false, error: "Bestand niet gevonden." };
  }

  const { data, error } = await supabase
    .from("media")
    .update(payload)
    .eq("id", id)
    .select(MEDIA_COLUMNS)
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Bijwerken is mislukt." };
  }

  return { ok: true, media: mapMedia(data) };
}

/** Zet `deleted_at`. Het bestand in de bucket blijft staan. */
export async function softDeleteMedia(id: string): Promise<MediaMutationResult> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is niet geconfigureerd." };
  }

  const { data, error } = await supabase
    .from("media")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select(MEDIA_COLUMNS)
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Verwijderen is mislukt." };
  }

  return { ok: true, media: mapMedia(data) };
}

/**
 * Verwijdert alleen de databaserij. Het bestand uit de bucket halen gebeurt
 * in de server action, waar de volgorde en foutafhandeling thuishoren.
 */
export async function hardDeleteMedia(id: string): Promise<MediaDeleteResult> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is niet geconfigureerd." };
  }

  const { error } = await supabase.from("media").delete().eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
